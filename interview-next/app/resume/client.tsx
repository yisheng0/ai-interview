'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Button, 
  Stack,  
  Typography, 
  useTheme,
  Grid,
  Alert,
  Divider,
  CircularProgress,
  Snackbar,
  AppBar,
  Toolbar,
  IconButton,
  Tooltip
} from '@mui/material';
import Link from 'next/link';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SaveIcon from '@mui/icons-material/Save';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonalInfo from './components/personal-info';
import EducationSection from './components/education-section';
import ExperienceSection from './components/experience-section';
import SkillsSection from './components/skills-section';
import SelfIntroSection from './components/self-intro-section';
import ResumePreview from './components/resume-preview';
import { RESUME_OCR_TO_JSON } from '@/utils/prompt';
import { clientLogger } from '@/utils/logger';
import { ThemeToggle } from '@/components/theme-toggle';
import { 
  resumeService,
  ResumeData 
} from '@/api/services/resumeService';

// 用类型导入替代内联定义
import type { 
  Education, 
  Experience 
} from '@/api/services/resumeService';

interface PersonalData {
  name: string;
  phone: string;
  email: string;
}

interface ResumeClientProps {
  initialData?: ResumeData;
}

/**
 * 简历编辑客户端组件
 * 处理所有客户端交互和UI渲染
 */
