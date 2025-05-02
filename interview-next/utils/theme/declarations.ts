import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface TypographyVariants {
    lineHeightSm: number;
    lineHeightMd: number;
    lineHeightLg: number;
    lineHeightXl: number;
  }

  interface TypographyVariantsOptions {
    lineHeightSm?: number;
    lineHeightMd?: number;
    lineHeightLg?: number;
    lineHeightXl?: number;
  }
}

// 允许配置这些新值的变体
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    lineHeightSm: true;
    lineHeightMd: true;
    lineHeightLg: true;
    lineHeightXl: true;
  }
}

export {}; 