'use client';

import { useState } from 'react';
import { useThemeStore } from '@/state/themeStore';
import { 
  Container, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
  Box,
  Card,
  CardContent
} from '@mui/material';

export default function ReportsPage() {
  const { themeMode } = useThemeStore();
  const [reports, setReports] = useState([
    { id: 1, date: '2023-05-20', content: '今日完成了主题切换功能的实现' },
    { id: 2, date: '2023-05-19', content: '配置了Material UI组件库并进行了自定义' },
    { id: 3, date: '2023-05-18', content: '整合了zustand状态管理库，实现全局状态共享' },
  ]);
  const [newReport, setNewReport] = useState('');

  const handleAddReport = () => {
    if (!newReport.trim()) return;
    
    const today = new Date().toISOString().split('T')[0];
    const newId = reports.length > 0 ? Math.max(...reports.map(r => r.id)) + 1 : 1;
    
    setReports([
      { id: newId, date: today, content: newReport.trim() },
      ...reports
    ]);
    
    setNewReport('');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        日报管理
      </Typography>
      
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            当前主题: {themeMode === 'light' ? '浅色' : '深色'}模式
          </Typography>
          <Typography variant="body1" paragraph>
            在此页面您可以添加、查看日报。使用顶部导航栏的主题切换图标可以切换浅色/深色模式，提高在不同环境下的阅读体验。
          </Typography>
        </CardContent>
      </Card>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          添加今日日报
        </Typography>
        
        <TextField
          fullWidth
          multiline
          rows={4}
          label="今日工作内容"
          variant="outlined"
          value={newReport}
          onChange={(e) => setNewReport(e.target.value)}
          sx={{ mb: 2 }}
        />
        
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleAddReport}
          disabled={!newReport.trim()}
        >
          提交日报
        </Button>
      </Paper>
      
      <Paper elevation={2}>
        <Typography variant="h6" sx={{ p: 2 }}>
          历史日报
        </Typography>
        <Divider />
        
        <List>
          {reports.map((report, index) => (
            <Box key={report.id}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={<Box component="span" fontWeight="bold">{report.date}</Box>}
                  secondary={report.content}
                />
              </ListItem>
              {index < reports.length - 1 && <Divider />}
            </Box>
          ))}
        </List>
      </Paper>
    </Container>
  );
} 