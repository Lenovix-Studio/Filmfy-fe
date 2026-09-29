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
export type SettingsTabType = "common_code" | "other";
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
