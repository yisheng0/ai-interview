package com.interviewspringboot.service.impl;

import com.interviewspringboot.service.PromptComposer;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 提示词组合器实现类
 * 用于组合不同类型的提示词，形成完整的提示词结构
 */
@Service
public class PromptComposerImpl implements PromptComposer {
    
    /**
     * 提示词类型枚举
     */
    private enum PromptType {
        BASE_RULE,       // 基础规则
        PERSONA,         // 角色定义
        CONTEXT          // 上下文信息
    }
    
    /**
     * 按类型存储提示词
     */
    private final Map<PromptType, List<String>> promptMap = new HashMap<>();
    
    /**
     * 构造函数，初始化各类型容器
     */
    public PromptComposerImpl() {
        // 初始化各类型容器
        for (PromptType type : PromptType.values()) {
            promptMap.put(type, new ArrayList<>());
        }
    }
    
    /**
     * 添加基础规则提示词
     * @param rule 基础规则内容
     */
    @Override
    public void addBaseRule(String rule) {
        promptMap.get(PromptType.BASE_RULE).add(rule);
    }
    
    /**
     * 添加角色定义提示词
     * @param persona 角色定义内容
     */
    @Override
    public void addPersona(String persona) {
        promptMap.get(PromptType.PERSONA).add(persona);
    }
    
    /**
     * 添加上下文信息提示词
     * @param context 上下文信息内容
     */
    @Override
    public void addContext(String context) {
        promptMap.get(PromptType.CONTEXT).add(context);
    }
    
    /**
     * 组合所有提示词，生成完整提示词结构
     * @return 组合后的提示词内容
     */
    @Override
    public String compose() {
        StringBuilder result = new StringBuilder();
        
        // 添加基础规则
        appendSection(result, PromptType.BASE_RULE, null);
        
        // 添加角色定义
        appendSection(result, PromptType.PERSONA, "角色定义");
        
        // 添加上下文信息
        appendSection(result, PromptType.CONTEXT, "上下文信息");
        
        return result.toString();
    }
    
    /**
     * 辅助方法：添加某类型的所有提示词
     * @param sb 字符串构建器
     * @param type 提示词类型
     * @param sectionTitle 章节标题
     */
    private void appendSection(StringBuilder sb, PromptType type, String sectionTitle) {
        List<String> prompts = promptMap.get(type);
        
        if (prompts.isEmpty()) {
            return;
        }
        
        // 添加分隔符
        if (sb.length() > 0) {
            sb.append("\n\n");
        }
        
        // 添加标题（基础规则除外）
        if (sectionTitle != null) {
            sb.append("## ").append(sectionTitle).append("\n\n");
        }
        
        // 添加内容
        for (int i = 0; i < prompts.size(); i++) {
            if (i > 0) sb.append("\n\n");
            sb.append(prompts.get(i));
        }
    }
} 