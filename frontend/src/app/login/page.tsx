"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Container, Stack, Button, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { SubmitHandler, useForm } from "react-hook-form";
import apiClient from "@/lib/apiClient";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/authContext";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit } = useForm<LoginInputs>();
  const router = useRouter();
  const { login } = useAuth();
  useEffect(() => {
    setShowPassword(false); // クライアントサイドで確実に初期化
  }, []);
  type LoginInputs = {
    email: string;
    password: string;
  };
  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    try {
      const res = await apiClient.post("/auth/login", {
        email: data.email,
        password: data.password,
      });
      //console.log(res);
      const token = res.data.token;
      login(token);
      alert("ログインに成功しました");
      router.push("/");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <Container className="flex items-center justify-center h-screen">
      <Stack className="w-full" spacing={2}>
        <h1 className="text-2xl font-bold mb-2">ログイン</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              メールアドレス
            </label>
            <input
              type="email"
              className="block w-full rounded-md border-gray-300 focus:border-indigo-500 p-2 mt-1"
              {...register("email", { required: true })}
            />
          </div>
          <div className="mb-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              パスワード
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="block w-full rounded-md border-gray-300 focus:border-indigo-500 p-2 mt-1"
                {...register("password", { required: true })}
              />
              <IconButton
                className="absolute right-2 top-0"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </div>
          </div>
          <Button variant="contained" color="primary" type="submit">
            ログイン
          </Button>
          <Link href="/signup" className="ml-6">
            <Button variant="outlined" color="secondary">
              サインアップ
            </Button>
          </Link>
        </form>
      </Stack>
    </Container>
  );
};

export default Login;
