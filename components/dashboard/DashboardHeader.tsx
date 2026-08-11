"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import NewEventModal from "@/components/dashboard/NewEventModal";

export default function DashboardHeader() {
  const [showEventModal, setShowEventModal] = useState(false);

  return (
    <header className="flex h-20 items-center justify-between border-b border-gray-200 bg-white px-8">

      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Dashboard
        </h2>

        <p className="text-sm text-gray-500">
          Visão geral dos seus eventos
        </p>
      </div>

        <button
        type="button"
        onClick={() => setShowEventModal(true)}
        className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-400 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-[1.01] hover:shadow-lg"
        >
        + Novo evento
        </button>

    {showEventModal && (
    <NewEventModal
        onClose={() => setShowEventModal(false)}
        onSuccess={() => {
        console.log("Evento criado!");
        }}
    />
    )}
    </header>
  );
}

