import { TypographyOptions } from '@mui/material/styles';

export const typography: TypographyOptions = {
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(','),
  h1: {
    fontWeight: 600,
    fontSize: '2.375rem',
    lineHeight: 1.21,
  },
  h2: {
    fontWeight: 600,
    fontSize: '1.875rem',
    lineHeight: 1.27,
  },
  h3: {
    fontWeight: 600,
    fontSize: '1.5rem',
    lineHeight: 1.33,
  },
  h4: {
    fontWeight: 600,
    fontSize: '1.25rem',
    lineHeight: 1.4,
  },
  h5: {
    fontWeight: 600,
    fontSize: '1rem',
    lineHeight: 1.5,
  },
  h6: {
    fontWeight: 600,
    fontSize: '0.875rem',
    lineHeight: 1.57,
  },
  body1: {
    fontSize: '0.875rem',
    lineHeight: 1.57,
  },
  body2: {
    fontSize: '0.75rem',
    lineHeight: 1.66,
  },
  subtitle1: {
    fontSize: '0.875rem',
    fontWeight: 600,
    lineHeight: 1.57,
  },
  subtitle2: {
    fontSize: '0.75rem',
    fontWeight: 500,
    lineHeight: 1.66,
  },
  button: {
    textTransform: 'capitalize',
    fontWeight: 500,
  },
  // 自定义行高
  lineHeightSm: 1.2,
  lineHeightMd: 1.5,
  lineHeightLg: 1.8,
  lineHeightXl: 2,
}; 