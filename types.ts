export interface Student {
  id: string;
  name: string;
  studentId: string;
  registrationDate: string;
  sampleCount: number;
  avatarUrl?: string; // Use the first captured image as avatar
}

export enum LivenessStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  LIVE = 'LIVE',
  SPOOF = 'SPOOF',
  ERROR = 'ERROR'
}

export interface VerificationResult {
  timestamp: number;
  isReal: boolean;
  confidence: number;
  analysis: string;
  matchedStudentId?: string;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  REGISTER = 'REGISTER',
  VERIFY = 'VERIFY',
}
