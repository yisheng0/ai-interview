'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Typography, 
  Paper,
  Button,
  Stack
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

interface SelfIntroSectionProps {
  selfIntro: string;
  onChange: (selfIntro: string) => void;
}

/**
 * 自我介绍组件
 * 提供文本编辑器和字数统计
 */
export default function SelfIntroSection({ selfIntro, onChange }: SelfIntroSectionProps) {
  const [text, setText] = useState(selfIntro);
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const maxLength = 2000;
  
  // 监听文本变化，更新字数统计
  useEffect(() => {
    setCharCount(text.length);
    // 简单的中英文单词统计
    const englishWords = text.trim().split(/\s+/).filter(Boolean).length;
    const chineseChars = text.match(/[\u4e00-\u9fa5]/g)?.length || 0;
    setWordCount(englishWords + chineseChars);
  }, [text]);
  
  // 保存内容
  const handleSave = () => {
    onChange(text);
  };
  
  // 自动保存
  useEffect(() => {
    const timer = setTimeout(() => {
      if (text !== selfIntro) {
        onChange(text);
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [text, selfIntro, onChange]);
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        自我介绍
      </Typography>
      
      <Typography variant="body2" color="text.secondary" gutterBottom>
        请撰写简洁有力的自我介绍，突出你的技能、经验和职业目标。建议控制在500-1000字以内。
      </Typography>
      
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={12}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="请在此处输入您的自我介绍..."
          inputProps={{ maxLength }}
          sx={{ mb: 2 }}
        />
        
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" color="text.secondary">
            字数: {charCount}/{maxLength} · 单词数: ~{wordCount}
          </Typography>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={text === selfIntro}
          >
            保存
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
} 