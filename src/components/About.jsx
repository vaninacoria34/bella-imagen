import { useEffect, useState } from "react";
import { getSettings } from "../admin/services/settingsService";

export default function About() {
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

  const acercaDe =
    settings?.acercaDe ||
    "Maquillaje, perfumes y accesorios diseñados para resaltar tu esencia.";

  return (
    <section
      className="about-section py-5"
      id="about"
    >
      <div className="container">
        <div className="row align-items-center g-5">
          {/* IMAGEN */}
          <div className="col-lg-6">
            <img
              src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80"
              alt="Belleza femenina"
              className="about-image"
              loading="lazy"
              decoding="async"
            />
          </div>

          {/* TEXTO */}
          <div className="col-lg-6">
            <span className="about-mini">
              NOSOTRAS
            </span>

            <h2 className="about-title">
              Creemos en el amor propio ✨
            </h2>

            <p className="about-text">
              {acercaDe}
            </p>

            <p className="about-text">
              Creemos que maquillarse,
              cuidarse y mimarse no es un lujo,
              sino una forma de amor propio 💖
            </p>

            <p className="about-text">
              Queremos acompañarte con productos
              que te hagan sentir segura,
              auténtica y brillante todos los días.
            </p>

            <a
              href="#products"
              className="btn btn-pink mt-3"
            >
              Descubrir productos ✨
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
