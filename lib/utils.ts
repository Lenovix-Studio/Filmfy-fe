import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function formatDateWithAge(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return `${d.getFullYear()} ${MONTHS[d.getMonth()]} ${d.getDate()} (${age} years old)`;
}

export function formatDuration(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  let years = now.getFullYear() - d.getFullYear();
  let months = now.getMonth() - d.getMonth();
  let days = now.getDate() - d.getDate();
  if (days < 0) {
    months--;
    const prev = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prev.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} year`);
  if (months > 0) parts.push(`${months} month`);
  if (days > 0) parts.push(`${days} day`);
  return parts.join(" ") || "0 day";
}

export function formatDebutWithDuration(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()} ${MONTHS[d.getMonth()]} ${d.getDate()} (${formatDuration(dateStr)})`;
}

export function formatThreeSizes(
  bust?: number | null,
  cup?: string | null,
  waist?: number | null,
  hip?: number | null,
): string | null {
  if (!bust && !waist && !hip) return null;
  const parts: string[] = [];
  if (bust) {
    let b = `B${bust}`;
    if (cup) b += ` (${cup}-cup)`;
    parts.push(b);
  }
  if (waist) parts.push(`W${waist}`);
  if (hip) parts.push(`H${hip}`);
  return parts.join(" - ") + " (cm)";
}
