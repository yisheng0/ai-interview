package com.interviewspringboot.service;

/**
 * 提示词组合器接口
 * 用于组合不同类型的提示词，形成完整的提示词结构
 */
public interface PromptComposer {
    
    /**
     * 添加基础规则提示词
     * @param rule 基础规则内容
     */
    void addBaseRule(String rule);
    
    /**
     * 添加角色定义提示词
     * @param persona 角色定义内容
     */
    void addPersona(String persona);
    
    /**
     * 添加上下文信息提示词
     * @param context 上下文信息内容
     */
    void addContext(String context);
    
    /**
     * 组合所有提示词，生成完整提示词结构
     * @return 组合后的提示词内容
     */
    String compose();
}
