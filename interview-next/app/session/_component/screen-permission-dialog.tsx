'use client';

import WarningIcon from '@mui/icons-material/Warning';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface ScreenPermissionDialogProps {
  /**
   * 是否显示弹窗
   */
  open: boolean;
  /**
   * 是否是Mac系统
   */
  isMacOS: boolean;
  /**
   * 是否显示权限错误提示
   */
  showPermissionError?: boolean;
  /**
   * 确认按钮回调
   */
  onConfirm: () => void;
  /**
   * 取消按钮回调
   */
  onCancel: () => void;
  /**
   * 关闭弹窗回调
   */
  onClose?: () => void;
}

/**
 * 屏幕权限弹窗组件
 *
 * 根据不同操作系统(Windows/Mac)显示不同的权限请求提示
 * 包含屏幕截图示例和操作指引
 */
export default function ScreenPermissionDialog({
  open,
  isMacOS,
  showPermissionError = false,
  onConfirm,
  onCancel,
  onClose,
}: ScreenPermissionDialogProps) {
  // 控制弹窗开关
  const [dialogOpen, setDialogOpen] = useState(open);

  // 同步外部open状态
  useEffect(() => {
    setDialogOpen(open);
  }, [open]);

  // 关闭弹窗处理
  const handleClose = () => {
    setDialogOpen(false);
    onClose?.();
  };

  // 取消按钮处理
  const handleCancel = () => {
    setDialogOpen(false);
    onCancel();
  };

  // 确认按钮处理
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Dialog
      open={dialogOpen}
      onClose={(event, reason) => {
        // 只有点击关闭按钮时才触发关闭
        if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
          handleClose();
        }
      }}
      maxWidth="md"
      aria-labelledby="screen-permission-dialog-title"
      PaperProps={{
        sx: {
          borderRadius: '8px',
          maxHeight: '90vh',
        },
      }}
      scroll="paper"
    >
      {isMacOS && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: theme => theme.palette.error.main,
            py: 2,
          }}
        >
          <Box
            sx={{
              width: '80%',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              padding: 2,
              gap: 2,
            }}
          >
            <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
              <WarningIcon sx={{ color: theme => theme.palette.error.main, fontSize: '2rem' }} />
            </Box>
            <Typography sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
              MAC电脑仅支持网页面试，腾讯会议等应用程序面试请使用windows电脑或手机辅助
            </Typography>
          </Box>
        </Box>
      )}

      <DialogTitle sx={{ textAlign: 'center', mt: isMacOS ? 0 : 2, fontWeight: 'bold' }}>
        请允许以下权限
      </DialogTitle>

      <DialogContent sx={{ overflow: 'visible', maxHeight: 'none' }}>
        <Box
          sx={{
            width: '100%',
            textAlign: 'center',
            mb: 1,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Image
            src={
              isMacOS
                ? '/png/desktop-interview-dialog-mac.png'
                : '/png/desktop-interview-dialog-window.png'
            }
            alt="屏幕共享示例"
            width={600}
            height={400}
            style={{ maxWidth: '100%', height: 'auto', maxHeight: '45vh' }}
          />
        </Box>

        <DialogContentText>
          {isMacOS ? (
            <>
              在接下来的弹窗中，请您按照以下步骤允许权限以便我们向您提供服务：
              <br />
              <Typography component="span" fontWeight="bold" color="primary">
                第一步：
              </Typography>{' '}
              选中
              <Typography component="span" color="secondary.main" fontWeight="bold" display="inline">
                面试的标签页
              </Typography>
              <br />
              <Typography component="span" fontWeight="bold" color="primary">
                第二步：
              </Typography>{' '}
              <Typography component="span" color="secondary.main" fontWeight="bold" display="inline">
                共享选项卡音频
              </Typography>
              <br />
              <Typography component="span" fontWeight="bold" color="primary">
                第三步：
              </Typography>{' '}
              点击&quot;
              <Typography component="span" color="secondary.main" fontWeight="bold" display="inline">
                共享
              </Typography>
              &quot;
            </>
          ) : (
            <>
              在接下来的弹窗中，请您按照以下步骤允许权限以便我们向您提供服务：
              <br />
              <Typography component="span" fontWeight="bold" color="primary">
                第一步：
              </Typography>{' '}
              选择
              <Typography component="span" color="secondary.main" fontWeight="bold" display="inline">
                整个屏幕
              </Typography>
              <br />
              <Typography component="span" fontWeight="bold" color="primary">
                第二步：
              </Typography>{' '}
              <Typography component="span" color="secondary.main" fontWeight="bold" display="inline">
                共享系统音频
              </Typography>
              <br />
              <Typography component="span" fontWeight="bold" color="primary">
                第三步：
              </Typography>{' '}
              点击&quot;
              <Typography component="span" color="secondary.main" fontWeight="bold" display="inline">
                共享
              </Typography>
              &quot;
            </>
          )}
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleCancel} color="error" variant="outlined">
          退出面试
        </Button>
        <Button onClick={handleConfirm} color="primary" variant="contained" autoFocus>
          {showPermissionError ? '重新授权' : '我已知晓'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}