'use client';

import { useState } from 'react';
import { 
  Box, 
  Button, 
  Grid, 
  TextField, 
  Typography, 
  IconButton, 
  Card, 
  CardContent,
  Stack
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

interface Education {
  id?: string;
  school: string;
  major: string;
  degree: string;
  startDate: string;
  endDate: string;
}

interface EducationSectionProps {
  education: Education[];
  onChange: (education: Education[]) => void;
}

/**
 * 教育经历组件
 * 支持添加、编辑和删除多条教育经历
 */
export default function EducationSection({ education, onChange }: EducationSectionProps) {
  // 初始化一个空的教育经历对象
  const emptyEducation: Education = {
    id: Date.now().toString(),
    school: '',
    major: '',
    degree: '',
    startDate: '',
    endDate: '',
  };
  
  // 编辑中的教育经历
  const [currentEducation, setCurrentEducation] = useState<Education>(emptyEducation);
  const [isEditing, setIsEditing] = useState(false);
  
  // 处理字段变更
  const handleChange = (field: keyof Education) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentEducation({
      ...currentEducation,
      [field]: event.target.value,
    });
  };
  
  // 添加或更新教育经历
  const handleAddOrUpdate = () => {
    // 校验必填字段
    if (!currentEducation.school || !currentEducation.major) {
      alert('请填写必要的学校和专业信息');
      return;
    }
    
    let updatedEducation;
    if (isEditing) {
      // 更新已有记录
      updatedEducation = education.map(item => 
        item.id === currentEducation.id ? currentEducation : item
      );
    } else {
      // 添加新记录
      updatedEducation = [...education, { ...currentEducation, id: Date.now().toString() }];
    }
    
    onChange(updatedEducation);
    setCurrentEducation(emptyEducation);
    setIsEditing(false);
  };
  
  // 编辑教育经历
  const handleEdit = (eduItem: Education) => {
    setCurrentEducation(eduItem);
    setIsEditing(true);
  };
  
  // 删除教育经历
  const handleDelete = (id: string | undefined) => {
    if (!id) return;
    const updatedEducation = education.filter(item => item.id !== id);
    onChange(updatedEducation);
  };
  
  // 取消编辑
  const handleCancel = () => {
    setCurrentEducation(emptyEducation);
    setIsEditing(false);
  };
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {isEditing ? '编辑教育经历' : '添加教育经历'}
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            id="school"
            name="school"
            label="学校名称"
            value={currentEducation.school}
            onChange={handleChange('school')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            id="major"
            name="major"
            label="专业"
            value={currentEducation.major}
            onChange={handleChange('major')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="degree"
            name="degree"
            label="学位"
            value={currentEducation.degree}
            onChange={handleChange('degree')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="startDate"
            name="startDate"
            label="开始时间"
            type="month"
            value={currentEducation.startDate}
            onChange={handleChange('startDate')}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="endDate"
            name="endDate"
            label="结束时间"
            type="month"
            value={currentEducation.endDate}
            onChange={handleChange('endDate')}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" spacing={2}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleAddOrUpdate}
              startIcon={isEditing ? null : <AddIcon />}
            >
              {isEditing ? '更新' : '添加'}
            </Button>
            {isEditing && (
              <Button variant="outlined" onClick={handleCancel}>
                取消
              </Button>
            )}
          </Stack>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          已添加教育经历({education.length})
        </Typography>
        
        {education.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            尚未添加任何教育经历
          </Typography>
        ) : (
          education.map((edu, index) => (
            <Card key={edu.id || index} sx={{ mb: 2 }}>
              <CardContent>
                <Grid container>
                  <Grid item xs={10}>
                    <Typography variant="subtitle1" component="div">
                      {edu.school} - {edu.major}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {edu.degree} · {edu.startDate} 至 {edu.endDate || '至今'}
                    </Typography>
                  </Grid>
                  <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton 
                      size="small" 
                      onClick={() => handleEdit(edu)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => handleDelete(edu.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    </Box>
  );
} 