import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Une clases de Tailwind de forma inteligente.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formatea una fecha.
 */
export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

/**
 * Formatea puntajes.
 */
export function formatPoints(points: number) {
  return `${points} pts`;
}

/**
 * Convierte un texto en slug.
 */
export function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Limita un número entre un mínimo y un máximo.
 */
export function clamp(
  value: number,
  min: number,
  max: number
) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Calcula porcentaje respecto al líder.
 */
export function percentage(
  value: number,
  max: number
) {
  if (max <= 0) return 0;

  return Math.round((value / max) * 100);
}

/**
 * Devuelve el color del texto (blanco o negro)
 * dependiendo del color de fondo.
 */
export function getContrastColor(hex: string) {
  const color = hex.replace("#", "");

  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness > 150 ? "#000000" : "#FFFFFF";
}