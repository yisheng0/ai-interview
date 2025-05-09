'use client';

import { useState } from 'react';
import { 
  Box, 
  TextField, 
  Typography, 
  Chip, 
  Button, 
  Paper,
  Stack,
  Autocomplete
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

// 技能推荐列表
const suggestedSkills = [
  'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue.js', 
  'Node.js', 'Python', 'Java', 'C++', 'C#', 
  'PHP', 'Go', 'Ruby', 'Swift', 'Kotlin',
  'HTML', 'CSS', 'SCSS', 'Docker', 'Kubernetes',
  'AWS', 'Azure', 'GCP', 'MySQL', 'PostgreSQL',
  'MongoDB', 'Redis', 'GraphQL', 'REST API', 'Git',
  '微服务', '敏捷开发', 'DevOps', 'CI/CD', '云计算',
  '数据结构', '算法', '系统设计', '网络安全', '人工智能'
];

interface SkillsSectionProps {
  skills: string[];
  onChange: (skills: string[]) => void;
}

/**
 * 技能组件
 * 支持添加多个技能标签，带有推荐功能
 */
export default function SkillsSection({ skills = [], onChange }: SkillsSectionProps) {
  // 确保skills是数组
  const skillsList = Array.isArray(skills) ? skills : [];
  
  const [newSkill, setNewSkill] = useState<string>('');
  
  // 添加技能
  const handleAddSkill = () => {
    if (!newSkill || skillsList.includes(newSkill)) {
      return;
    }
    
    const updatedSkills = [...skillsList, newSkill];
    onChange(updatedSkills);
    setNewSkill('');
  };
  
  // 删除技能
  const handleDeleteSkill = (skill: string) => {
    const updatedSkills = skillsList.filter(item => item !== skill);
    onChange(updatedSkills);
  };
  
  // 添加推荐技能
  const handleAddSuggested = (skill: string) => {
    if (skillsList.includes(skill)) {
      return;
    }
    
    const updatedSkills = [...skillsList, skill];
    onChange(updatedSkills);
  };
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        技能标签
      </Typography>
      
      <Stack direction="row" spacing={2} alignItems="center" mb={3}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="输入技能名称"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddSkill();
            }
          }}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddSkill}
          disabled={!newSkill || skillsList.includes(newSkill)}
        >
          添加
        </Button>
      </Stack>
      
      {/* 已添加技能 */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3, minHeight: '100px' }}>
        {skillsList.length > 0 ? (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {skillsList.map((skill, index) => (
              <Chip
                key={index}
                label={skill}
                onDelete={() => handleDeleteSkill(skill)}
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary" align="center">
            尚未添加任何技能，请添加或从推荐技能中选择
          </Typography>
        )}
      </Paper>
      
      {/* 推荐技能 */}
      <Typography variant="subtitle1" gutterBottom>
        技能推荐
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {suggestedSkills
          .filter(skill => !skillsList.includes(skill))
          .slice(0, 15)
          .map((skill, index) => (
            <Chip
              key={index}
              label={skill}
              onClick={() => handleAddSuggested(skill)}
              color="secondary"
              variant="outlined"
              size="small"
            />
          ))}
      </Box>
      
      {/* 技能搜索 */}
      <Box sx={{ mt: 4 }}>
        <Autocomplete
          freeSolo
          options={suggestedSkills.filter(skill => !skillsList.includes(skill))}
          renderInput={(params) => (
            <TextField {...params} label="搜索技能" variant="outlined" />
          )}
          value={newSkill}
          onChange={(event, newValue) => {
            if (typeof newValue === 'string') {
              setNewSkill(newValue);
            }
          }}
          onInputChange={(event, newInputValue) => {
            setNewSkill(newInputValue);
          }}
        />
      </Box>
    </Box>
  );
} 