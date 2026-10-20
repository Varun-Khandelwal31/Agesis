export type COCOKeypointIndex =
  | 0 // nose
  | 1 // left_eye
  | 2 // right_eye
  | 3 // left_ear
  | 4 // right_ear
  | 5 // left_shoulder
  | 6 // right_shoulder
  | 7 // left_elbow
  | 8 // right_elbow
  | 9 // left_wrist
  | 10 // right_wrist
  | 11 // left_hip
  | 12 // right_hip
  | 13 // left_knee
  | 14 // right_knee
  | 15 // left_ankle
  | 16; // right_ankle

export interface PoseFrame {
  type: "pose";
  timestamp: string;
  keypoints: [number, number, number][]; // [x, y, confidence] for 17 COCO keypoints
  person_height_m: number;
  hip_angle_deg: number;
  is_fallen: boolean;
  fall_duration_s: number;
}

export interface FallEvent {
  type: "fall_event";
  timestamp: string;
  hip_angle_at_impact: number;
  duration_on_floor_s: number;
  video_bytes_processed: number;
  context_bytes_emitted: number;
  receipt_ratio?: string;
}

export interface ParentProfile {
  name: string;
  age: number;
  address: string;
  pincode: string;
  medications: string[];
  voiceStatus: "im_okay" | "needs_help" | "no_response";
}

export interface HospitalERResult {
  hospitalName: string;
  waitMinutes: number;
  distanceKm: number;
  emergencyPhone: string;
  isEstimated: boolean;
  sourceUrl: string;
  lastUpdated: string;
}

export interface DrugRecallItem {
  medication: string;
  recalled: boolean;
  recallDate?: string;
  batchNumber?: string;
  reason?: string;
  severity?: "Class I" | "Class II" | "Class III" | "Advisory";
  sourceUrl: string;
}

export interface AmbulanceService {
  name: string;
  etaMinutes: number;
  phone: string;
  type: "BLS" | "ALS" | "Cardiac Support";
  estimatedCostInr: number;
  sourceUrl: string;
}

export interface WeatherSlipRisk {
  condition: string;
  temperatureC: number;
  isRaining: boolean;
  humidityPercent: number;
  slipRiskLevel: "Low" | "Moderate" | "High" | "Extreme";
  hypothermiaRisk: boolean;
  summary: string;
  sourceUrl: string;
}

export interface TinyFishEnrichmentStatus {
  hospitalEr: {
    status: "pending" | "in_progress" | "done" | "error";
    data?: HospitalERResult;
    latencyMs?: number;
  };
  drugRecalls: {
    status: "pending" | "in_progress" | "done" | "error";
    data?: DrugRecallItem[];
    latencyMs?: number;
  };
  ambulance: {
    status: "pending" | "in_progress" | "done" | "error";
    data?: AmbulanceService[];
    latencyMs?: number;
  };
  weather: {
    status: "pending" | "in_progress" | "done" | "error";
    data?: WeatherSlipRisk;
    latencyMs?: number;
  };
}

export interface SynthesizedAlert {
  id: string;
  fallTimestamp: string;
  smsText: string;
  contextCard: string;
  recommendedAction: string;
  priority: "low" | "medium" | "high";
  parentProfile: ParentProfile;
  fallEvent: FallEvent;
  enrichment: {
    hospitalEr: HospitalERResult;
    drugRecalls: DrugRecallItem[];
    ambulance: AmbulanceService[];
    weather: WeatherSlipRisk;
  };
  sentAt?: string;
  twilioSid?: string;
  deliveryStatus?: "sent" | "delivered" | "simulated" | "pending";
}
