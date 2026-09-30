// Homepage
export interface ApiMovie {
  id: string;
  code: string;
  title: string;
  coverPath: string | null;
}
export interface Movie {
  id: string;
  code: string;
  title: string;
  posterUrl: string;
  rating?: number;
  status: string;
  isFavorite: boolean;
}

// Setting Page
export type SettingsTabType = "common_code" | "system_logs" | "other";
export interface CodeType {
  id: string;
  code: string;
  name: string;
  description: string;
  count: number;
}
export interface CodeDetailType {
  id: string;
  type_code: string;
  code: string;
  label: string;
  order: number;
  is_active: boolean;
}
export type LogLevel = "INFO" | "WARN" | "ERROR";
export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  source: string;
}
