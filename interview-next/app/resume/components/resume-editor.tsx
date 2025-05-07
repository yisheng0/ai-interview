'use client';

import { useState } from 'react';
import { 
  Box, 
  Paper, 
  Button, 
  Stack,  
  Typography, 
  useTheme,
  Grid,
  Alert,
  Divider
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SaveIcon from '@mui/icons-material/Save';
import PersonalInfo from './personal-info';
import EducationSection from './education-section';
import ExperienceSection from './experience-section';
import SkillsSection from './skills-section';
import SelfIntroSection from './self-intro-section';
import ResumePreview from './resume-preview';

// 定义简历数据类型
interface Education {
  id?: string;
  school: string;
  major: string;
  degree: string;
  startDate: string;
  endDate: string;
}

interface Experience {
  id?: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  current?: boolean;
}

interface PersonalData {
  name: string;
  phone: string;
  email: string;
}

interface ResumeData {
  name: string;
  phone: string;
  email: string;
  education: Education[];
  workExperience: Experience[];
  skills: string[];
  selfDescription: string;
}

// 模拟的初始简历数据
const initialResumeData: ResumeData = {
  name: '',
  phone: '',
  email: '',
  education: [],
  workExperience: [],
  skills: [],
  selfDescription: '',
};

/**
 * 简历编辑器组件
 * 包含个人信息、教育经历、工作经验、技能和自我介绍等部分
 * 采用垂直滚动方式展示所有内容
 */
export default function ResumeEditor() {
  const theme = useTheme();
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  
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
  const handleSave = () => {
    // 这里暂不实现后端保存逻辑
    console.log('保存简历数据:', resumeData);
    // 显示保存成功提示
    alert('简历保存成功！');
  };
  
  // 处理OCR导入
  const handleOcrImport = () => {
    // 这里暂时使用模拟数据
    const ocrData: ResumeData = {
      name: '张三',
      phone: '13800138000',
      email: 'zhangsan@example.com',
      education: [
        {
          id: '1',
          school: '北京大学',
          major: '计算机科学',
          degree: '本科',
          startDate: '2016-09',
          endDate: '2020-07'
        }
      ],
      workExperience: [
        {
          id: '1',
          company: 'XX科技有限公司',
          position: '前端开发工程师',
          startDate: '2020-08',
          endDate: '2023-05',
          description: '负责公司核心产品的前端开发与维护'
        }
      ],
      skills: ['JavaScript', 'React', 'TypeScript', 'Node.js'],
      selfDescription: '拥有3年前端开发经验，熟悉现代前端框架和工具。'
    };
    
    setResumeData(ocrData);
  };
  
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper elevation={2} sx={{ p: 3 }}>
          <Stack direction="row" spacing={2} justifyContent="flex-end" mb={2}>
            <Button 
              variant="contained" 
              color="secondary" 
              startIcon={<CloudUploadIcon />}
              onClick={handleOcrImport}
            >
              OCR导入
            </Button>
            <Button 
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSave}
            >
              保存简历
            </Button>
          </Stack>

          <Alert severity="info" sx={{ mb: 3 }}>
            您可以通过OCR导入简历或手动填写所有信息
          </Alert>
          
          <Box sx={{ 
            maxHeight: 'calc(100vh  - 150px)',
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
            
            {/* 技能特长 */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ 
                py: 1, 
                px: 2, 
                bgcolor: theme.palette.primary.main, 
                color: '#fff',
                borderRadius: 1
              }}>
                技能特长
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
          <ResumePreview resumeData={resumeData} />
        </Grid>
    </Grid>
  );
} 