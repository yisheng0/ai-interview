package com.interviewspringboot.mapper;

import com.interviewspringboot.pojo.Resume;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * 简历Mapper接口
 */
@Mapper
public interface ResumeMapper {
    
    /**
     * 插入简历记录
     * 
     * @param resume 简历对象
     * @return 影响的行数
     */
    @Insert("INSERT INTO resume (user_id, name, phone, email, education, work_experience, skills, " +
            "self_description, resume_file_url) " +
            "VALUES (#{userId}, #{name}, #{phone}, #{email}, #{education}, #{workExperience}, #{skills}, " +
            "#{selfDescription}, #{resumeFileUrl})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Resume resume);
    
    /**
     * 更新简历信息
     * 
     * @param resume 简历对象
     * @return 影响的行数
     */
    @Update("UPDATE resume SET name = #{name}, phone = #{phone}, email = #{email}, " +
            "education = #{education}, work_experience = #{workExperience}, skills = #{skills}, " +
            "self_description = #{selfDescription}, resume_file_url = #{resumeFileUrl} " +
            "WHERE id = #{id} AND user_id = #{userId}")
    int update(Resume resume);
    
    /**
     * 根据ID查询简历
     * 
     * @param id 简历ID
     * @return 简历对象
     */
    @Select("SELECT * FROM resume WHERE id = #{id}")
    Resume selectById(Long id);
    
    /**
     * 根据用户ID查询简历列表
     * 
     * @param userId 用户ID
     * @return 简历列表
     */
    @Select("SELECT * FROM resume WHERE user_id = #{userId} ORDER BY updated_at DESC")
    List<Resume> selectByUserId(Long userId);
    
    /**
     * 根据ID删除简历
     * 
     * @param id 简历ID
     * @param userId 用户ID（确保只删除自己的简历）
     * @return 影响的行数
     */
    @Delete("DELETE FROM resume WHERE id = #{id} AND user_id = #{userId}")
    int deleteById(@Param("id") Long id, @Param("userId") Long userId);
} 