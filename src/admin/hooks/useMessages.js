import { useState, useEffect, useCallback } from "react";
import {
  getMessages,
  updateMessageStatus,
  deleteMessage,
} from "../services/messageService";

/**
 * Hook personalizado que abstrae el acceso a mensajes.
 *
 * ════════════════════════════════════════════════════════
 *  Expone:
 *    • messages       → array de mensajes
 *    • loading        → booleano (true mientras carga)
 *    • error          → mensaje de error si ocurre
 *    • refresh        → función para recargar datos manualmente
 *    • updateStatus   → fn(id, estado) — cambia el estado del mensaje
 *    • removeMessage  → fn(id) — elimina un mensaje
 * ════════════════════════════════════════════════════════
 */
export default function useMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMessages();
      setMessages(data);
    } catch (err) {
      setError(err?.message || "Error al cargar mensajes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updateStatus = async (id, estado) => {
    await updateMessageStatus(id, estado);
    await refresh();
  };

  const removeMessage = async (id) => {
    await deleteMessage(id);
    await refresh();
  };

  return {
    messages,
    loading,
    error,
    refresh,
    updateStatus,
    removeMessage,
  };
}
