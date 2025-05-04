import { Dialog, Button, Box } from '@mui/material';
import { StaticDateTimePicker } from '@mui/x-date-pickers';
import { zhCN } from '@mui/x-date-pickers/locales';
import dayjs from '@/utils/dayjs-config';
import CustomLocalizationProvider from './localization-provider';

/**
 * 日期时间选择器对话框属性接口
 */
interface DateTimePickerDialogProps {
  /** 是否打开对话框 */
  open: boolean;
  /** 关闭对话框的回调 */
  onClose: () => void;
  /** 当前选择的日期时间值 */
  value: dayjs.Dayjs | null;
  /** 日期时间改变时的回调 */
  onChange: (date: dayjs.Dayjs | null) => void;
  /** 确认选择后的回调 */
  onAccept: () => void;
  /**
   * 删除当前轮次的回调（可选）
   * 当提供该回调时，操作栏中会显示"删除"按钮
   */
  onDelete?: () => void;
}

/**
 * 日期时间选择器对话框组件（自定义操作按钮）
 *
 * 该实现通过覆盖默认 actionBar 插槽，取消内部默认按钮，
 * 并在对话框底部自行渲染自定义操作按钮，使得布局更美观。
 *
 * @param props 组件属性
 * @returns 日期时间选择器对话框
 */
export default function DateTimePickerDialog({
  open,
  onClose,
  value,
  onChange,
  onAccept,
  onDelete,
}: DateTimePickerDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          maxWidth: 'unset',
          margin: 2,
        },
      }}
    >
      <CustomLocalizationProvider
        localeText={zhCN.components.MuiLocalizationProvider.defaultProps.localeText}
      >
        {/* 渲染日期时间选择器，并覆盖内置操作栏 */}
        <StaticDateTimePicker
          value={value}
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          ampm={false}
          timezone="Asia/Shanghai"
          slots={{
            // 覆盖内置操作栏，不显示默认按钮
            actionBar: () => null,
          }}
        />
        {/* 自定义操作栏，位于对话框底部 */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            p: 2,
            borderTop: '1px solid #e0e0e0', // 分隔线，可选
          }}
        >
          <Button onClick={onClose}>取消</Button>
          {onDelete && (
            <Button onClick={onDelete} color="error" sx={{ ml: 1 }}>
              删除
            </Button>
          )}
          <Button onClick={onAccept} sx={{ ml: 1 }}>
            确定
          </Button>
        </Box>
      </CustomLocalizationProvider>
    </Dialog>
  );
}
