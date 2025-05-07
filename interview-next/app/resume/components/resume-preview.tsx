'use client';

import { 
  Box, 
  Paper, 
  Typography, 
  Divider, 
  List,
  ListItem,
  ListItemText,
  Chip,
  Stack,
  Card,
  CardContent,
  Button
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

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

interface ResumeData {
  name: string;
  phone: string;
  email: string;
  education: Education[];
  workExperience: Experience[];
  skills: string[];
  selfDescription: string;
}

interface ResumePreviewProps {
  resumeData: ResumeData;
}

/**
 * 简历预览组件
 * 以预览模式展示简历内容
 */
export default function ResumePreview({ resumeData }: ResumePreviewProps) {
  const { name, phone, email, education, workExperience, skills, selfDescription } = resumeData;
  
  // 打印简历
  const handlePrint = () => {
    window.print();
  };
  
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 4, 
        minHeight: '100%', 
        position: 'sticky',
        top: 16,
        '@media print': {
          boxShadow: 'none'
        }
      }}
      className="resume-preview"
    >
      <Box sx={{ mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={handlePrint}
          sx={{ 
            float: 'right',
            '@media print': {
              display: 'none'
            }
          }}
        >
          打印/导出PDF
        </Button>
        <Typography variant="h5" align="center" gutterBottom>
          个人简历
        </Typography>
      </Box>
      
      {/* 个人信息 */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          {name || '姓名'}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {phone && `电话: ${phone}`} {phone && email && '|'} {email && `邮箱: ${email}`}
        </Typography>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      {/* 自我介绍 */}
      {selfDescription && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            自我介绍
          </Typography>
          <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
            {selfDescription}
          </Typography>
        </Box>
      )}
      
      {/* 教育经历 */}
      {education.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            教育经历
          </Typography>
          <List disablePadding>
            {education.map((edu, index) => (
              <ListItem key={edu.id || index} disableGutters>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="subtitle1" component="span">
                        {edu.school}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" component="span">
                        {edu.startDate} - {edu.endDate || '至今'}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" component="span">
                        {edu.major} {edu.degree && `· ${edu.degree}`}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
      
      {/* 工作经验 */}
      {workExperience.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            工作经验
          </Typography>
          <Stack spacing={2}>
            {workExperience.map((exp, index) => (
              <Card key={exp.id || index} variant="outlined">
                <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle1">
                      {exp.company}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {exp.startDate} - {exp.current ? '至今' : exp.endDate}
                    </Typography>
                  </Box>
                  <Typography variant="subtitle2" gutterBottom>
                    {exp.position}
                  </Typography>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                    {exp.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Box>
      )}
      
      {/* 技能标签 */}
      {skills.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            专业技能
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {skills.map((skill, index) => (
              <Chip key={index} label={skill} color="primary" size="small" />
            ))}
          </Box>
        </Box>
      )}
      
      {/* 打印样式 */}
      <style jsx global>{`
        @media print {
          body {
            background: white;
          }
          .resume-preview {
            box-shadow: none !important;
            padding: 0 !important;
          }
          .main-content {
            padding: 0 !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </Paper>
  );
} 