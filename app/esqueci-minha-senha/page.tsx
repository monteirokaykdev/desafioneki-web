"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { CalendarDays, Eye, EyeOff, CheckCircle } from "lucide-react";

import api from "@/lib/api";

const schema = yup.object({
  password: yup
    .string()
    .required("A senha é obrigatória"),

  confirmPassword: yup
    .string()
    .required("Confirme sua senha")
    .oneOf([yup.ref("password")], "As senhas não coincidem"),
});

type ResetPasswordFormData = yup.InferType<typeof schema>;

export default function EsqueciMinhaSenha() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setApiError("");

    if (!token) {
      setApiError(
        "O link de recuperação é inválido ou está incompleto."
      );
      return;
    }

    try {
      await api.post("/auth/reset-password", {
        token,
        newPassword: data.password,
      });

      setSuccess(true);

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: any) {
      console.error("Erro ao redefinir senha:", error);

      const message =
        error?.response?.data?.message ||
        "Não foi possível redefinir sua senha. O link pode ter expirado.";

      setApiError(message);
    }
  };

  if (!token) {
    return (
      <div
        className="flex min-h-screen items-center justify-center px-4"
        style={{
          background: `
            radial-gradient(circle at 0% 0%, #93c5fd 0%, transparent 42%),
            radial-gradient(circle at 100% 0%, #bfdbfe 0%, transparent 38%),
            radial-gradient(circle at 100% 100%, #67e8f9 0%, transparent 42%),
            radial-gradient(circle at 0% 100%, #bfdbfe 0%, transparent 38%),
            #ffffff
          `,
        }}
      >
        <div className="w-full max-w-md rounded-2xl bg-white px-8 py-9 shadow-xl">

          <div className="mb-6 text-center">

            <div className="mb-3 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 text-white shadow-md">
                <CalendarDays size={26} strokeWidth={2} />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900">
              EVENTHUB
            </h1>

            <p className="mt-2 text-lg text-gray-600">
              Link inválido
            </p>

          </div>

          <div className="rounded-xl bg-red-50 px-4 py-4 text-center">
            <p className="text-sm text-red-600">
              O link de recuperação de senha é inválido ou
              está incompleto.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/login")}
            className="mt-6 w-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-300 py-3 font-semibold text-white shadow-md transition duration-300 hover:scale-[1.01] hover:shadow-lg"
          >
            Voltar para o login
          </button>

        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div
        className="flex min-h-screen items-center justify-center px-4"
        style={{
          background: `
            radial-gradient(circle at 0% 0%, #93c5fd 0%, transparent 42%),
            radial-gradient(circle at 100% 0%, #bfdbfe 0%, transparent 38%),
            radial-gradient(circle at 100% 100%, #67e8f9 0%, transparent 42%),
            radial-gradient(circle at 0% 100%, #bfdbfe 0%, transparent 38%),
            #ffffff
          `,
        }}
      >
        <div className="w-full max-w-md rounded-2xl bg-white px-8 py-9 shadow-xl">

          <div className="mb-6 text-center">

            <div className="mb-3 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 text-white shadow-md">
                <CheckCircle size={26} strokeWidth={2} />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900">
              EVENTHUB
            </h1>

            <p className="mt-2 text-lg text-gray-600">
              Senha alterada!
            </p>

          </div>

          <div className="rounded-xl bg-green-50 px-4 py-4 text-center">
            <p className="text-sm text-green-600">
              Sua senha foi redefinida com sucesso.
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Você será redirecionado para o login.
            </p>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{
        background: `
          radial-gradient(circle at 0% 0%, #93c5fd 0%, transparent 42%),
          radial-gradient(circle at 100% 0%, #bfdbfe 0%, transparent 38%),
          radial-gradient(circle at 100% 100%, #67e8f9 0%, transparent 42%),
          radial-gradient(circle at 0% 100%, #bfdbfe 0%, transparent 38%),
          #ffffff
        `,
      }}
    >

      <div className="w-full max-w-md rounded-2xl bg-white px-8 py-9 shadow-xl">

        {/* Título */}
        <div className="mb-8 text-center">

          <div className="mb-3 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 text-white shadow-md">
              <CalendarDays size={26} strokeWidth={2} />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900">
            EVENTHUB
          </h1>

          <p className="mt-1 text-lg text-gray-600">
            Redefina sua senha
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Digite sua nova senha abaixo.
          </p>

        </div>

        {/* Formulário */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >

          {/* Nova senha */}
          <div>

            <div className="relative">

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Nova senha"
                {...register("password")}
                disabled={isSubmitting}
                className={`w-full border-0 border-b-2 bg-transparent px-3 py-2 pr-10 text-gray-900 placeholder-gray-400 outline-none transition ${
                  errors.password
                    ? "border-red-500"
                    : "border-gray-200 focus:border-cyan-400"
                }`}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((prev) => !prev)
                }
                aria-label={
                  showPassword
                    ? "Ocultar senha"
                    : "Mostrar senha"
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>

            </div>

            {errors.password && (
              <p className="mt-1 px-3 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}

          </div>

          {/* Confirmar senha */}
          <div>

            <div className="relative">

              <input
                id="confirmPassword"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder="Confirmar nova senha"
                {...register("confirmPassword")}
                disabled={isSubmitting}
                className={`w-full border-0 border-b-2 bg-transparent px-3 py-2 pr-10 text-gray-900 placeholder-gray-400 outline-none transition ${
                  errors.confirmPassword
                    ? "border-red-500"
                    : "border-gray-200 focus:border-cyan-400"
                }`}
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    (prev) => !prev
                  )
                }
                aria-label={
                  showConfirmPassword
                    ? "Ocultar senha"
                    : "Mostrar senha"
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>

            </div>

            {errors.confirmPassword && (
              <p className="mt-1 px-3 text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}

          </div>

          {/* Erro da API */}
          {apiError && (
            <div className="rounded-xl bg-red-50 px-4 py-3">
              <p className="text-center text-sm text-red-600">
                {apiError}
              </p>
            </div>
          )}

          {/* Botão */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-300 py-3 font-semibold text-white shadow-md transition duration-300 hover:scale-[1.01] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? "Redefinindo..."
              : "Redefinir senha"}
          </button>

        </form>

        {/* Rodapé */}
        <div className="mt-6 text-center text-sm text-gray-500">

          <button
            type="button"
            onClick={() => router.push("/login")}
            className="font-medium text-cyan-600 transition hover:text-cyan-700"
          >
            Voltar para o login
          </button>

        </div>

      </div>

    </div>
  );
}