export default function ResumeClient({ initialData }: ResumeClientProps) {
  const theme = useTheme();
  
  // 初始简历数据，如果传入则使用传入数据，否则使用空数据
  const emptyResumeData: ResumeData = {
    name: '',
    phone: '',
    email: '',
    education: [],
    workExperience: [],
    skills: [],
    selfDescription: '',
  };
  
  const [resumeData, setResumeData] = useState<ResumeData>(initialData || emptyResumeData);
  const [loading, setLoading] = useState<boolean>(false);
  const [ocrLoading, setOcrLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<{open: boolean; message: string; type: 'success' | 'error'}>({
    open: false,
    message: '',
    type: 'success'
  });
  const [fileInput, setFileInput] = useState<HTMLInputElement | null>(null);
  
  // 页面加载时获取简历数据
  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        setLoading(true);
        const response = await resumeService.getResumeList();
        
        if (response.code === 200 && response.data && response.data.length > 0) {
          // 获取第一份简历详情
          const resumeDetailRes = await resumeService.getResumeDetail(response.data[0].id);
          
          if (resumeDetailRes.code === 200 && resumeDetailRes.data) {
            setResumeData(resumeDetailRes.data);
          }
        }
      } catch (error) {
        clientLogger.error('获取简历数据失败:', error);
        showNotification('获取简历数据失败，请稍后重试', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResumeData();
    
    // 创建文件上传input元素
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.pdf';
    input.style.display = 'none';
    input.addEventListener('change', handleFileSelected);
    document.body.appendChild(input);
    setFileInput(input);
    
    return () => {
      // 检查节点是否存在且是body的子节点，避免报错
      if (input && document.body.contains(input)) {
        document.body.removeChild(input);
      }
    };
  }, []);
  
  // 显示通知消息
  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({
      open: true,
      message,
      type
    });
  };
  
  // 关闭通知
  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };
  
  // 处理个人信息变更
  const handlePersonalInfoChange = (data: PersonalData) => {
    setResumeData(prev => ({
      ...prev,
      name: data.name,
      phone: data.phone,
      email: data.email
    }));
  };
  
  // 处理教育经历变更
  const handleEducationChange = (data: Education[]) => {
    setResumeData(prev => ({
      ...prev,
      education: data
    }));
  };
  
  // 处理工作经验变更
  const handleExperienceChange = (data: Experience[]) => {
    setResumeData(prev => ({
      ...prev,
      workExperience: data
    }));
  };
  
  // 处理技能变更
  const handleSkillsChange = (data: string[]) => {
    setResumeData(prev => ({
      ...prev,
      skills: data
    }));
  };
  
  // 处理自我介绍变更
  const handleSelfIntroChange = (data: string) => {
    setResumeData(prev => ({
      ...prev,
      selfDescription: data
    }));
  };
  
  // 保存简历处理函数
  const handleSave = async () => {
    try {
      setLoading(true);
      // 调用API保存数据
      const response = await resumeService.saveResume(resumeData);
      
      if (response.code === 200 && response.data) {
        // 更新简历ID（如果是新建的情况）
        setResumeData(prev => ({
          ...prev,
          id: response.data.id
        }));
        showNotification('简历保存成功！', 'success');
      } else {
        throw new Error(response.message || '保存简历失败');
      }
    } catch (error) {
      clientLogger.error('保存简历失败:', error);
      showNotification('保存失败，请重试', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // 处理OCR导入点击
  const handleOcrImportClick = () => {
    if (fileInput) {
      fileInput.click();
    }
  };
  
  // 处理文件选择
  async function handleFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (!target.files || target.files.length === 0) return;
    
    const file = target.files[0];
    
    try {
      setOcrLoading(true);
      // 上传文件
      // const uploadResponse = await resumeService.uploadResume(file);
      
      // if (uploadResponse.code !== 200 || !uploadResponse.data) {
      //   throw new Error(uploadResponse.message || '上传文件失败');
      // }
      
      // 调用OCR识别API
      const ocrResponse = await resumeService.ocrRecognize(
        RESUME_OCR_TO_JSON,
        file
      );
      
      if (ocrResponse.code !== 200 || !ocrResponse.data) {
        throw new Error(ocrResponse.message || 'OCR识别失败');
      }
      
      // 解析OCR返回的JSON数据
      try {
        // 预处理返回的文本，移除markdown代码块标记
        let jsonText = ocrResponse.data.reply;
        clientLogger.info('原始OCR返回内容:', jsonText);
        
        // 使用正则表达式提取JSON内容
        const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        
        if (jsonMatch && jsonMatch[1]) {
          jsonText = jsonMatch[1].trim();
        } else {
          // 如果没有匹配到完整的代码块，尝试基本清理
          jsonText = jsonText.replace(/```(?:json)?/g, '').replace(/```/g, '').trim();
        }
        
        clientLogger.info('处理后的JSON:', jsonText);
        
        // 解析处理后的JSON文本
        const parsedData = JSON.parse(jsonText);
        
        // 确保使用已解析的数据更新简历
        setResumeData({
          ...resumeData,
          name: parsedData.name || '',
          phone: parsedData.phone || '',
          email: parsedData.email || '',
          education: parsedData.education || [],
          workExperience: parsedData.workExperience || [],
          skills: parsedData.skills || [],
          selfDescription: parsedData.selfDescription || ''
        });
        
        showNotification('简历导入成功！', 'success');
      } catch (parseError) {
        clientLogger.error('解析OCR数据失败:', parseError);
        showNotification('解析简历数据失败', 'error');
      }
    } catch (error) {
      clientLogger.error('OCR导入失败:', error);
      showNotification('导入失败，请重试', 'error');
    } finally {
      setOcrLoading(false);
      // 清空文件输入，允许重复选择同一文件
      if (target) target.value = '';
    }
  }
  
  return (
    <Box sx={{ width: '100%', height: '100%', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      {/* 顶部导航栏 */}
      <AppBar position="static" color="default" elevation={1} sx={{ bgcolor: 'background.paper' }}>
        <Toolbar>
          {/* 左侧 - 面试日程跳转 */}
          <Tooltip title="前往面试日程">
            <Button 
              component={Link} 
              href="/agenda"
              startIcon={<CalendarMonthIcon />}
              color="primary"
              sx={{ mr: 2 }}
            >
              面试日程
            </Button>
          </Tooltip>
          
          <Typography variant="h4" component="div" color="primary" sx={{ flexGrow: 1, textAlign: 'center' }}>
            简历编辑
          </Typography>
        
          <ThemeToggle />
        </Toolbar>
      </AppBar>
      
      {/* 主要内容区域 */}
      <Box sx={{ p: 4, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Grid container spacing={3} sx={{ width: '80%' }}>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Stack direction="row" spacing={2} justifyContent="flex-end" mb={2}>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  startIcon={<CloudUploadIcon />}
                  onClick={handleOcrImportClick}
                  disabled={ocrLoading}
                >
                  {ocrLoading ? <CircularProgress size={24} color="inherit" /> : 'OCR导入'}
                </Button>
                <Button 
                  variant="contained"
                  color="primary"
                  startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <SaveIcon />}
                  onClick={handleSave}
                  disabled={loading}
                >
                  保存简历
                </Button>
              </Stack>

              <Alert severity="info" sx={{ mb: 3 }}>
                您可以通过OCR导入简历或手动填写所有信息
              </Alert>
              
              <Box sx={{ 
                maxHeight: 'calc(100vh - 200px)',
                overflow: 'auto',
                pr: 2
              }}>
                {/* 个人信息 */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom sx={{ 
                    py: 1, 
                    px: 2, 
                    bgcolor: theme.palette.primary.main, 
                    color: '#fff',
                    borderRadius: 1
                  }}>
                    个人信息
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <PersonalInfo 
                      data={{ name: resumeData.name, phone: resumeData.phone, email: resumeData.email }} 
                      onChange={handlePersonalInfoChange} 
                    />
                  </Box>
                </Box>
                
                <Divider sx={{ my: 3 }} />
                
                {/* 教育经历 */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom sx={{ 
                    py: 1, 
                    px: 2, 
                    bgcolor: theme.palette.primary.main, 
                    color: '#fff',
                    borderRadius: 1
                  }}>
                    教育经历
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <EducationSection 
                      education={resumeData.education} 
                      onChange={handleEducationChange} 
                    />
                  </Box>
                </Box>
                
                <Divider sx={{ my: 3 }} />
                
                {/* 工作经验 */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom sx={{ 
                    py: 1, 
                    px: 2, 
                    bgcolor: theme.palette.primary.main,
                    color: '#fff',
                    borderRadius: 1
                  }}>
                    工作经验
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <ExperienceSection 
                      experience={resumeData.workExperience} 
                      onChange={handleExperienceChange} 
                    />
                  </Box>
                </Box>
                
                <Divider sx={{ my: 3 }} />
                
                {/* 技能 */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom sx={{ 
                    py: 1, 
                    px: 2, 
                    bgcolor: theme.palette.primary.main,
                    color: '#fff',
                    borderRadius: 1
                  }}>
                    技能
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <SkillsSection 
                      skills={resumeData.skills} 
                      onChange={handleSkillsChange} 
                    />
                  </Box>
                </Box>
                
                <Divider sx={{ my: 3 }} />
                
                {/* 自我介绍 */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom sx={{ 
                    py: 1, 
                    px: 2, 
                    bgcolor: theme.palette.primary.main,
                    color: '#fff',
                    borderRadius: 1
                  }}>
                    自我介绍
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <SelfIntroSection 
                      selfIntro={resumeData.selfDescription} 
                      onChange={handleSelfIntroChange} 
                    />
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom color="primary">
                简历预览
              </Typography>
              <Box sx={{ 
                bgcolor: '#f9f9f9', 
                p: 3, 
                borderRadius: 1,
                maxHeight: 'calc(100vh - 200px)',
                overflow: 'auto'
              }}>
                <ResumePreview resumeData={resumeData} />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      
      {/* 通知消息 */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        message={notification.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        ContentProps={{
          sx: { 
            bgcolor: notification.type === 'success' ? 'success.main' : 'error.main',
            color: '#fff'
          }
        }}
      />
    </Box>
  );
} 