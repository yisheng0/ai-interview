'use client';

import { useState, useEffect } from 'react';
import { writeDailyReport } from '@/app/utils/mcp';
import styles from './todo.module.css';

/**
 * 待办事项接口
 */
interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

/**
 * 待办事项组件
 * 允许用户添加、完成和删除任务，并记录到日报中
 */
export function Todo() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [input, setInput] = useState('');
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  // 当完成任务时记录到日报
  useEffect(() => {
    if (completedTasks.length > 0) {
      writeDailyReport('完成了待办事项任务', completedTasks);
      setCompletedTasks([]);
    }
  }, [completedTasks]);

  /**
   * 添加新的待办事项
   */
  const addTodo = () => {
    if (input.trim()) {
      const newTodo = {
        id: Date.now(),
        text: input.trim(),
        completed: false
      };
      
      setTodos([...todos, newTodo]);
      setInput('');
      
      // 记录添加新任务到日报
      writeDailyReport('添加了新的待办事项', [`添加任务: ${newTodo.text}`]);
    }
  };

  /**
   * 切换待办事项的完成状态
   * @param id 待办事项ID
   */
  const toggleTodo = (id: number) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        const isCompleting = !todo.completed;
        
        // 如果是标记为完成，则添加到完成任务列表
        if (isCompleting) {
          setCompletedTasks(prev => [...prev, `完成任务: ${todo.text}`]);
        }
        
        return { ...todo, completed: isCompleting };
      }
      return todo;
    });
    
    setTodos(updatedTodos);
  };

  /**
   * 删除待办事项
   * @param id 待办事项ID
   */
  const deleteTodo = (id: number) => {
    const todoToDelete = todos.find(todo => todo.id === id);
    if (todoToDelete) {
      setTodos(todos.filter(todo => todo.id !== id));
      
      // 记录删除任务到日报
      writeDailyReport('删除了待办事项', [`删除任务: ${todoToDelete.text}`]);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>待办事项</h1>
      
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="添加新任务..."
          className={styles.input}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        />
        <button onClick={addTodo} className={styles.addButton}>
          添加
        </button>
      </div>
      
      <ul className={styles.todoList}>
        {todos.map(todo => (
          <li key={todo.id} className={styles.todoItem}>
            <div className={styles.todoText}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className={styles.checkbox}
              />
              <span className={todo.completed ? styles.completed : ''}>
                {todo.text}
              </span>
            </div>
            <button 
              onClick={() => deleteTodo(todo.id)}
              className={styles.deleteButton}
            >
              删除
            </button>
          </li>
        ))}
      </ul>
      
      {todos.length > 0 && (
        <div className={styles.summary}>
          总计: {todos.length} | 已完成: {todos.filter(t => t.completed).length}
        </div>
      )}
      
      <div className={styles.reportLink}>
        <a href="/reports">查看日报</a>
      </div>
    </div>
  );
}

export default Todo; 