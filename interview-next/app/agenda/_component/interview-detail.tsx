'use client';

import { Box, Button, Chip, Divider, IconButton, Menu, MenuItem, Paper, Stack, Typography, alpha, useTheme } from '@mui/material';
import { useState } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import dayjs from 'dayjs';
import { format, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale/zh-CN';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { InterviewStatus, RoundStatus, deleteInterviewRound, updateInterview, deleteInterview } from '@/api/services/interviewService';
import { useInterviewStore } from '@/state/interview-store';
import { useModalStore } from '@/state/dialog-store';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

// 模拟中文数字转换
const convertToChinese = (num: number) => {
  const chineseNums = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
  return num <= 10 ? chineseNums[num] : `${num}`;
};

/**
 * 面试轮次卡片组件属性
 */
interface InterviewRoundCardProps {
  roundNumber: number;
  scheduledTime: string;
  status: RoundStatus;
  hasSession?: boolean;
  roundId?: string;
  sessionId?: string;
  interviewId?: string;
  onDelete?: () => void;
  onStatusChange?: (newStatus: RoundStatus) => void;
}

/**
 * 轮次状态配置
 */
const roundStatusConfig: Record<
  RoundStatus,
  {
    text: string;
    color: string;
    bgColor: string;
  }
> = {
  [RoundStatus.PENDING]: { text: '待进行', color: 'info.main', bgColor: 'rgba(33, 150, 243, 0.1)' },
  [RoundStatus.ONGOING]: { text: '进行中', color: 'secondary.main', bgColor: 'rgba(156, 39, 176, 0.1)' },
  [RoundStatus.COMPLETED]: { text: '已完成', color: 'success.main', bgColor: 'rgba(76, 175, 80, 0.1)' },
  [RoundStatus.FAILED]: { text: '未通过', color: 'error.main', bgColor: 'rgba(244, 67, 54, 0.1)' },
};

/**
 * 面试轮次卡片组件
 */
function InterviewRoundCard({ roundNumber, scheduledTime, status, hasSession = false, roundId, sessionId, interviewId, onDelete, onStatusChange, ...props }: InterviewRoundCardProps) {
  const router = useRouter();

  // 格式化日期
  const formattedDate = (() => {
    try {
      // 尝试判断scheduledTime格式
      let dateObj;

      if (Array.isArray(scheduledTime) && scheduledTime.length >= 3) {
        // 处理数组格式 [year, month, day, hour, minute, second]
        // Date 构造函数中月份参数是 0-indexed
        dateObj = new Date(
          scheduledTime[0],      // year
          scheduledTime[1] - 1,  // month (0-indexed)
          scheduledTime[2],      // day
          scheduledTime[3] || 0, // hour (optional)
          scheduledTime[4] || 0, // minute (optional)
          scheduledTime[5] || 0  // second (optional)
        );
      } else if (typeof scheduledTime === 'string' && /^\d{10,}$/.test(scheduledTime.toString())) {
        // 如果是纯数字且长度大于等于10，可能是时间戳 (兼容旧数据)
        const timestamp = parseInt(scheduledTime.toString());
        dateObj = new Date(timestamp);
      }
      else {
        // 否则尝试标准日期格式解析 (如 ISO 字符串)
        dateObj = parseISO(scheduledTime);
      }

      // 检查日期是否有效
      if (isNaN(dateObj.getTime())) {
        throw new Error('无效日期');
      }

      return format(dateObj, 'yyyy/MM/dd', { locale: zhCN });
    } catch (error) {
      // 显示原始格式但尝试格式化
      if (typeof scheduledTime === 'string' && scheduledTime.length >= 8) {
        try {
          // 尝试格式化纯数字字符串 yyyyMMdd...
          if (/^\d+$/.test(scheduledTime)) {
            return `${scheduledTime.slice(0, 4)}/${scheduledTime.slice(4, 6)}/${scheduledTime.slice(6, 8)}`;
          }
        } catch (e) {
          // 格式化失败，返回原样
        }
      }
      return scheduledTime?.toString() || '';
    }
  })();

  // 轮次转中文
  const roundText =
    roundNumber === 1 ? '一面' :
      roundNumber === 2 ? '二面' :
        roundNumber === 3 ? '三面' : `${roundNumber}面`;

  // 处理进入面试会话（带sessionId、interviewId、roundId跳转）
  const handleEnterSession = () => {
    // interviewId和roundId都必须有
    if (!interviewId || !roundId) return;
    if (sessionId) {
      router.push(`/session?session=${sessionId}&interview=${interviewId}&round=${roundId}`);
    } else {
      router.push(`/session?interview=${interviewId}&round=${roundId}`);
    }
  };

  // 轮次状态操作按钮
  const renderStatusActions = () => {
    if (!onStatusChange) return null;
    if (status === RoundStatus.PENDING) {
      return (
        <Button size="small" onClick={() => onStatusChange(RoundStatus.ONGOING)} sx={{ ml: 1 }}>
          开始面试
        </Button>
      );
    }
    if (status === RoundStatus.ONGOING) {
      return (
        <>
          <Button size="small" color="success" onClick={() => onStatusChange(RoundStatus.COMPLETED)} sx={{ ml: 1 }}>
            完成
          </Button>
          <Button size="small" color="error" onClick={() => onStatusChange(RoundStatus.FAILED)} sx={{ ml: 1 }}>
            未通过
          </Button>
        </>
      );
    }
    return null;
  };

  // 删除按钮
  const renderDeleteAction = () => {
    if (!onDelete) return null;
    return (
      <Button size="small" color="error" onClick={onDelete} sx={{ ml: 1 }}>
        删除
      </Button>
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 2,
        background: 'linear-gradient(to right, rgba(33, 150, 243, 0.05), transparent)',
        cursor: hasSession ? 'pointer' : 'default',
        '&:hover': {
          bgcolor: hasSession ? 'action.hover' : 'transparent',
        },
      }}
      onClick={handleEnterSession}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="column" spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="subtitle1" fontWeight="medium">
              {roundText}
            </Typography>
            <Box
              sx={{
                px: 1,
                borderRadius: 1,
                bgcolor: roundStatusConfig[status].bgColor,
              }}
            >
              <Typography variant="body2" color={roundStatusConfig[status].color}>
                {roundStatusConfig[status].text}
              </Typography>
            </Box>
            {renderStatusActions()}
            {renderDeleteAction()}
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {formattedDate}
          </Typography>
        </Stack>

        {hasSession && (
          <Button
            variant="outlined"
            size="small"
            sx={{ borderRadius: 2, textTransform: 'none' }}
            onClick={e => { e.stopPropagation(); handleEnterSession(); }}
          >
            进入
          </Button>
        )}
      </Stack>
    </Paper>
  );
}

