'use client';

import DateTimePickerDialog from '@/components/date-time-picker-dialog';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddIcon from '@mui/icons-material/Add';
import { Box, Divider, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { FormikProps } from 'formik';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

/**
 * 定义面试轮次类型
 */
interface InterviewRound {
  schedule_date?: string;
  uuid?: string;
}

/**
 * 组件属性接口
 */
interface InterviewTimeSectionProps {
  formik: FormikProps<any>;
}

/**
 * 定义单个面试轮次项的属性接口
 */
interface InterviewRoundItemProps {
  // 当前轮次的索引（从0开始）
  index: number;
  // 当前轮次数据
  round: InterviewRound;
  // 是否为最后一轮，用于决定是否展示添加图标
  isLastRound: boolean;
  // 点击轮次项时的回调
  onRoundClick: (index: number) => void;
  // 点击添加轮次图标时的回调
  onAddRound: (e: React.MouseEvent) => void;
}

/**
 * InterviewRoundItem 组件
 * 用于展示单个面试轮次项，包括时间显示、点击编辑和添加新轮次按钮。
 */
function InterviewRoundItem({
  index,
  round,
  isLastRound,
  onRoundClick,
  onAddRound,
}: InterviewRoundItemProps) {
  // 桌面端适配 - 轮次状态
  const hasReachedMaxRounds = false; // 桌面端演示用，实际应该检查轮次数

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          color: 'text.secondary',
          mb: 1,
          cursor: 'pointer',
        }}
        onClick={() => onRoundClick(index)}
      >
        <AccessTimeIcon sx={{ width: 20, height: 20 }} />
        <Typography
          variant="body1"
          sx={{
            fontSize: 16,
            marginLeft: 1,
            color: round.schedule_date ? 'primary.main' : 'text.secondary',
          }}
        >
          {round.schedule_date
            ? dayjs(round.schedule_date).format('YYYY年MM月DD日 HH:mm')
            : `设置${index > 0 ? `第${index + 1}轮` : ''}面试时间`}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        {isLastRound ? (
          // 只有在未达到最大轮次限制时才显示添加按钮
          !hasReachedMaxRounds ? (
            <AddIcon
              sx={{
                width: 20,
                height: 20,
                cursor: 'pointer',
                color: 'primary.main',
              }}
              onClick={e => {
                // 阻止冒泡以避免触发父级点击事件
                e.stopPropagation();
                onAddRound(e);
              }}
            />
          ) : (
            // 达到限制时显示当前轮次信息
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              第{index + 1}轮面试
            </Typography>
          )
        ) : (
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            第{index + 1}轮面试
          </Typography>
        )}
      </Box>
      <Divider sx={{ mb: 2, mt: 1 }} />
    </Box>
  );
}

/**
 * 面试时间部分组件
 *
 * 用于管理多轮面试时间选择，复用移动端设计
 *
 * @param {InterviewTimeSectionProps} props - 组件属性
 * @returns {JSX.Element} 面试时间部分组件
 */
