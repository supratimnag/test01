"use client";

import { Todo } from "@/types/todo";
import { Input } from "./ui/input";

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  if (todos.length === 0)
    return <p className="text-gray-500 mt-4">No todos yet.</p>;

  return (
    <ul className="mt-4 space-y-2">
      {todos.map((todo) => (
        <li
          key={todo.id}
          className="flex justify-between items-center border rounded p-2"
        >
          <div>
            <Input
              type="checkbox"
              checked={todo.completed}
              onChange={() => onToggle(todo.id)}
              className="mr-2"
            />
            <span
              className={todo.completed ? "line-through text-gray-500" : ""}
            >
              {todo.title}
            </span>
          </div>
          <button
            onClick={() => onDelete(todo.id)}
            className="text-red-600 font-semibold"
          >
            ✕
          </button>
        </li>
      ))}
    </ul>
  );
}
