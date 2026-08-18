import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { CartContext } from "../context/CartContext";

const FAVORITES_STORAGE_KEY = "bella_imagen_favorites";

function safeParseArray(raw) {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const DEFAULT_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80";

export default function ProductCard({ id, image, title, price }) {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [isFavorite, setIsFavorite] = useState(() => {
    try {
      const raw = window.localStorage?.getItem(FAVORITES_STORAGE_KEY);
      if (!raw) return false;
      const parsed = safeParseArray(raw);
      return parsed.includes(id);
    } catch {
      return false;
    }
  });

  const favoritesCount = useMemo(() => 0, []);
  void favoritesCount;

  const toggleFavorite = (e) => {
    e?.stopPropagation?.();
    setIsFavorite((prev) => {
      const next = !prev;

      try {
        const raw = window.localStorage?.getItem(FAVORITES_STORAGE_KEY);
        const parsed = safeParseArray(raw);

        const nextArr = next
          ? Array.from(new Set([...parsed, id]))
          : parsed.filter((x) => x !== id);

        if (nextArr.length === 0) {
          window.localStorage?.removeItem(FAVORITES_STORAGE_KEY);
        } else {
          window.localStorage?.setItem(
            FAVORITES_STORAGE_KEY,
            JSON.stringify(nextArr)
          );
        }
      } catch {
        // Si localStorage falla, igual permitimos el toggle visual.
      }

      return next;
    });
  };

  const handleNavigate = () => {
    navigate(`/product/${id}`);
  };

  return (
    <div
      className="card product-card border-0"
      style={{ position: "relative" }}
      role="button"
      tabIndex={0}
      onClick={handleNavigate}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleNavigate();
      }}
    >
      <button
        type="button"
        aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
        onClick={toggleFavorite}
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          zIndex: 2,
          background: "transparent",
          border: "none",
          padding: 0,
          lineHeight: 1,
          cursor: "pointer",
          fontSize: 22,
        }}
      >
        {isFavorite ? "❤️" : "♡"}
      </button>

      <img
        src={image || DEFAULT_FALLBACK_IMAGE}
        alt={title}
        className="card-img-top product-img"
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = DEFAULT_FALLBACK_IMAGE;
        }}
      />

      <div className="card-body text-center py-3">
        <h5 className="fw-semibold">{title}</h5>

        <p className="text-pink fw-bold fs-5">${price}</p>

        <button
          className="btn btn-pink w-100"
          onClick={(e) => {
            e.stopPropagation();
            addToCart({
              id,
              image,
              title,
              price,
            });
          }}
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}



