import { useEffect, useState } from "react";
import { getSettings } from "../admin/services/settingsService";

export default function TopBar() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getSettings()
      .then((data) => {
        if (!cancelled) setSettings(data);
      })
      .catch(() => {
        if (!cancelled) setSettings(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const compraMinima = settings?.compraMinima ?? 15000;
  const envioGratisDesde = settings?.envioGratisDesde ?? 50000;

  return (
    <div className="topbar">
      <div className="container">
        <p>
          🛍 Compra mínima ${compraMinima.toLocaleString("es-AR")}
          <span className="mx-2">|</span>
          🚚 Envíos gratis desde ${envioGratisDesde.toLocaleString("es-AR")}
        </p>
      </div>
    </div>
  );
}
