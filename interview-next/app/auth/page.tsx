'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Link,
  useTheme,
  Paper
} from '@mui/material';
import Image from 'next/image';
import { ThemeToggle } from '@/components/theme-toggle';
import { loginOrRegister } from '@/api/services/authService';
import { useAuthStore } from '@/state';
import { useRouter } from 'next/navigation';

/**
 * 登录页面组件
 * 提供手机验证码登录界面
 */
export default function LoginPage() {
  const theme = useTheme();
  const authStore = useAuthStore();
  const router = useRouter()

  // 手机号码状态
  const [phoneNumber, setPhoneNumber] = useState('');
  // 密码状态
  const [password, setPassword] = useState('');

  /**
   * 处理账号输入变化
   * @param e 输入事件
   */
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneNumber(value);
  };

  /**
   * 处理密码输入变化
   * @param e 输入事件
   */
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
  };

  /**
   * 登入/注册
   */
  const handleLogin = async () => {
    const { data } = await loginOrRegister(phoneNumber, password);
    // 保存到状态管理
    authStore.setAuth(data.token, data.userId, data.username);
    router.push('/agenda')

    // // 获取重定向URL，如果有的话
    // const urlParams = new URLSearchParams(window.location.search);
    // const redirectUrl = urlParams.get('redirect') || '/';

    // // 重定向到目标页面
    // window.location.href = redirectUrl;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
      }} >
      <Container
        maxWidth="sm"
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          pt: 2,
          pb: 2,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 2,
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'white',
            boxShadow: theme.palette.mode === 'dark' ? '0 4px 20px rgba(0, 0, 0, 0.5)' : '0 4px 20px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <ThemeToggle />
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 4,
            }}
          >
            {/* Logo */}
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '16px',
                backgroundColor: '#5ACA9F',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Image
                src="/png/tracep-logo.png"
                alt="行向 Logo"
                width={60}
                height={60}
                priority
              />
            </Box>

            {/* 欢迎语 */}
            <Typography
              variant="h5"
              component="h1"
              align="center"
              sx={{
                fontWeight: 'bold',
                mb: 4,
              }}
            >
              👋 欢迎来到 行向!
            </Typography>
          </Box>

          {/* 登录表单 */}
          <Box>
            <TextField
              fullWidth
              placeholder="账号"
              variant="outlined"
              value={phoneNumber}
              onChange={handlePhoneChange}
              sx={{ mb: 2 }}
              InputProps={{
                sx: {
                  borderRadius: '8px',
                }
              }}
            />
            <TextField
              fullWidth
              placeholder="密码"
              variant="outlined"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              sx={{ mb: 2 }}
              InputProps={{
                sx: {
                  borderRadius: '8px',
                }
              }}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleLogin}
              sx={{
                mt: 1,
                mb: 3,
                borderRadius: '8px',
                py: 1.5,
                backgroundColor: '#5ACA9F',
                '&:hover': {
                  backgroundColor: '#4BB58F',
                },
              }}
            >
              登入
            </Button>
          </Box>

          {/* 协议和隐私政策 */}
          <Box
            sx={{
              textAlign: 'center',
              mt: 2,
              color: theme.palette.text.secondary,
              fontSize: '0.85rem',
            }}
          >
            <Typography variant="body2" sx={{ mb: 1 }}>
              登录即代表您同意我们的
              <Link href="#" underline="hover" sx={{ mx: 0.5 }}>
                用户协议
              </Link>
              和
              <Link href="#" underline="hover" sx={{ ml: 0.5 }}>
                隐私政策
              </Link>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              未注册账号在验证后将自动注册登录
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
} 