/**
 * 面试详情组件
 *
 * 显示选中面试的详细信息，包括公司、职位、轮次、描述等
 *
 * @returns {JSX.Element} 面试详情组件
 */
export default function InterviewDetail() {
  const theme = useTheme();
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentInterview, setCurrentInterview } = useInterviewStore();
  const { openInterviewAgendaDetailDialog } = useModalStore();
  const router = useRouter();

  // 获取菜单打开状态
  const isMenuOpen = Boolean(menuAnchorEl);

  // 处理打开菜单
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  // 处理关闭菜单
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  // 处理编辑面试
  const handleEdit = () => {
    handleMenuClose();
    openInterviewAgendaDetailDialog(currentInterview);
  };

  // 处理删除面试
  const handleDelete = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  // 处理更新面试状态
  const handleStatusUpdate = (newStatus: string) => {
    console.log('更新状态为:', newStatus);
  };

  // 处理进入面试会话
  const handleEnterSession = () => {
    if (!currentInterview) return;
    // 优先取最新一轮有sessionId的轮次
    const round = currentInterview.rounds?.slice().reverse().find(r => r.sessionId);
    // 取最新一轮（无论有无sessionId）
    const lastRound = currentInterview.rounds?.slice().reverse()[0];
    const interviewId = currentInterview.id;
    const roundId = round?.id || lastRound?.id;
    const sessionId = round?.sessionId;
    if (!interviewId || !roundId) return;
    if (sessionId) {
      router.push(`/session?session=${sessionId}&interview=${interviewId}&round=${roundId}`);
    } else {
      router.push(`/session?interview=${interviewId}&round=${roundId}`);
    }
  };

  // 处理添加新的面试轮次
  const handleAddRound = () => {
    openInterviewAgendaDetailDialog(currentInterview);
  };

  // 删除弹窗相关状态
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // 控制整体删除弹窗
  const [deleteRoundId, setDeleteRoundId] = useState<string | null>(null); // 控制轮次删除弹窗

  // 确认整体面试删除
  const handleConfirmDelete = async () => {
    if (!currentInterview?.id) return;
    setIsSubmitting(true);
    try {
      const ok = await deleteInterview(currentInterview.id);
      if (ok) {
        toast.success('面试已删除');
        setDeleteDialogOpen(false);
        setCurrentInterview(null); // 清空全局当前面试
        router.push('/agenda'); // 跳转回日程列表
      } else {
        toast.error('删除失败');
      }
    } catch (e) {
      toast.error('删除异常');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 处理轮次删除（弹出确认）
  const handleRoundDelete = (roundId: string) => {
    setDeleteRoundId(roundId);
  };

  // 确认轮次删除
  const handleConfirmRoundDelete = async () => {
    if (!deleteRoundId || !currentInterview) return;
    setIsSubmitting(true);
    try {
      const ok = await deleteInterviewRound(deleteRoundId);
      if (ok) {
        toast.success('轮次删除成功');
        setDeleteRoundId(null);
        // 本地过滤掉已删除的轮次，并同步到全局store
        const newRounds = currentInterview.rounds.filter(r => r.id !== deleteRoundId);
        const updated = { ...currentInterview, rounds: newRounds };
        setCurrentInterview(updated);
      } else {
        toast.error('轮次删除失败');
      }
    } catch (e) {
      toast.error('轮次删除异常');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 新增：处理轮次状态变更
  const handleRoundStatusChange = async (roundId: string, newStatus: RoundStatus) => {
    try {
      setIsSubmitting(true);
      if (!currentInterview?.id) return;
      // 本地更新轮次状态
      const newRounds = currentInterview.rounds.map(round =>
        round.id === roundId ? { ...round, status: newStatus } : round
      );
      await updateInterview({
        id: currentInterview.id,
        rounds: newRounds.map(r => ({ id: r.id, scheduledTime: r.scheduledTime, status: r.status }))
      });
      toast.success('轮次状态已更新');
      // 同步本地和全局store
      setCurrentInterview({ ...currentInterview, rounds: newRounds });
    } catch (error) {
      toast.error('轮次状态更新失败');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 如果没有选中的面试，则显示空状态
  if (!currentInterview) {
    return (
      <Paper
        elevation={0}
        sx={{
          height: '100%',
          borderRadius: 2,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 3,
          bgcolor: alpha(theme.palette.primary.main, 0.02),
        }}
      >
        <Typography variant="body1" color="text.secondary">
          请选择面试以查看详情
        </Typography>
      </Paper>
    );
  }

  // 获取面试轮次数量
  const roundCount = currentInterview.rounds?.length || 0;

  return (
    <Paper
      elevation={0}
      sx={{
        height: '100%',
        borderRadius: 2,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
      }}
    >
      {/* 顶部信息区域 */}
      <Box
        sx={{
          px: 4,
          py: 2,
          position: 'relative',
        }}
      >
        {/* 右上角三点菜单 */}
        <IconButton
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: 'text.secondary',
          }}
          onClick={handleMenuOpen}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={menuAnchorEl}
          open={isMenuOpen}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleEdit} sx={{ gap: 1 }}>
            <EditOutlinedIcon sx={{ fontSize: 20 }} />
            编辑
          </MenuItem>
          <MenuItem onClick={handleDelete} sx={{ gap: 1, color: 'error.main' }}>
            <DeleteOutlineIcon sx={{ fontSize: 20, color: 'error.main' }} />
            删除
          </MenuItem>
        </Menu>

        {/* 公司名称和面试轮次 */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h5" fontWeight="medium" sx={{ fontSize: '24px', fontWeight: 600 }}>
            {currentInterview.company}
          </Typography>
          <Chip
            label={`${convertToChinese(roundCount)}面`}
            size="small"
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              height: 24,
              fontWeight: 500,
            }}
          />
        </Stack>
        <Typography variant="body1" sx={{ mt: 0.5, color: 'text.secondary' }}>
          {currentInterview.position}
        </Typography>

        {/* 状态操作tag */}
        <Stack direction="row" spacing={1.5} sx={{ mt: 1 }}>
          {currentInterview.status === InterviewStatus.ONGOING ? (
            <>
              {/* 顺利通过按钮 */}
              <Button
                variant="outlined"
                startIcon={<CheckCircleOutlineIcon />}
                onClick={() => handleStatusUpdate('PASS')}
                disabled={isSubmitting}
                sx={{
                  borderRadius: 4,
                  bgcolor: '#74B6023D',
                  borderColor: alpha(theme.palette.success.main, 0.2),
                  color: theme.palette.success.main,
                  '&:hover': {
                    borderColor: theme.palette.success.main,
                    bgcolor: alpha(theme.palette.success.main, 0.2),
                  },
                  px: 2,
                  py: 0.5,
                }}
              >
                顺利通过
              </Button>

              {/* 遗憾中止按钮 */}
              <Button
                variant="outlined"
                startIcon={<CancelOutlinedIcon />}
                onClick={() => handleStatusUpdate('TERMINATE')}
                disabled={isSubmitting}
                sx={{
                  borderRadius: 4,
                  bgcolor: '#DF2A3F3D',
                  borderColor: alpha(theme.palette.error.main, 0.2),
                  color: theme.palette.error.main,
                  '&:hover': {
                    borderColor: theme.palette.error.main,
                    bgcolor: alpha(theme.palette.error.main, 0.1),
                  },
                  px: 2,
                  py: 0.5,
                }}
              >
                遗憾终止
              </Button>
            </>
          ) : (
            /* 恢复流程按钮 */
            <Button
              variant="outlined"
              onClick={() => handleStatusUpdate('ONGOING')}
              disabled={isSubmitting}
              sx={{
                borderRadius: 4,
                px: 2,
              }}
            >
              恢复流程
            </Button>
          )}
        </Stack>
      </Box>

      <Divider />

      {/* 主体内容区域 */}
      <Box sx={{ flex: 1, overflow: 'auto', px: 4 }}>
        {currentInterview.rounds && currentInterview.rounds.length > 0 ? (
          <Stack sx={{ mt: 2 }}>
            {currentInterview.rounds
              .sort((a, b) => a.roundNumber - b.roundNumber)
              .map((round) => (
                <InterviewRoundCard
                  key={round.id}
                  roundNumber={round.roundNumber}
                  scheduledTime={round.scheduledTime}
                  status={round.status}
                  hasSession={!!round.sessionId}
                  roundId={round.id}
                  sessionId={round.sessionId}
                  interviewId={currentInterview.id}
                  onDelete={() => round.id && handleRoundDelete(round.id)}
                  onStatusChange={(newStatus) => round.id && handleRoundStatusChange(round.id, newStatus)}
                />
              ))}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2, mb: 2 }}>
            暂无面试轮次
          </Typography>
        )}

        {/* 岗位描述 */}
        <Typography
          variant="h6"
          fontWeight="medium"
          gutterBottom
          sx={{ mt: 2, color: '#19B1B6' }}
        >
          岗位描述
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            whiteSpace: 'pre-line',
            mb: 3,
          }}
        >
          {currentInterview.description || '暂无岗位描述'}
        </Typography>
      </Box>

      {/* 底部操作按钮 */}
      <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}`, display: 'flex', justifyContent: 'end', gap: 2 }}>
        {/* 添加轮次按钮 */}
        {currentInterview.status === InterviewStatus.ONGOING && (
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddRound}
          >
            添加轮次
          </Button>
        )}
        {/* 进入面试按钮 */}
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleEnterSession}
          disabled={isSubmitting || currentInterview.status !== InterviewStatus.ONGOING}
          sx={{
            borderRadius: 2,
            py: 1.5,
            textTransform: 'none',
            fontSize: '1rem',
          }}
        >
          {isSubmitting ? '处理中...' : '进入面试'}
        </Button>
      </Box>

      {/* 整体删除确认弹窗 */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>确认删除面试？</DialogTitle>
        <DialogContent>此操作不可恢复，确定要删除该面试及所有轮次吗？</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>取消</Button>
          <Button color="error" onClick={handleConfirmDelete} disabled={isSubmitting}>确认删除</Button>
        </DialogActions>
      </Dialog>
      {/* 轮次删除确认弹窗 */}
      <Dialog open={!!deleteRoundId} onClose={() => setDeleteRoundId(null)}>
        <DialogTitle>确认删除该轮次？</DialogTitle>
        <DialogContent>删除后不可恢复，确定要删除此面试轮次吗？</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteRoundId(null)}>取消</Button>
          <Button color="error" onClick={handleConfirmRoundDelete} disabled={isSubmitting}>确认删除</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}