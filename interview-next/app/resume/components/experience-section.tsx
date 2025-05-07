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
  Stack,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

interface Experience {
  id?: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  current?: boolean;
}

interface ExperienceSectionProps {
  experience: Experience[];
  onChange: (experience: Experience[]) => void;
}

/**
 * 工作经验组件
 * 支持添加、编辑和删除多条工作经验
 */
export default function ExperienceSection({ experience, onChange }: ExperienceSectionProps) {
  // 初始化一个空的工作经验对象
  const emptyExperience: Experience = {
    id: Date.now().toString(),
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    description: '',
    current: false
  };
  
  // 编辑中的工作经验
  const [currentExperience, setCurrentExperience] = useState<Experience>(emptyExperience);
  const [isEditing, setIsEditing] = useState(false);
  
  // 处理字段变更
  const handleChange = (field: keyof Experience) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = field === 'current' ? event.target.checked : event.target.value;
    setCurrentExperience({
      ...currentExperience,
      [field]: value,
      ...(field === 'current' && event.target.checked ? { endDate: '' } : {})
    });
  };
  
  // 添加或更新工作经验
  const handleAddOrUpdate = () => {
    // 校验必填字段
    if (!currentExperience.company || !currentExperience.position || !currentExperience.startDate) {
      alert('请填写必要的公司、职位和开始时间信息');
      return;
    }
    
    let updatedExperience;
    if (isEditing) {
      // 更新已有记录
      updatedExperience = experience.map(item => 
        item.id === currentExperience.id ? currentExperience : item
      );
    } else {
      // 添加新记录
      updatedExperience = [...experience, { ...currentExperience, id: Date.now().toString() }];
    }
    
    onChange(updatedExperience);
    setCurrentExperience(emptyExperience);
    setIsEditing(false);
  };
  
  // 编辑工作经验
  const handleEdit = (expItem: Experience) => {
    setCurrentExperience(expItem);
    setIsEditing(true);
  };
  
  // 删除工作经验
  const handleDelete = (id: string | undefined) => {
    if (!id) return;
    const updatedExperience = experience.filter(item => item.id !== id);
    onChange(updatedExperience);
  };
  
  // 取消编辑
  const handleCancel = () => {
    setCurrentExperience(emptyExperience);
    setIsEditing(false);
  };
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {isEditing ? '编辑工作经验' : '添加工作经验'}
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            id="company"
            name="company"
            label="公司名称"
            value={currentExperience.company}
            onChange={handleChange('company')}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            id="position"
            name="position"
            label="职位"
            value={currentExperience.position}
            onChange={handleChange('position')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            id="startDate"
            name="startDate"
            label="开始时间"
            type="month"
            value={currentExperience.startDate}
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
            disabled={currentExperience.current}
            value={currentExperience.endDate}
            onChange={handleChange('endDate')}
            InputLabelProps={{ shrink: true }}
          />
          <FormControlLabel
            control={
              <Checkbox 
                checked={!!currentExperience.current} 
                onChange={handleChange('current')} 
                name="current" 
              />
            }
            label="至今"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            id="description"
            name="description"
            label="工作描述"
            value={currentExperience.description}
            onChange={handleChange('description')}
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
          已添加工作经验({experience.length})
        </Typography>
        
        {experience.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            尚未添加任何工作经验
          </Typography>
        ) : (
          experience.map((exp, index) => (
            <Card key={exp.id || index} sx={{ mb: 2 }}>
              <CardContent>
                <Grid container>
                  <Grid item xs={10}>
                    <Typography variant="subtitle1" component="div">
                      {exp.company} - {exp.position}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {exp.startDate} 至 {exp.current ? '至今' : exp.endDate}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {exp.description}
                    </Typography>
                  </Grid>
                  <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton 
                      size="small" 
                      onClick={() => handleEdit(exp)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => handleDelete(exp.id)}
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