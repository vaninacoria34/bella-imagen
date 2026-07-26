export default function ProductRating({ value = 4.6, outOf = 5 }) {
  const safeValue = Number(value);
  const safeOut = Number(outOf);
  const rating = Number.isFinite(safeValue) ? safeValue : 0;
  const stars = Number.isFinite(safeOut) && safeOut > 0 ? safeOut : 5;

  const filled = Math.round(rating);

  return (
    <div className="d-flex align-items-center gap-2">
      <div style={{ display: "flex", gap: 2 }} aria-label={`Valoración: ${rating} de ${stars}`}> 
        {Array.from({ length: stars }).map((_, idx) => {
          const isFilled = idx < filled;
          return (
            <span
              key={idx}
              style={{
                fontSize: 18,
                lineHeight: 1,
                color: isFilled ? "#ff4f9a" : "#d8d8d8",
              }}
            >
              ★
            </span>
          );
        })}
      </div>
      <span className="text-muted" style={{ fontSize: 14 }}>
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

