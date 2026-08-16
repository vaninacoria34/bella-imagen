import { useState, useEffect, useCallback } from "react";
import { getSettings, updateSettings } from "../services/settingsService";

/**
 * Hook personalizado que abstrae el acceso a la configuración del negocio.
 *
 * ════════════════════════════════════════════════════════
 *  Expone:
 *    • settings     → objeto de configuración
 *    • loading      → booleano (true mientras carga)
 *    • error        → mensaje de error si ocurre
 *    • refresh      → función para recargar datos manualmente
 *    • saveSettings → fn(data) — actualiza la configuración
 * ════════════════════════════════════════════════════════
 */
export default function useSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSettings();
      setSettings(data);
    } catch (err) {
      setError(err?.message || "Error al cargar la configuración.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const saveSettings = async (data) => {
    const updated = await updateSettings(data);
    setSettings(updated);
    return updated;
  };

  return {
    settings,
    loading,
    error,
    refresh,
    saveSettings,
  };
}
