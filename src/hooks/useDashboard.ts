import { useCallback, useEffect, useState } from "react";

import { getDashboardData } from "../services/dashboardService";
import { getFirebaseErrorMessage } from "../utils/firebaseError";

import type { DashboardData } from "../types/dashboard";

interface UseDashboardReturn {
  dashboard: DashboardData | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useDashboard(): UseDashboardReturn {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getDashboardData();

      setDashboard(data);

      setError(null);
    } catch (err) {
      console.error(err);

      setError(getFirebaseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  return {
    dashboard,
    loading,
    error,
    refresh: loadDashboard,
  };
}