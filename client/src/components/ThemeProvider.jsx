import { useEffect } from 'react';
import api from '../services/api';

const DEFAULT_THEME = {
  primary: '#2563eb',
  primaryHover: '#1d4ed8',
  primaryLight: '#eff6ff',
  primaryDark: '#1e3a8a',

  secondary: '#64748b',
  secondaryHover: '#475569',
  secondaryLight: '#f1f5f9',

  success: '#16a34a',
  successHover: '#15803d',
  successLight: '#f0fdf4',

  warning: '#d97706',
  warningHover: '#b45309',
  warningLight: '#fffbeb',

  danger: '#dc2626',
  dangerHover: '#b91c1c',
  dangerLight: '#fef2f2',

  info: '#0284c7',
  infoHover: '#0369a1',
  infoLight: '#f0f9ff',

  background: '#f3f4f6',
  surface: '#ffffff',
  surfaceMuted: '#f8fafc',

  border: '#e5e7eb',
  borderDark: '#d1d5db',

  textPrimary: '#172033',
  textSecondary: '#64748b',
  textMuted: '#94a3b8',

  sidebarBg: '#1e3a8a',
  sidebarHover: '#1d4ed8',
  sidebarActive: '#2563eb',
  sidebarBorder: 'rgba(255, 255, 255, 0.12)',

  inputBg: '#ffffff',
  inputBorder: '#cbd5e1',
  inputFocus: '#2563eb',
};

export default function ThemeProvider({ children }) {
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const res = await api.get('/admin/settings/public');

        const theme = {
          ...DEFAULT_THEME,
          ...(res.data?.theme || {}),
        };

        const root = document.documentElement;

        Object.entries(theme).forEach(([key, value]) => {
          const cssVariable = key.replace(
            /[A-Z]/g,
            (match) => `-${match.toLowerCase()}`
          );

          root.style.setProperty(`--${cssVariable}`, value);
        });

        // Optional: make school name available globally
        if (res.data?.schoolName) {
          root.dataset.schoolName = res.data.schoolName;
        }
      } catch (error) {
        console.error('Failed to load school theme:', error);
      }
    };

    loadTheme();
  }, []);

  return children;
}