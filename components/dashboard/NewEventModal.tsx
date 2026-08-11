"use client";

import { useState } from "react";
import { X, ImagePlus, CalendarDays } from "lucide-react";
import api from "@/lib/api";

interface AddEventModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function NewEventModal({
  onClose,
  onSuccess,
}: AddEventModalProps) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!name || !date || !location) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", name);
      formData.append("date", date);
      formData.append("location", location);

      if (image) {
        formData.append("image", image);
      }

      await api.post("/events", formData);

      onSuccess?.();
      onClose();

    } catch (error) {
      console.error("Erro ao criar evento:", error);

      setError(
        "Não foi possível criar o evento. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 text-white shadow-md">
              <CalendarDays size={22} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Novo evento
              </h2>

              <p className="text-sm text-gray-500">
                Cadastre um novo evento
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={20} />
          </button>

        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Nome */}
          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Nome do evento
            </label>

            <input
              id="name"
              type="text"
              placeholder="Ex: Workshop de Tecnologia"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
            />
          </div>

          {/* Data */}
          <div>
            <label
              htmlFor="date"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Data e hora
            </label>

            <input
              id="date"
              type="datetime-local"
              value={date}
              onChange={(event) =>
                setDate(event.target.value)
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
            />
          </div>

          {/* Localização */}
          <div>
            <label
              htmlFor="location"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Localização
            </label>

            <input
              id="location"
              type="text"
              placeholder="Ex: Centro de Petrópolis"
              value={location}
              onChange={(event) =>
                setLocation(event.target.value)
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
            />
          </div>

          {/* Imagem */}
          <div>
            <label
              htmlFor="image"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Imagem
            </label>

            <label
              htmlFor="image"
              className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 px-6 py-8 transition hover:border-cyan-400 hover:bg-cyan-50/30"
            >
              <ImagePlus
                size={30}
                className="mb-2 text-gray-400"
              />

              {image ? (
                <p className="text-sm font-medium text-gray-700">
                  {image.name}
                </p>
              ) : (
                <>
                  <p className="text-sm font-medium text-gray-600">
                    Clique para selecionar uma imagem
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    PNG, JPG ou JPEG
                  </p>
                </>
              )}

              <input
                id="image"
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                className="hidden"
                onChange={(event) => {
                  const file =
                    event.target.files?.[0] || null;

                  setImage(file);
                }}
              />
            </label>
          </div>

          {/* Erro */}
          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-3 pt-2">

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-400 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Salvando..."
                : "Salvar evento"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}
