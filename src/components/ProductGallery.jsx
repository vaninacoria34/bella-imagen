import { useMemo, useState } from "react";

export default function ProductGallery({
  images,
  alt,
  initialIndex = 0,
  style,
}) {
  const normalizedImages = useMemo(() => {
    if (!Array.isArray(images) || images.length === 0) return [];
    return images.filter(Boolean);
  }, [images]);

  const [activeIndex, setActiveIndex] = useState(() => {
    const idx = Number(initialIndex);
    if (Number.isNaN(idx) || idx < 0) return 0;
    if (idx >= normalizedImages.length) return 0;
    return idx;
  });

  if (normalizedImages.length === 0) return null;

  const active = normalizedImages[activeIndex] || normalizedImages[0];

  return (
    <div style={style}>
      <img
        src={active}
        alt={alt}
        className="img-fluid"
        style={{ borderRadius: 12, width: "100%", height: "auto" }}
      />

      {/* Estructura preparada para futuras imágenes */}
      {normalizedImages.length > 1 && (
        <div className="mt-3 d-flex gap-2 flex-wrap">
          {normalizedImages.map((src, idx) => (
            <button
              key={`${src}-${idx}`}
              type="button"
              aria-label={`Ver imagen ${idx + 1}`}
              onClick={() => setActiveIndex(idx)}
              className="border-0 p-0"
              style={{
                background: "transparent",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <img
                src={src}
                alt={alt}
                loading="lazy"
                className=""
                style={{
                  width: 72,
                  height: 72,
                  objectFit: "cover",
                  borderRadius: 10,
                  border:
                    idx === activeIndex ? "2px solid #ff4f9a" : "1px solid #eee",
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

