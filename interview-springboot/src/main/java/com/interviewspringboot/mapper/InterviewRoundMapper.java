package com.interviewspringboot.mapper;

import com.interviewspringboot.pojo.InterviewRound;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * 面试轮次Mapper接口
 */
@Mapper
public interface InterviewRoundMapper {
    
    /**
     * 插入面试轮次记录
     * 
     * @param round 面试轮次对象
     * @return 影响的行数
     */
    @Insert("INSERT INTO interview_round (interview_id, round_number, scheduled_time, status) " +
            "VALUES (#{interviewId}, #{roundNumber}, #{scheduledTime}, #{status})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(InterviewRound round);
    
    /**
     * 根据面试ID查询面试轮次列表
     * 
     * @param interviewId 面试ID
     * @return 面试轮次列表
     */
    @Select("SELECT * FROM interview_round WHERE interview_id = #{interviewId} ORDER BY round_number ASC")
    List<InterviewRound> selectByInterviewId(Long interviewId);
    
    /**
     * 根据ID查询面试轮次
     * 
     * @param id 轮次ID
     * @return 面试轮次对象
     */
    @Select("SELECT * FROM interview_round WHERE id = #{id}")
    InterviewRound selectById(Long id);
    
    /**
     * 获取面试的最大轮次号
     * 
     * @param interviewId 面试ID
     * @return 最大轮次号
     */
    @Select("SELECT MAX(round_number) FROM interview_round WHERE interview_id = #{interviewId}")
    Integer getMaxRoundNumber(Long interviewId);
    
    /**
     * 更新面试轮次信息
     * 
     * @param round 面试轮次对象
     * @return 影响的行数
     */
    @Update("UPDATE interview_round SET scheduled_time = #{scheduledTime}, " +
            "status = #{status}, session_id = #{sessionId}, result = #{result}, notes = #{notes} " +
            "WHERE id = #{id}")
    int update(InterviewRound round);
    
    /**
     * 删除面试轮次
     * 
     * @param id 轮次ID
     * @return 影响的行数
     */
    @Delete("DELETE FROM interview_round WHERE id = #{id}")
    int deleteById(Long id);
    
    /**
     * 根据面试ID删除所有轮次
     * 
     * @param interviewId 面试ID
     * @return 影响的行数
     */
    @Delete("DELETE FROM interview_round WHERE interview_id = #{interviewId}")
    int deleteByInterviewId(Long interviewId);
} 