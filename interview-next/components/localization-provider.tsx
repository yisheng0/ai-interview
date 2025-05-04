import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { zhCN } from '@mui/x-date-pickers/locales';
import dayjs from '@/utils/dayjs-config';

interface LocalizationProviderProps {
  children: React.ReactNode;
  localeText?: any;
}

/**
 * 自定义本地化提供者组件
 * 
 * 包装MUI的LocalizationProvider，提供dayjs配置和中文本地化
 */
export default function CustomLocalizationProvider({
  children,
  localeText = zhCN.components.MuiLocalizationProvider.defaultProps.localeText,
}: LocalizationProviderProps) {
  return (
    <LocalizationProvider 
      dateAdapter={AdapterDayjs} 
      adapterLocale="zh-cn" 
      localeText={localeText}
      dateLibInstance={dayjs}
    >
      {children}
    </LocalizationProvider>
  );
}
