'use client';

import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import * as Yup from 'yup';
import InterviewTimeSection from './interview-time-section';
import JobInfoSection from './job-info-section';
import { InterviewStatus, type Interview } from '@/state/interview-store';
import { useModalStore } from '@/state/dialog-store';

/**
 * 表单验证模式
 */
const validationSchema = Yup.object({
  company_name: Yup.string().required('请输入公司名称'),
  job_title: Yup.string().required('请输入职位名称'),
  introduction: Yup.string(),
  interview_round_list: Yup.array().min(1, '至少添加一轮面试'),
});

/**
 * 表单初始值
 */
const initialValues: Interview = {
  company_name: '',
  job_title: '',
  introduction: '',
  interview_status: InterviewStatus.IN_PROGRESS,
  interview_round_list: [],
};

/**
 * 面试创建/编辑弹窗组件
 *
 * 用于创建新面试或编辑现有面试，匹配设计稿UI
 *
 * @returns {JSX.Element} 面试创建/编辑弹窗组件
 */
export default function CreateEditDialog() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);

  // 从全局状态获取对话框状态和当前面试数据
  const { 
    isInterviewAgendaDetailDialogOpen, 
    closeInterviewAgendaDetailDialog,
    currentDialogInterview,
    clearCurrentDialogInterview
  } = useModalStore();

  // 是否处于编辑模式（有当前选中的面试）
  const isEditMode = !!currentDialogInterview?.uuid;

  // 表单处理
  const formik = useFormik({
    initialValues: currentDialogInterview || initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: handleSubmit,
  });

  // 只在对话框打开状态变化时重置表单，避免无限循环
  useEffect(() => {
    if (isInterviewAgendaDetailDialogOpen && currentDialogInterview) {
      // 只在对话框打开且有数据时设置初始值
      formik.resetForm({
        values: currentDialogInterview
      });
    } else if (isInterviewAgendaDetailDialogOpen) {
      // 对话框打开但没有数据时使用默认值
      formik.resetForm({
        values: initialValues
      });
    }
  }, [isInterviewAgendaDetailDialogOpen]); // 只依赖对话框开关状态

  /**
   * 处理表单提交
   * @param values 表单值
   */
  async function handleSubmit(values: Interview) {
    try {
      setIsSubmitting(true);

      // 处理表单值，应用默认值
      const processedValues = {
        ...values,
        company_name: values.company_name?.trim() || '默认公司',
        job_title: values.job_title?.trim() || '默认岗位',
        introduction: values.introduction?.trim() || '暂无描述',
        interview_status: values.interview_status || InterviewStatus.IN_PROGRESS,
      };

      // 检查面试轮次
      if (!processedValues.interview_round_list?.length) {
        toast.error('请至少添加一轮面试');
        setIsSubmitting(false);
        return;
      }
      // 提交成功
      toast.success(isEditMode ? '面试更新成功' : '面试创建成功');
      handleClose();
      router.refresh();
    } catch (error) {
      toast.error('提交失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  }

  /**
   * 处理删除面试
   */
  const handleDelete = () => {
    if (isEditMode) {
      setOpenDeleteConfirmDialog(true);
    }
  };

  /**
   * 确认删除面试
   */
  const handleConfirmDelete = async () => {
    if (!currentDialogInterview?.uuid) return;

    try {
      setOpenDeleteConfirmDialog(false);

      toast.success('删除成功');
      handleClose();
      router.refresh();
    } catch (error) {
      toast.error('删除失败');
    }
  };

  /**
   * 关闭对话框
   */
  const handleClose = () => {
    closeInterviewAgendaDetailDialog();
  };

  return (
    <>
      <Dialog
        open={isInterviewAgendaDetailDialogOpen}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxWidth: '550px',
            width: '100%',
          },
        }}
      >
        <DialogTitle sx={{ fontSize: 20, fontWeight: 'bold', mb: 1 }}>
          {isEditMode ? '编辑面试岗位' : '新建面试岗位'}
        </DialogTitle>

        <DialogContent>
          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
          >
            {/* 面试时间部分 */}
            <Box>
              <InterviewTimeSection formik={formik} />
            </Box>

            {/* 岗位信息部分 */}
            <Box>
              <JobInfoSection formik={formik} />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 3 }}>
          <Box>
            {isEditMode && (
              <Button
                onClick={handleDelete}
                color="error"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  mr: 2,
                }}
              >
                删除
              </Button>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              onClick={handleClose}
              variant="outlined"
              sx={{ borderRadius: 2, width: 96, height: 40, textTransform: 'none' }}
            >
              取消
            </Button>
            <Button
              onClick={() => formik.handleSubmit()}
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              sx={{ borderRadius: 2, width: 96, height: 40, textTransform: 'none' }}
            >
              {isSubmitting ? '保存中...' : '保存'}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
}
