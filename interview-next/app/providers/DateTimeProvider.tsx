'use client';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { zhCN } from '@mui/x-date-pickers/locales';
import dayjs from '@/utils/dayjs-config';

/**
 * 日期时间提供者组件
 * 为应用提供日期时间相关功能，包括本地化和时区支持
 */
export default function DateTimeProvider({ children }: { children: React.ReactNode }) {
  return (
    <LocalizationProvider 
      dateAdapter={AdapterDayjs} 
      adapterLocale="zh-cn"
      localeText={zhCN.components.MuiLocalizationProvider.defaultProps.localeText}
      dateLibInstance={dayjs}
    >
      {children}
    </LocalizationProvider>
  );
} 