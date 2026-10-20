"""
ElderSteady Python Pose Backend (FastAPI + WebSocket)
Runs local YOLOv8n-pose detection at 5 FPS and broadcasts keypoints + fall events.
Ensures zero video leaves the device; only structured coordinates and metrics are streamed.
"""

import asyncio
import json
import logging
import time
from datetime import datetime, timezone
from typing import Set, Optional
import cv2
import numpy as np
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from pose_detector import PoseDetector
from fall_logic import FallDetector

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("eldersteady.server")

app = FastAPI(
    title="ElderSteady Edge Pose Backend",
    description="Local YOLOv8n-pose processing and edge fall detection server",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global State
detector = PoseDetector()
fall_engine = FallDetector()
connected_clients: Set[WebSocket] = set()

is_running: bool = False
camera_cap: Optional[cv2.VideoCapture] = None
simulate_fall_mode: bool = False
simulate_fall_start_time: Optional[float] = None
inference_task: Optional[asyncio.Task] = None
active_camera_id: int = 0
using_virtual_camera: bool = False

class StartCameraRequest(BaseModel):
    camera_id: int = 0
    use_simulation: bool = False

async def broadcast_message(message: dict):
    """Broadcast JSON message to all connected WebSocket clients."""
    if not connected_clients:
        return
    payload = json.dumps(message)
    dead_clients = set()
    for ws in connected_clients:
        try:
            await ws.send_text(payload)
        except Exception:
            dead_clients.add(ws)
    for ws in dead_clients:
        connected_clients.discard(ws)

async def pose_processing_loop():
    """
    Continuous processing loop running at 5 FPS (200ms interval).
    Reads frame from webcam or generates synthetic human kinematics.
    Never uploads or stores raw frames.
    """
    global is_running, camera_cap, simulate_fall_mode, simulate_fall_start_time, using_virtual_camera
    logger.info("Pose processing loop started at 5 FPS.")

    fps_interval = 0.20  # 5 FPS
    
    while is_running:
        loop_start = time.time()
        frame = None
        
        # Determine simulation / fall state
        is_falling_sim = False
        if simulate_fall_mode and simulate_fall_start_time:
            elapsed = time.time() - simulate_fall_start_time
            if elapsed > 1.0: # after 1s collapse
                is_falling_sim = True

        if camera_cap and camera_cap.isOpened() and not using_virtual_camera:
            ret, frame = camera_cap.read()
            if not ret or frame is None:
                # Camera read failed, fall back to virtual generator
                using_virtual_camera = True
                frame = np.zeros((480, 640, 3), dtype=np.uint8)
        else:
            frame = np.zeros((480, 640, 3), dtype=np.uint8)

        # Run inference
        h, w = frame.shape[:2]
        if using_virtual_camera or detector.is_synthetic or simulate_fall_mode:
            pose_result = detector._generate_synthetic_pose(h, w, is_fallen=is_falling_sim)
        else:
            pose_result = detector.detect(frame)

        # Run fall detection logic
        # 640*480*3 bytes = 921,600 raw uncompressed camera bytes per frame
        is_fallen, floor_duration, fall_event = fall_engine.update(pose_result, raw_frame_bytes=230400)

        # Build pose message
        pose_message = {
            "type": "pose",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "keypoints": pose_result["keypoints"],
            "person_height_m": pose_result["person_height_m"],
            "hip_angle_deg": pose_result["hip_angle_deg"],
            "is_fallen": is_fallen,
            "fall_duration_s": floor_duration,
            "is_simulated": using_virtual_camera or simulate_fall_mode
        }

        # Stream pose data
        await broadcast_message(pose_message)

        # If fall event condition triggered, emit verifiable receipt immediately
        if fall_event:
            logger.warning(f"FALL EVENT TRIGGERED! Floor duration: {floor_duration}s. Emitting verifiable receipt...")
            await broadcast_message(fall_event)

        # Enforce 5 FPS cadence
        elapsed = time.time() - loop_start
        sleep_time = max(0.01, fps_interval - elapsed)
        await asyncio.sleep(sleep_time)

@app.get("/api/health")
async def health_check():
    return {
        "status": "online",
        "service": "ElderSteady Pose Server",
        "model": "YOLOv8n-pose",
        "target_production_chip": "SiMa Modalix MLA",
        "connected_clients": len(connected_clients),
        "is_capturing": is_running,
        "is_virtual": using_virtual_camera
    }

@app.post("/api/pose/start")
async def start_capture(req: StartCameraRequest = StartCameraRequest()):
    global is_running, camera_cap, inference_task, active_camera_id, using_virtual_camera
    
    if is_running:
        return {"status": "already_running", "is_virtual": using_virtual_camera}

    active_camera_id = req.camera_id
    using_virtual_camera = req.use_simulation

    if not using_virtual_camera:
        try:
            camera_cap = cv2.VideoCapture(active_camera_id)
            if not camera_cap.isOpened():
                logger.warning(f"Webcam {active_camera_id} not accessible. Falling back to synthetic simulation.")
                using_virtual_camera = True
                camera_cap = None
            else:
                camera_cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
                camera_cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
        except Exception as e:
            logger.warning(f"Webcam open error: {e}. Using synthetic mode.")
            using_virtual_camera = True

    is_running = True
    fall_engine.reset()
    inference_task = asyncio.create_task(pose_processing_loop())

    return {
        "status": "started",
        "fps": 5,
        "using_virtual_camera": using_virtual_camera
    }

@app.post("/api/pose/stop")
async def stop_capture():
    global is_running, camera_cap, inference_task
    is_running = False
    if inference_task:
        inference_task.cancel()
        inference_task = None
    if camera_cap:
        camera_cap.release()
        camera_cap = None
    return {"status": "stopped"}

@app.post("/api/pose/simulate-fall")
async def trigger_simulated_fall():
    """
    Triggers simulated fall sequence for instant testing and demonstration.
    Immediately drops figure to floor, triggering fall_event after 3s.
    """
    global simulate_fall_mode, simulate_fall_start_time, is_running, inference_task
    simulate_fall_mode = True
    simulate_fall_start_time = time.time()
    
    # Auto-start loop if not currently active
    if not is_running:
        is_running = True
        inference_task = asyncio.create_task(pose_processing_loop())

    return {
        "status": "fall_simulation_active",
        "description": "Person transitioning to fallen posture. Fall event triggers in 3s."
    }

@app.post("/api/pose/reset")
async def reset_pose_state():
    """Reset posture to upright standing position."""
    global simulate_fall_mode, simulate_fall_start_time
    simulate_fall_mode = False
    simulate_fall_start_time = None
    fall_engine.reset()
    return {"status": "reset", "description": "Person standing upright"}

@app.websocket("/ws/pose")
async def websocket_pose_stream(websocket: WebSocket):
    global is_running, inference_task
    await websocket.accept()
    connected_clients.add(websocket)
    logger.info(f"WebSocket client connected. Total clients: {len(connected_clients)}")

    # Auto start streaming loop if first client connects
    if not is_running:
        is_running = True
        inference_task = asyncio.create_task(pose_processing_loop())

    try:
        while True:
            # Receive client ping or control messages
            data = await websocket.receive_text()
            try:
                msg = json.loads(data)
                action = msg.get("action")
                if action == "simulate_fall":
                    await trigger_simulated_fall()
                elif action == "reset":
                    await reset_pose_state()
            except Exception:
                pass
    except WebSocketDisconnect:
        connected_clients.discard(websocket)
        logger.info(f"WebSocket client disconnected. Total clients: {len(connected_clients)}")
