"use client";

import {
  Button,
  Container,
  Stack,
  Checkbox,
  FormControlLabel,
  IconButton,
} from "@mui/material";

import { Delete, Edit } from "@mui/icons-material";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/apiClient";
import { useEffect, useState } from "react";
import { useAuth } from "./contexts/authContext";

export default function Home() {
  const { register, handleSubmit } = useForm<TodoInputs>();
  const { logout } = useAuth();
  const [token, setToken] = useState<string>("");
  const [todos, setTodos] = useState<TodoType[]>([]);
  const router = useRouter();

  type TodoInputs = {
    title: string;
  };

  type TodoType = {
    _id: string;
    title: string;
    userId: string;
    completed: boolean;
  };

  useEffect(() => {
    const _token = localStorage.getItem("token");
    if (!_token) {
      alert("ログインしていません");
      router.push("/login");
    } else {
      setToken(_token);
      getTodos(_token);
    }
  }, []);

  const onSubmit: SubmitHandler<TodoInputs> = async (data) => {
    try {
      await apiClient.post(
        "/todo",
        {
          title: data.title,
        },
        { headers: { Authorization: token } }
      );
      alert("Todoを作成しました");
    } catch (error: any) {
      alert(error.message);
    }
  };

  const getTodos = async (token: string) => {
    try {
      const res = await apiClient.get("/todo", {
        headers: { Authorization: token },
      });
      const _todos = res.data;
      setTodos(_todos);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleEditTodo = async (todoId: string) => {
    try {
      const newTitle = prompt("新しいタイトルを入力してください");
      if (newTitle) {
        await apiClient.put(`/todo/edit/${todoId}`, {
          title: newTitle,
        });
        alert("更新されました");
      }
      getTodos(token); //リロードをかけます。
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleDeleteTodo = async (todoId: string) => {
    try {
      if (window.confirm("本当に削除しますか？")) {
        await apiClient.delete(`/todo/${todoId}`);
        alert("削除されました");
      }
      getTodos(token);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleCompleteTodo = async (todoId: string) => {
    try {
      if (window.confirm("完了しますか？")) {
        await apiClient.put(`/todo/complete/${todoId}`);
        alert("完了しました");
      }
      getTodos(token);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div>
      <Container className="flex items-center justify-center h-screen">
        <Stack className="w-full" spacing={2}>
          <h1 className="text-2xl font-bold mb-2">Todo App</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-2">
              <label
                htmlFor="text"
                className="block text-sm font-medium text-gray-700"
              >
                Todoを追加
              </label>
              <input
                type="text"
                className="block w-full rounded-md border-gray-300 focus:border-indigo-500 p-2 mt-1"
                {...register("title", { required: true })}
              />
            </div>
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Todoを追加
            </Button>
          </form>
          {todos
            .filter((todo) => !todo.completed)
            .map((todo) => (
              <Stack
                className="px-2 flex justify-between border-2 border-black"
                direction="row"
                key={todo._id}
              >
                <FormControlLabel
                  control={<Checkbox />}
                  label={todo.title}
                  onClick={() => handleCompleteTodo(todo._id)}
                />
                <div>
                  <IconButton onClick={() => handleEditTodo(todo._id)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteTodo(todo._id)}>
                    <Delete />
                  </IconButton>
                </div>
              </Stack>
            ))}
          <Button
            variant="contained"
            color="error"
            type="submit"
            fullWidth
            onClick={() => handleLogout()}
          >
            ログアウト
          </Button>
        </Stack>
      </Container>
    </div>
  );
}
