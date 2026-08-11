"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock,
  MapPin,
  Image as ImageIcon,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import api from "@/lib/api";

interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  hasImage: boolean;
}

interface EventWithImage extends Event {
  imageUrl?: string;
}

interface AdminEventsListProps {
  adminId: number | null;
}

// Converte um ISO date-time ("2026-08-13T12:12:00") pro formato que o
// input datetime-local espera ("2026-08-13T12:12")
function toDatetimeLocalValue(date: string) {
  const d = new Date(date);
  const pad = (n: number) => String(n).padStart(2, "0");

  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export default function AdminEventsList({
  adminId,
}: AdminEventsListProps) {
  const [events, setEvents] = useState<EventWithImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<EventWithImage | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadEvents = async () => {
    if (!adminId) return;

    try {
      setLoading(true);

      const response = await api.get<Event[]>(`/events/admin/${adminId}`);
      const eventsData = response.data;

      const eventsWithImages = await Promise.all(
        eventsData.map(async (event) => {
          if (!event.hasImage) {
            return event;
          }

          try {
            const imageResponse = await api.get(`/events/${event.id}/image`, {
              responseType: "blob",
            });

            return {
              ...event,
              imageUrl: URL.createObjectURL(imageResponse.data),
            };
          } catch (error) {
            console.error(`Erro ao carregar imagem do evento ${event.id}:`, error);
            return event;
          }
        })
      );

      setEvents(eventsWithImages);
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [adminId]);

  const formatDate = (date: string) => {
    const eventDate = new Date(date);
    return eventDate.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (date: string) => {
    const eventDate = new Date(date);
    return eventDate.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const openEditModal = (event: EventWithImage, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingEvent(event);
    setEditDate(toDatetimeLocalValue(event.date));
    setEditLocation(event.location);
  };

  const closeEditModal = () => {
    setEditingEvent(null);
    setEditDate("");
    setEditLocation("");
  };

  const handleSaveEdit = async () => {
    if (!editingEvent) return;

    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("date", editDate);
      formData.append("location", editLocation);

      await api.put(`/events/${editingEvent.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === editingEvent.id
            ? { ...ev, date: new Date(editDate).toISOString(), location: editLocation }
            : ev
        )
      );

      closeEditModal();
    } catch (error) {
      console.error("Erro ao atualizar evento:", error);
      alert("Não foi possível atualizar o evento. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (event: EventWithImage, e: React.MouseEvent) => {
    e.stopPropagation();

    const confirmed = window.confirm(
      `Tem certeza que deseja excluir "${event.name}"? Essa ação não pode ser desfeita.`
    );
    if (!confirmed) return;

    try {
      setDeletingId(event.id);
      await api.delete(`/events/${event.id}`);

      setEvents((prev) => prev.filter((ev) => ev.id !== event.id));

      if (event.imageUrl) {
        URL.revokeObjectURL(event.imageUrl);
      }
    } catch (error) {
      console.error("Erro ao excluir evento:", error);
      alert("Não foi possível excluir o evento. Tente novamente.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="overflow-hidden">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Eventos cadastrados</h2>
          <p className="mt-1 text-sm text-gray-500">
            Lista dos eventos cadastrados pelo administrador
          </p>
        </div>
      </div>

      {/* Grade de cards */}
      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <p className="text-sm text-gray-400">Carregando eventos...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 px-6 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
            <CalendarDays size={22} />
          </div>
          <p className="font-medium text-gray-700">Nenhum evento cadastrado</p>
          <p className="mt-1 text-sm text-gray-400">
            Clique em "Novo evento" para cadastrar o primeiro.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="group relative cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Botões de ação — aparecem no hover */}
              <div className="absolute right-3 top-3 z-10 flex gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <button
                  onClick={(e) => openEditModal(event, e)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-gray-600 shadow-sm backdrop-blur transition hover:bg-blue-600 hover:text-white"
                  aria-label="Editar evento"
                >
                  <Pencil size={15} />
                </button>

                <button
                  onClick={(e) => handleDelete(event, e)}
                  disabled={deletingId === event.id}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-gray-600 shadow-sm backdrop-blur transition hover:bg-red-600 hover:text-white disabled:opacity-50"
                  aria-label="Excluir evento"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              {/* Imagem */}
              <div className="h-40 w-full overflow-hidden bg-gray-100">
                {event.imageUrl ? (
                  <img
                    src={event.imageUrl}
                    alt={event.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-400">
                    <ImageIcon size={32} />
                  </div>
                )}
              </div>

              {/* Informações */}
              <div className="p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <CalendarDays size={16} />
                </div>

                <h3 className="mt-3 truncate text-base font-semibold text-gray-900">
                  {event.name}
                </h3>

                <div className="mt-3 space-y-1.5 border-t border-gray-100 pt-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <CalendarDays size={14} />
                    <span>{formatDate(event.date)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock size={14} />
                    <span>{formatTime(event.date)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin size={14} />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de edição (data e localização) */}
      {editingEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={closeEditModal}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Editar evento</h3>
              <button
                onClick={closeEditModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <p className="mb-4 truncate text-sm text-gray-500">
              {editingEvent.name}
            </p>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Data e hora
                </label>
                <input
                  type="datetime-local"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Localização
                </label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={closeEditModal}
                className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={saving}
                className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                {saving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}