"use client";

import { PoseFrame, FallEvent } from "@eldersteady/shared-types";

export type ConnectionStatus = "connecting" | "connected" | "disconnected" | "simulation";

export interface PoseStreamListeners {
  onPose?: (pose: PoseFrame) => void;
  onFall?: (event: FallEvent) => void;
  onStatusChange?: (status: ConnectionStatus) => void;
}

export class PoseStreamClient {
  private ws: WebSocket | null = null;
  private url: string;
  private listeners: PoseStreamListeners = {};
  private reconnectTimer: any = null;
  private simTimer: any = null;
  private isSimulating: boolean = false;
  private isFallSimulated: boolean = false;
  private fallStartTime: number | null = null;
  private status: ConnectionStatus = "disconnected";

  constructor(url: string = "ws://localhost:8000/ws/pose") {
    this.url = url;
  }

  public connect(listeners: PoseStreamListeners) {
    this.listeners = listeners;
    this.setStatus("connecting");

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        this.setStatus("connected");
        this.stopSimulation();
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "pose" && this.listeners.onPose) {
            this.listeners.onPose(data as PoseFrame);
          } else if (data.type === "fall_event" && this.listeners.onFall) {
            this.listeners.onFall(data as FallEvent);
          }
        } catch (err) {
          console.error("PoseStreamClient parse error:", err);
        }
      };

      this.ws.onerror = () => {
        // Fall back to built-in simulation if python backend is not yet started
        if (this.status !== "connected") {
          this.startSimulation();
        }
      };

      this.ws.onclose = () => {
        if (this.status === "connected") {
          this.setStatus("disconnected");
          // Reconnect or fallback to simulation
          this.reconnectTimer = setTimeout(() => {
            this.connect(this.listeners);
          }, 3000);
        } else {
          this.startSimulation();
        }
      };
    } catch {
      this.startSimulation();
    }
  }

  public disconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.simTimer) clearInterval(this.simTimer);
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.setStatus("disconnected");
  }

  public triggerFallSimulation() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ action: "simulate_fall" }));
    } else {
      // In-browser simulation fall trigger
      this.isFallSimulated = true;
      this.fallStartTime = Date.now();
    }
  }

  public resetPosture() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ action: "reset" }));
    }
    this.isFallSimulated = false;
    this.fallStartTime = null;
  }

  private setStatus(status: ConnectionStatus) {
    this.status = status;
    if (this.listeners.onStatusChange) {
      this.listeners.onStatusChange(status);
    }
  }

  private startSimulation() {
    if (this.isSimulating) return;
    this.isSimulating = true;
    this.setStatus("simulation");

    let step = 0;
    let fallEmitted = false;

    this.simTimer = setInterval(() => {
      step++;
      const now = Date.now();
      let isFallen = false;
      let durationOnFloor = 0.0;
      let hipAngle = 86.4 + Math.sin(step * 0.2) * 2;
      let height = 1.63;

      if (this.isFallSimulated && this.fallStartTime) {
        const elapsed = (now - this.fallStartTime) / 1000;
        if (elapsed > 1.0) {
          isFallen = true;
          durationOnFloor = Math.round((elapsed - 1.0) * 10) / 10;
          hipAngle = 14.2;
          height = 0.38;

          // Trigger fall event after 3 seconds on floor
          if (durationOnFloor >= 3.0 && !fallEmitted) {
            fallEmitted = true;
            if (this.listeners.onFall) {
              this.listeners.onFall({
                type: "fall_event",
                timestamp: new Date().toISOString(),
                hip_angle_at_impact: 18.4,
                duration_on_floor_s: durationOnFloor,
                video_bytes_processed: 3520000,
                context_bytes_emitted: 11264,
                receipt_ratio: "1 : 303",
              });
            }
          }
        }
      } else {
        fallEmitted = false;
      }

      // Generate keypoints
      const keypoints = this.generateKinematicPose(step, isFallen);

      if (this.listeners.onPose) {
        this.listeners.onPose({
          type: "pose",
          timestamp: new Date().toISOString(),
          keypoints,
          person_height_m: height,
          hip_angle_deg: Math.round(hipAngle * 10) / 10,
          is_fallen: isFallen,
          fall_duration_s: durationOnFloor,
        });
      }
    }, 200); // 5 FPS
  }

  private stopSimulation() {
    if (this.simTimer) {
      clearInterval(this.simTimer);
      this.simTimer = null;
    }
    this.isSimulating = false;
  }

  private generateKinematicPose(step: number, fallen: boolean): [number, number, number][] {
    const sway = Math.sin(step * 0.15) * 0.015;
    const breathe = Math.cos(step * 0.1) * 0.008;

    if (!fallen) {
      const cx = 0.5 + sway;
      return [
        [cx, 0.22 + breathe, 0.95],
        [cx - 0.02, 0.20 + breathe, 0.94],
        [cx + 0.02, 0.20 + breathe, 0.94],
        [cx - 0.04, 0.21 + breathe, 0.91],
        [cx + 0.04, 0.21 + breathe, 0.91],
        [cx - 0.08, 0.29 + breathe, 0.96],
        [cx + 0.08, 0.29 + breathe, 0.96],
        [cx - 0.11, 0.42, 0.92],
        [cx + 0.11, 0.42, 0.92],
        [cx - 0.12, 0.54, 0.89],
        [cx + 0.12, 0.54, 0.89],
        [cx - 0.06, 0.55, 0.95],
        [cx + 0.06, 0.55, 0.95],
        [cx - 0.07, 0.70, 0.93],
        [cx + 0.07, 0.70, 0.93],
        [cx - 0.07, 0.84, 0.90],
        [cx + 0.07, 0.84, 0.90],
      ];
    } else {
      const cx = 0.45;
      return [
        [cx - 0.22, 0.80, 0.92],
        [cx - 0.23, 0.79, 0.91],
        [cx - 0.23, 0.81, 0.91],
        [cx - 0.20, 0.78, 0.88],
        [cx - 0.20, 0.82, 0.88],
        [cx - 0.12, 0.77, 0.93],
        [cx - 0.11, 0.84, 0.93],
        [cx - 0.08, 0.73, 0.89],
        [cx - 0.07, 0.88, 0.89],
        [cx - 0.03, 0.72, 0.85],
        [cx - 0.02, 0.89, 0.85],
        [cx + 0.06, 0.80, 0.94],
        [cx + 0.08, 0.84, 0.94],
        [cx + 0.18, 0.78, 0.91],
        [cx + 0.20, 0.83, 0.91],
        [cx + 0.28, 0.81, 0.88],
        [cx + 0.30, 0.85, 0.88],
      ];
    }
  }
}
