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

export default function Home() {
  const { register, handleSubmit } = useForm<TodoInputs>();
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
                <FormControlLabel control={<Checkbox />} label={todo.title} />
                <div>
                  <IconButton>
                    <Edit />
                  </IconButton>
                  <IconButton>
                    <Delete />
                  </IconButton>
                </div>
              </Stack>
            ))}
          <Button variant="contained" color="error" type="submit" fullWidth>
            ログアウト
          </Button>
        </Stack>
      </Container>
    </div>
  );
}
