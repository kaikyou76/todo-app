"use client";

import React, { useState } from "react";
import { Container, Stack, Button, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { SubmitHandler, useForm } from "react-hook-form";
import apiClient from "@/lib/apiClient";
import { useRouter } from "next/navigation";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfimPassword, setShowConfimPassword] = useState(false);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const { register, handleSubmit } = useForm<SignupInputs>();

  const router = useRouter();

  type SignupInputs = {
    email: string;
    password: string;
  };
  const onSubmit: SubmitHandler<SignupInputs> = async (data) => {
    try {
      if (password != confirmPassword) {
        return alert("パスワードが間違っています");
      }
      await apiClient.post("/auth/signup", {
        email: data.email,
        password: data.password,
      });
      alert("サインアップに成功しました");
      router.push("/login");
    } catch (error: any) {
      alert(error.message);
    }
  };
  return (
    <Container className="flex items-center justify-center h-screen">
      <Stack className="w-full" spacing={2}>
        <h1 className="text-2xl font-bold mb-2">サインアップ</h1>
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
                onChange={(e) => setPassword(e.target.value)}
              />
              <IconButton
                className="absolute right-2 top-0"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </div>
          </div>
          <div className="mb-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              確認用パスワード
            </label>
            <div className="relative">
              <input
                type={showConfimPassword ? "text" : "password"}
                className="block w-full rounded-md border-gray-300 focus:border-indigo-500 p-2 mt-1"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <IconButton
                className="absolute right-2 top-0"
                onClick={() => setShowConfimPassword(!showConfimPassword)}
              >
                {showConfimPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </div>
          </div>
          <Button variant="contained" color="primary" type="submit">
            サインアップ
          </Button>
        </form>
      </Stack>
    </Container>
  );
};

export default Signup;
