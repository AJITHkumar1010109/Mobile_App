export interface ThemeColors {
  isDark: boolean;
  bg: string;
  surface: string;
  card: string;
  border: string;
  text: string;
  textMuted: string;
  textHeading: string;
  inputBg: string;
  inputBorder: string;
  accent: string;
  accentBg: string;
  gradientPrimary: [string, string];
  gradientCard: [string, string];
  success: string;
  successBg: string;
  warning: string;
  warningBg: string;
  danger: string;
  dangerBg: string;
  info: string;
  infoBg: string;
  headerBg: string;
  drawerBg: string;
  shadow: string;
}

export const lightTheme: ThemeColors = {
  isDark: false,
  bg: '#f1f5f9',
  surface: '#ffffff',
  card: '#ffffff',
  border: '#e2e8f0',
  text: '#334155',
  textMuted: '#64748b',
  textHeading: '#0f172a',
  inputBg: '#f8fafc',
  inputBorder: '#cbd5e1',
  accent: '#667eea',
  accentBg: '#eef2ff',
  gradientPrimary: ['#667eea', '#764ba2'],
  gradientCard: ['#ffffff', '#f8fafc'],
  success: '#16a34a',
  successBg: '#dcfce7',
  warning: '#d97706',
  warningBg: '#fef3c7',
  danger: '#dc2626',
  dangerBg: '#fee2e2',
  info: '#2563eb',
  infoBg: '#eff6ff',
  headerBg: '#ffffff',
  drawerBg: '#ffffff',
  shadow: 'rgba(0, 0, 0, 0.08)',
};

export const darkTheme: ThemeColors = {
  isDark: true,
  bg: '#0f172a',
  surface: '#1e293b',
  card: '#1e293b',
  border: '#334155',
  text: '#cbd5e1',
  textMuted: '#94a3b8',
  textHeading: '#f8fafc',
  inputBg: '#0f172a',
  inputBorder: '#475569',
  accent: '#818cf8',
  accentBg: '#312e81',
  gradientPrimary: ['#667eea', '#764ba2'],
  gradientCard: ['#1e293b', '#0f172a'],
  success: '#22c55e',
  successBg: '#14532d',
  warning: '#f59e0b',
  warningBg: '#78350f',
  danger: '#ef4444',
  dangerBg: '#7f1d1d',
  info: '#38bdf8',
  infoBg: '#0c4a6e',
  headerBg: '#1e293b',
  drawerBg: '#1e293b',
  shadow: 'rgba(0, 0, 0, 0.4)',
};