export default function InterviewTimeSection({ formik }: InterviewTimeSectionProps) {
  /**
   * activeRoundIndex 表示当前正在编辑的面试轮次的索引
   */
  const [activeRoundIndex, setActiveRoundIndex] = useState<number | null>(null);

  /**
   * tempTime 用于临时存储用户在时间选择器中选中的时间
   */
  const [tempTime, setTempTime] = useState<dayjs.Dayjs | null>(null);

  /**
   * 面试轮次列表
   */
  const interviewRounds = formik.values.interview_round_list || [];

  /**
   * 初始化时如果没有面试轮次，则添加一个默认轮次
   */
  useEffect(() => {
    if (!interviewRounds.length) {
      formik.setFieldValue('interview_round_list', [
        {
          schedule_date: dayjs().add(1, 'day').toISOString(),
        },
      ]);
    }
  }, []);

  /**
   * 处理时间选择器的时间变化
   */
  const handleTimeChange = (newTime: dayjs.Dayjs | null) => {
    setTempTime(newTime);
  };

  /**
   * 确认选择的时间
   */
  const handleAccept = () => {
    if (activeRoundIndex !== null && tempTime) {
      const newRounds = [...interviewRounds];
      newRounds[activeRoundIndex] = {
        ...newRounds[activeRoundIndex],
        schedule_date: tempTime.toISOString(),
      };
      formik.setFieldValue('interview_round_list', newRounds);
      setActiveRoundIndex(null);
      setTempTime(null);
    }
  };

  /**
   * 删除当前编辑的面试轮次
   */
  const handleDelete = () => {
    if (activeRoundIndex !== null) {
      const newRounds = interviewRounds.filter(
        (_: InterviewRound, index: number) => index !== activeRoundIndex
      );
      formik.setFieldValue('interview_round_list', newRounds);
      setActiveRoundIndex(null);
      setTempTime(null);
    }
  };

  /**
   * 添加新的面试轮次
   */
  const addNewRound = () => {
    // 检查是否有未设置时间的轮次
    const hasEmptySchedule = interviewRounds.some((round: InterviewRound) => !round.schedule_date);

    if (hasEmptySchedule) {
      toast.error('请先设置已添加轮次的面试时间');
      return;
    }

    // 添加前检查是否达到最大轮次限制
    if (interviewRounds.length >= 3) {
      toast.error('面试轮次数量已达上限');
      return;
    }

    // 添加新轮次，使用当前时间作为默认值
    const newRound = {
      schedule_date: dayjs().add(1, 'day').toISOString(),
    };

    formik.setFieldValue('interview_round_list', [...interviewRounds, newRound]);

    // 立即打开时间选择器，让用户修改默认时间
    setActiveRoundIndex(interviewRounds.length);
    setTempTime(dayjs().add(1, 'day'));
  };

  /**
   * 获取当前时间选择器显示的时间值
   */
  const getActiveTime = () => {
    if (tempTime) {
      return tempTime;
    }

    if (activeRoundIndex !== null && interviewRounds[activeRoundIndex]?.schedule_date) {
      return dayjs(interviewRounds[activeRoundIndex].schedule_date);
    }

    return dayjs();
  };

  /**
   * 获取日期时间选择器的最小可选时间
   * 对于第一轮，不能选择过去的时间；对于后续轮次，不能早于前一轮
   */
  const getMinDateTime = () => {
    const now = dayjs();

    if (activeRoundIndex === 0 || activeRoundIndex === null) {
      return now;
    }

    // 对于后续轮次，不能早于前一轮
    const prevRound = interviewRounds[activeRoundIndex - 1];
    if (prevRound?.schedule_date) {
      const prevTime = dayjs(prevRound.schedule_date);
      return prevTime.isAfter(now) ? prevTime : now;
    }

    return now;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontSize: 18, fontWeight: '700' }}>
          面试时间
        </Typography>
      </Box>

      {/* 面试轮次列表 */}
      <Box>
        {interviewRounds.map((round: InterviewRound, index: number) => (
          <InterviewRoundItem
            key={index}
            index={index}
            round={round}
            isLastRound={index === interviewRounds.length - 1}
            onRoundClick={() => {
              setActiveRoundIndex(index);
              setTempTime(round.schedule_date ? dayjs(round.schedule_date) : null);
            }}
            onAddRound={addNewRound}
          />
        ))}

        {interviewRounds.length === 0 && (
          <InterviewRoundItem
            index={0}
            round={{}}
            isLastRound={true}
            onRoundClick={() => {
              setActiveRoundIndex(0);
              setTempTime(null);
            }}
            onAddRound={addNewRound}
          />
        )}
      </Box>

      {/* 时间选择器对话框 */}
      <DateTimePickerDialog
        open={activeRoundIndex !== null}
        onClose={() => {
          setActiveRoundIndex(null);
          setTempTime(null);
        }}
        onChange={handleTimeChange}
        onAccept={handleAccept}
        onDelete={interviewRounds.length > 1 ? handleDelete : undefined}
        value={getActiveTime()}
      />
    </Box>
  );
}
