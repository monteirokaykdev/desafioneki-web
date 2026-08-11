"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

import DashboardSidebar from "../../components/dashboard/DashboardSideBar";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import AdminEventsList from "../../components/dashboard/AdminEventsList";

interface Admin {
  id: number;
  name: string;
  email: string;
}

export default function Dashboard() {
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

  return (
    <div className="min-h-screen bg-gray-50">

      <DashboardSidebar />

      <main className="ml-64 min-h-screen">

        <DashboardHeader />

        <div className="space-y-8 p-8">

          <AdminEventsList adminId={admin?.id ?? null} />

        </div>

      </main>

    </div>
  );
}