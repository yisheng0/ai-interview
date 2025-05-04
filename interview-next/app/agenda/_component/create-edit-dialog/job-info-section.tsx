'use client';

import { Box, FormControl, TextField, Typography } from '@mui/material';
import { FormikProps } from 'formik';
import ImageUploadTip from './image-upload-tip';

/**
 * 组件属性接口
 */
interface JobInfoSectionProps {
  formik: FormikProps<any>;
}

/**
 * 岗位信息部分组件
 *
 * 用于输入和管理岗位相关信息
 *
 * @param {JobInfoSectionProps} props - 组件属性
 * @returns {JSX.Element} 岗位信息部分组件
 */
export default function JobInfoSection({ formik }: JobInfoSectionProps) {
  // 字数限制
  const maxLength = 1000;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontSize: 18, fontWeight: '700', mr: 2 }}>
          岗位信息
        </Typography>

        {/* 上传招聘截图快速导入岗位信息 */}
        <ImageUploadTip />
      </Box>

      <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '200px' }}>
            <FormControl fullWidth>
              <TextField
                label="公司"
                size="small"
                value={formik.values.company_name || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="company_name"
                error={formik.touched.company_name && Boolean(formik.errors.company_name)}
                helperText={
                  formik.touched.company_name && formik.errors.company_name
                    ? String(formik.errors.company_name)
                    : ''
                }
                required
              />
            </FormControl>
          </Box>

          <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '200px' }}>
            <FormControl fullWidth>
              <TextField
                label="岗位"
                size="small"
                value={formik.values.job_title || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="job_title"
                error={formik.touched.job_title && Boolean(formik.errors.job_title)}
                helperText={
                  formik.touched.job_title && formik.errors.job_title
                    ? String(formik.errors.job_title)
                    : ''
                }
                required
              />
            </FormControl>
          </Box>
        </Box>

        <Box>
          {/* 岗位描述标题和字数限制 */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              岗位描述
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <Box component="span" sx={{ color: 'primary.main' }}>
                {(formik.values.introduction || '').length}
              </Box>
              /{maxLength}
            </Typography>
          </Box>

          <FormControl fullWidth>
            <TextField
              multiline
              rows={6}
              value={formik.values.introduction || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="introduction"
              placeholder="请输入岗位描述..."
              inputProps={{
                maxLength: maxLength,
              }}
            />
          </FormControl>
        </Box>
      </Box>
    </Box>
  );
}
