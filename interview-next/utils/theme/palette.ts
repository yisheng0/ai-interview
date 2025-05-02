import { PaletteOptions } from '@mui/material';

// 基础颜色定义
export const BASE_COLORS = {
  primary: {
    main: '#2196f3',
    light: '#64b5f6',
    dark: '#1976d2',
    contrastText: '#fff',
  },
  secondary: {
    main: '#f50057',
    light: '#ff4081',
    dark: '#c51162',
    contrastText: '#fff',
  },
  error: {
    main: '#f44336',
    light: '#e57373',
    dark: '#d32f2f',
    contrastText: '#fff',
  },
  warning: {
    main: '#ff9800',
    light: '#ffb74d',
    dark: '#f57c00',
    contrastText: 'rgba(0, 0, 0, 0.87)',
  },
  info: {
    main: '#2196f3',
    light: '#64b5f6',
    dark: '#1976d2',
    contrastText: '#fff',
  },
  success: {
    main: '#4caf50',
    light: '#81c784',
    dark: '#388e3c',
    contrastText: 'rgba(0, 0, 0, 0.87)',
  },
};

// 灰色调 - 亮色主题
export const BLACK_GREY = {
  50: '#fafafa',
  100: '#f5f5f5',
  200: '#eeeeee',
  300: '#e0e0e0',
  400: '#bdbdbd',
  500: '#9e9e9e',
  600: '#757575',
  700: '#616161',
  800: '#424242',
  900: '#212121',
  A100: '#f5f5f5',
  A200: '#eeeeee',
  A400: '#bdbdbd',
  A700: '#616161',
};

// 灰色调 - 暗色主题
export const WHITE_GREY = {
  50: '#303030',
  100: '#373737',
  200: '#424242',
  300: '#4f4f4f',
  400: '#5e5e5e',
  500: '#757575',
  600: '#bdbdbd',
  700: '#e0e0e0',
  800: '#eeeeee',
  900: '#f5f5f5',
  A100: '#424242',
  A200: '#5e5e5e',
  A400: '#bdbdbd',
  A700: '#eeeeee',
};

// 对比文本颜色
export const CONTRAST_TEXT_COLOR = {
  light: '#fff',
  dark: 'rgba(0, 0, 0, 0.87)',
};

/**
 * 亮色主题调色板
 */
export const lightPalette: PaletteOptions = {
  mode: 'light',
  ...BASE_COLORS,
  grey: BLACK_GREY,
  text: {
    primary: BLACK_GREY[800],
    secondary: BLACK_GREY[600],
    disabled: BLACK_GREY[500],
  },
  background: {
    default: '#f5f5f5',
    paper: '#ffffff',
  },
  divider: BLACK_GREY[300],
  action: {
    active: BLACK_GREY[600],
    hover: 'rgba(0, 0, 0, 0.04)',
    selected: 'rgba(0, 0, 0, 0.08)',
    disabled: 'rgba(0, 0, 0, 0.26)',
    disabledBackground: 'rgba(0, 0, 0, 0.12)',
  },
};

/**
 * 暗色主题调色板
 */
export const darkPalette: PaletteOptions = {
  mode: 'dark',
  ...BASE_COLORS,
  grey: WHITE_GREY,
  text: {
    primary: WHITE_GREY[800],
    secondary: WHITE_GREY[600],
    disabled: WHITE_GREY[500],
  },
  background: {
    default: '#121212',
    paper: '#1e1e1e',
  },
  divider: WHITE_GREY[300],
  action: {
    active: WHITE_GREY[600],
    hover: 'rgba(255, 255, 255, 0.08)',
    selected: 'rgba(255, 255, 255, 0.16)',
    disabled: 'rgba(255, 255, 255, 0.3)',
    disabledBackground: 'rgba(255, 255, 255, 0.12)',
  },
};

export default { lightPalette, darkPalette }; 