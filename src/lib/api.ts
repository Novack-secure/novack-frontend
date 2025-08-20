import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function extractDigits(raw: string | undefined | null): string {
  if (!raw) return '';
  return String(raw).replace(/\D/g, '');
}

export function lastNDigits(raw: string, n: number): string {
  if (!raw) return '';
  return raw.slice(-n);
}


