"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

import {
  CalendarDays,
  LayoutDashboard,
  LogOut,
} from "lucide-react";

interface Admin {
  id: number;
  name: string;
  email: string;
}

export default function DashboardSidebar() {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAdmin = async () => {
      try {
        const response = await api.get<Admin>("/admins/me");

        setAdmin(response.data);
      } catch (error) {
        console.error(
          "Erro ao buscar informações do administrador:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadAdmin();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");

      window.location.href = "/login";
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  // Primeira letra do nome
  const firstLetter =
    admin?.name?.charAt(0).toUpperCase() || "?";

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-gray-200 bg-white">

      {/* Logo */}
      <div className="flex h-20 items-center gap-3 border-b border-gray-100 px-6">

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 text-white shadow-md">
          <CalendarDays size={24} />
        </div>

        <div>
          <h1 className="text-xl font-bold text-gray-900">
            EVENTHUB
          </h1>

          <p className="text-xs text-gray-400">
            Gerenciador de eventos
          </p>
        </div>

      </div>

      {/* Menu */}
      <nav className="flex-1 space-y-2 px-4 py-6">

        <a
          href="/dashboard"
          className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-400 px-4 py-3 text-sm font-medium text-white shadow-sm"
        >
          <LayoutDashboard size={19} />
          Dashboard
        </a>

      </nav>

      {/* Usuário */}
      <div className="border-t border-gray-100 p-4">

        <div className="mb-3 flex items-center gap-3 rounded-xl bg-gray-50 p-3">

          {/* Avatar */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-400 font-semibold text-white">
            {loading ? "..." : firstLetter}
          </div>

          <div className="min-w-0">

            <p className="truncate text-sm font-semibold text-gray-900">
              {loading
                ? "Carregando..."
                : admin?.name || "Administrador"}
            </p>

            <p className="truncate text-xs text-gray-500">
              {loading
                ? "..."
                : admin?.email || ""}
            </p>

          </div>

        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-gray-500 transition hover:bg-red-50 hover:text-red-500"
        >
          <LogOut size={18} />
          Sair
        </button>

      </div>

    </aside>
  );
}

