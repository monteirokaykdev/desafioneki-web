"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { CalendarDays, Eye, EyeOff } from "lucide-react";
import EmailModal from "./EmailModal";
import { useRouter } from "next/navigation";

const schema = yup.object({
  name: yup.string().when("$isLoginMode", {
    is: false,
    then: (schema) =>
      schema
        .required("O nome é obrigatório")
        .min(3, "O nome deve ter pelo menos 3 caracteres"),
    otherwise: (schema) => schema.notRequired(),
  }),

  email: yup
    .string()
    .email("Digite um e-mail válido")
    .required("O e-mail é obrigatório"),

  password: yup
    .string()
    .required("A senha é obrigatória"),

  confirmPassword: yup.string().when("$isLoginMode", {
    is: false,
    then: (schema) =>
      schema
        .required("Confirme sua senha")
        .oneOf([yup.ref("password")], "As senhas não coincidem"),
    otherwise: (schema) => schema.notRequired(),
  }),

  remember: yup.boolean().default(false),
});

type AuthFormData = yup.InferType<typeof schema>;

export default function AuthForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormData>({
    resolver: yupResolver(schema),
    context: {
      isLoginMode,
    },
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      remember: false,
    },
  });

  const onSubmit = async (data: AuthFormData) => {
    try {
      if (isLoginMode) {
        // LOGIN

        const response = await api.post("/auth/login", {
          email: data.email,
          password: data.password,
          remember: data.remember,
        });

        console.log("Login realizado:", response.data);

        router.push("/dashboard");
      } else {
        // CADASTRO

        const response = await api.post("/admins", {
          name: data.name,
          email: data.email,
          password: data.password,
        });

        console.log("Cadastro realizado:", response.data);

        setSuccessMessage("Cadastro realizado com sucesso!");


        setTimeout(() => {
          setSuccessMessage("");
          setIsLoginMode(true);
        }, 3000);
      }
    } catch (error) {
      console.error(
        isLoginMode
          ? "Erro ao fazer login:"
          : "Erro ao fazer cadastro:",
        error
      );
    }
  };

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
        <div className="mb-6 text-center">
          <div className="mb-3 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 text-white shadow-md">
              <CalendarDays size={26} strokeWidth={2} />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900">
            EVENTHUB
          </h1>

          <p className="text-lg text-gray-600">
            Gerencie seus eventos em um só lugar
          </p>
        </div>

        {/* Toggle Login / Cadastro */}
        <div className="relative mb-8 flex h-12 overflow-hidden rounded-full border border-gray-200">

          {/* Fundo animado */}
          <div
            className={`absolute top-0 h-full w-1/2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-300 transition-transform duration-500 ease-in-out ${
              isLoginMode
                ? "translate-x-0"
                : "translate-x-full"
            }`}
          />

          <button
            type="button"
            onClick={() => {
              setIsLoginMode(true);
              setSuccessMessage("");
            }}
            className={`relative z-10 w-1/2 font-medium transition-colors duration-300 ${
              isLoginMode
                ? "text-white"
                : "text-gray-800"
            }`}
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => {
              setIsLoginMode(false);
              setSuccessMessage("");
            }}
            className={`relative z-10 w-1/2 font-medium transition-colors duration-300 ${
              !isLoginMode
                ? "text-white"
                : "text-gray-800"
            }`}
          >
            Cadastro
          </button>
        </div>

        {successMessage && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-center text-sm font-medium text-green-600">
            {successMessage}
          </div>
        )}

        {/* Formulário */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >

          {!isLoginMode && (
            <div>
              <input
                id="name"
                type="text"
                placeholder="Nome completo"
                {...register("name")}
                className={`w-full border-0 border-b-2 bg-transparent px-3 py-2 text-gray-900 placeholder-gray-400 outline-none transition ${
                  errors.name
                    ? "border-red-500"
                    : "border-gray-200 focus:border-cyan-400"
                }`}
              />

              {errors.name && (
                <p className="mt-1 px-3 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>
          )}

          {/* E-mail */}
          <div>
            <input
              id="email"
              type="email"
              placeholder="Endereço de e-mail"
              {...register("email")}
              className={`w-full border-0 border-b-2 bg-transparent px-3 py-2 text-gray-900 placeholder-gray-400 outline-none transition ${
                errors.email
                  ? "border-red-500"
                  : "border-gray-200 focus:border-cyan-400"
              }`}
            />

            {errors.email && (
              <p className="mt-1 px-3 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Senha */}
          <div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                {...register("password")}
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

          {/* Confirmar senha - apenas cadastro */}
          {!isLoginMode && (
            <div>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirmar senha"
                  {...register("confirmPassword")}
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
          )}

          {/* Lembrar / Esqueci senha */}
          {isLoginMode && (
            <div className="flex items-center justify-between px-3">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-500">
                <input
                  type="checkbox"
                  {...register("remember")}
                  className="h-4 w-4 accent-cyan-400"
                />

                Lembrar de mim
              </label>

              <button
                type="button"
                onClick={() => setShowEmailModal(true)}
                className="text-sm text-cyan-600 transition hover:text-cyan-700"
              >
                Esqueci minha senha
              </button>
            </div>
          )}

          {/* Botão */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-300 py-3 font-semibold text-white shadow-md transition duration-300 hover:scale-[1.01] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? isLoginMode
                ? "Entrando..."
                : "Cadastrando..."
              : isLoginMode
                ? "Entrar"
                : "Criar conta"}
          </button>
        </form>

        {/* Rodapé */}
        <div className="mt-6 text-center text-sm text-gray-500">
          {isLoginMode ? (
            <>
              Ainda não possui uma conta?{" "}

              <button
                type="button"
                onClick={() => {
                  setIsLoginMode(false);
                  setSuccessMessage("");
                }}
                className="font-medium text-cyan-600 transition hover:text-cyan-700"
              >
                Cadastre-se
              </button>
            </>
          ) : (
            <>
              Já possui uma conta?{" "}

              <button
                type="button"
                onClick={() => {
                  setIsLoginMode(true);
                  setSuccessMessage("");
                }}
                className="font-medium text-cyan-600 transition hover:text-cyan-700"
              >
                Fazer login
              </button>
            </>
          )}
        </div>
      </div>

      {showEmailModal && (
        <EmailModal
          onClose={() => setShowEmailModal(false)}
        />
      )}
    </div>
  );
}