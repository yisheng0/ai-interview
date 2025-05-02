'use client';

import { useThemeStore } from '@/state/themeStore';
import { Box, Typography, Paper, Button, Card, CardContent, Container, Stack } from '@mui/material';

export default function Home() {
  const { themeMode } = useThemeStore();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Next.js Material UI 主题切换演示
      </Typography>
      
      <Typography variant="h5" component="h2" gutterBottom>
        当前主题：{themeMode === 'light' ? '浅色' : '深色'}
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, my: 4 }}>
        <Typography variant="h6" gutterBottom>
          主题样式演示
        </Typography>
        <Typography variant="body1" paragraph>
          这是一个主题切换的演示应用。你可以通过点击顶部导航栏的主题切换图标来切换主题。
          系统会自动检测你设备的主题偏好，并应用对应的主题。
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
          <Card sx={{ flex: '1 1 300px', minWidth: 250 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>浅色/深色模式</Typography>
              <Typography variant="body2">
                Material UI 提供了完整的主题定制功能，支持浅色和深色模式，以及自定义主题颜色。
              </Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ flex: '1 1 300px', minWidth: 250 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>TypeScript支持</Typography>
              <Typography variant="body2">
                完整的TypeScript支持确保类型安全和更好的开发体验。
              </Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ flex: '1 1 300px', minWidth: 250 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>状态管理</Typography>
              <Typography variant="body2">
                使用Zustand进行状态管理，简单而高效。
              </Typography>
            </CardContent>
          </Card>
        </Box>
        
        <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
          <Button variant="contained" color="primary">
            主要按钮
          </Button>
          <Button variant="contained" color="secondary">
            次要按钮
          </Button>
          <Button variant="outlined" color="primary">
            边框按钮
          </Button>
          <Button variant="text" color="primary">
            文本按钮
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
