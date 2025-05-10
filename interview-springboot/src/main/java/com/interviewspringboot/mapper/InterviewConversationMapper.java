package com.interviewspringboot.mapper;

import com.interviewspringboot.pojo.InterviewConversation;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * 面试对话数据库操作接口
 */
@Mapper
public interface InterviewConversationMapper {
    
    /**
     * 保存对话记录
     * 
     * @param conversation 对话记录
     * @return 影响的行数
     */
    @Insert("INSERT INTO interview_conversation (interview_id, round_id, session_id, conversation_text) " +
            "VALUES (#{interviewId}, #{roundId}, #{sessionId}, #{conversationText})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int save(InterviewConversation conversation);
    
    /**
     * 根据会话ID查询对话记录
     * 
     * @param sessionId 会话ID
     * @return 对话记录
     */
    @Select("SELECT * FROM interview_conversation WHERE session_id = #{sessionId}")
    InterviewConversation selectBySessionId(String sessionId);
    
    /**
     * 根据面试轮次ID查询对话记录
     * 
     * @param roundId 面试轮次ID
     * @return 对话记录
     */
    @Select("SELECT * FROM interview_conversation WHERE round_id = #{roundId}")
    InterviewConversation selectByRoundId(Long roundId);
    
    /**
     * 更新对话内容
     * 
     * @param conversation 对话记录
     * @return 影响的行数
     */
    @Update("UPDATE interview_conversation SET conversation_text = #{conversationText} " +
            "WHERE session_id = #{sessionId}")
    int updateConversation(InterviewConversation conversation);
    
    /**
     * 根据面试轮次ID删除对话记录
     * @param roundId 面试轮次ID
     * @return 影响的行数
     */
    @Delete("DELETE FROM interview_conversation WHERE round_id = #{roundId}")
    int deleteByRoundId(Long roundId);
} 