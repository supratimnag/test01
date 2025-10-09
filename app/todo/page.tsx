"use client";

import TodoForm from "@/components/Todoform";
import TodoList from "@/components/TodoList";
import { Todo } from "@/types/todo";
import { useState, useEffect, useCallback, useMemo } from "react";

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("todos");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleAdd = useCallback((title: string) => {
    const newTodo: Todo = {
      id: Date.now(),
      title,
      completed: false,
    };
    setTodos((prev) => [...prev, newTodo]);
  }, []);

  const handleToggle = useCallback((id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const handleDelete = useCallback((id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  const completedCount = useMemo(
    () => todos.filter((t) => t.completed).length,
    [todos]
  );
  const totalCount = todos.length;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-4">📝 Todo App</h1>

      <TodoForm onAdd={handleAdd} />
      <TodoList todos={todos} onToggle={handleToggle} onDelete={handleDelete} />

      {totalCount > 0 && (
        <p className="text-sm text-gray-600 mt-4 text-center">
          ✅ Completed: {completedCount} / {totalCount}
        </p>
      )}
    </div>
  );
}
