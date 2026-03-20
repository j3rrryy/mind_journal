import type { Period } from "@/lib/constants/period";
import type { Priority } from "@/lib/constants/priority";

export interface Tokens {
  access_token: string;
  refresh_token: string;
}

export interface RefreshToken {
  refresh_token: string;
}

export interface LogIn {
  username: string;
  password: string;
}

export interface Registration {
  username: string;
  email: string;
  password: string;
}

export interface Profile {
  user_id: string;
  username: string;
  email: string;
  email_confirmed: boolean;
  registered_at: string;
}

export interface SessionInfo {
  session_id: string;
  user_ip: string;
  country_code: string | null;
  browser: string;
  created_at: string;
}

export interface SessionList {
  sessions: SessionInfo[];
}

export interface UpdateEmail {
  new_email: string;
}

export interface UpdatePassword {
  old_password: string;
  new_password: string;
}

export interface ForgotPassword {
  email: string;
}

export interface ResetCode {
  user_id: string;
  code: string;
}

export interface CodeIsValid {
  is_valid: boolean;
}

export interface ResetPassword {
  user_id: string;
  new_password: string;
}

export interface UserId {
  user_id: string;
}

export interface Metrics {
  mood: number;
  sleep_hours: number;
  activity: number;
  stress: number;
  energy: number;
  focus: number;
}

export interface WeeklyAverages {
  mood: number;
  sleep_hours: number;
  activity: number;
  stress: number;
  energy: number;
  focus: number;
  changes: Record<string, number>;
}

export interface Dashboard {
  today: Metrics | null;
  week: WeeklyAverages;
}

export interface RecordInfo {
  date: string;
  metrics: Metrics;
}

export interface RecordList {
  records: RecordInfo[];
}

export interface FeatureImportance {
  sleep_hours: number;
  activity: number;
  stress: number;
  energy: number;
  focus: number;
}

export interface Insight {
  insight: string;
  parameters: Record<string, number>;
  priority: Priority;
}

export interface PeriodAnalytics {
  period: Period;
  feature_importance: FeatureImportance;
  insights: Insight[];
  generated_at: string;
}

export interface Analytics {
  analytics: PeriodAnalytics[];
}

export interface Recommendation {
  recommendation: string;
  parameters: Record<string, number>;
  priority: Priority;
}

export interface Recommendations {
  recommendations: Recommendation[];
  generated_at: string;
}

export type { Period, Priority };
