'use client';

import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import { useState } from 'react';

/**
 * 确认对话框组件
 *
 * 用于删除面试等需要用户确认的操作
 *
 * @returns {JSX.Element} 确认对话框组件
 */
export default function ConfirmDialog() {
  // UI示例 - 假设对话框打开状态
  const [isOpen, setIsOpen] = useState(false);

  // 处理关闭对话框 - 仅UI实现
  const handleClose = () => {
    setIsOpen(false);
  };

  // 处理确认删除 - 仅UI实现
  const handleConfirmDelete = () => {
    // 仅UI示例，无实际逻辑
    setIsOpen(false);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">是否确定删除此面试流程？</DialogTitle>
      <DialogActions sx={{ justifyContent: 'flex-start', px: 2, gap: 2 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          size="large"
          sx={{ borderRadius: 2, width: 133, height: 40 }}
        >
          取消
        </Button>
        <Button
          onClick={handleConfirmDelete}
          variant="contained"
          size="large"
          sx={{ borderRadius: 2, width: 133, height: 40 }}
          autoFocus
        >
          确定
        </Button>
      </DialogActions>
    </Dialog>
  );
}