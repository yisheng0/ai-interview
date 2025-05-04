'use client';

import { Box, Button, Typography } from '@mui/material';
import { useRef } from 'react';

/**
 * 图片上传提示组件
 *
 * 用于上传招聘截图快速导入岗位信息
 *
 * @returns {JSX.Element} 图片上传提示组件
 */
export default function ImageUploadTip() {
  // 文件输入引用
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 处理图片选择
  const handleFileSelect = () => {
    // UI示例实现，无实际逻辑
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        bgcolor: '#F0FBFA',
        px: 2,
        py: 1,
        borderRadius: 2,
        justifyContent: 'space-between',
      }}
    >
      <Typography variant="body2" color="text.secondary">
        上传招聘截图快速导入岗位信息
      </Typography>
      <Button
        variant="contained"
        size="small"
        onClick={handleFileSelect}
        sx={{
          borderRadius: 2,
          textTransform: 'none',
          px: 2,
        }}
      >
        选择图片
      </Button>

      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        hidden
        accept=".jpg,.jpeg,.png,.gif"
        onChange={() => {}}
      />
    </Box>
  );
}
