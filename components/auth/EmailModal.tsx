"use client";

import { useState } from "react";
import api from "@/lib/api";
import { X, Mail } from "lucide-react";

interface EmailModalProps {
  onClose: () => void;
}

export default function EmailModal({ onClose }: EmailModalProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const sendPasswordResetEmail = async () => {
    try {
      setIsSubmitting(true);
      setError("");

      await api.post("/auth/esqueci-senha", {
        email,
      });

      setSuccess(true);
    } catch (error) {
      console.error(
        "Erro ao enviar e-mail de recuperação de senha:",
        error
      );

      setError(
        "Não foi possível enviar o e-mail. Tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">

        {/* Fechar */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 transition hover:text-gray-600"
        >
          <X size={20} />
        </button>

        {!success ? (
          <>
            {/* Ícone */}
            <div className="mb-4 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 text-white shadow-md">
                <Mail size={24} />
              </div>
            </div>

            <h2 className="text-center text-2xl font-bold text-gray-900">
              Recuperar senha
            </h2>

            <p className="mt-2 text-center text-sm text-gray-500">
              Digite seu e-mail e enviaremos um link para
              redefinir sua senha.
            </p>

            {/* E-mail */}
            <div className="mt-6">
              <input
                type="email"
                placeholder="Endereço de e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-gray-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              />

              {error && (
                <p className="mt-2 text-sm text-red-500">
                  {error}
                </p>
              )}
            </div>

            {/* Enviar */}
            <button
              type="button"
              onClick={sendPasswordResetEmail}
              disabled={isSubmitting || !email}
              className="mt-5 w-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-300 py-3 font-semibold text-white shadow-md transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "Enviando..."
                : "Enviar link de recuperação"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full py-2 text-sm text-gray-500 transition hover:text-gray-700"
            >
              Cancelar
            </button>
          </>
        ) : (
          <>
            <div className="mb-4 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                <Mail size={24} />
              </div>
            </div>

            <h2 className="text-center text-2xl font-bold text-gray-900">
              E-mail enviado!
            </h2>

            <p className="mt-3 text-center text-sm text-gray-500">
              Se o e-mail estiver cadastrado, você receberá
              instruções para redefinir sua senha.
            </p>

            <button
              type="button"
              onClick={onClose}
              className="mt-6 w-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-300 py-3 font-semibold text-white shadow-md transition hover:shadow-lg"
            >
              Fechar
            </button>
          </>
        )}
      </div>
    </div>
  );
}