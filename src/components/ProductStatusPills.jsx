const DEFAULT_STATUSES = {
  isNew: true,
  isOffer: false,
  isBestseller: false,
};

export default function ProductStatusPills({ status = DEFAULT_STATUSES }) {
  const { isNew, isOffer, isBestseller } = status || {};

  const pills = [];
  if (isNew) pills.push({ label: "Nuevo", bg: "#fff0f7", color: "#ff4f9a", border: "#ff4f9a" });
  if (isOffer) pills.push({ label: "Oferta", bg: "#fff7e6", color: "#ff8a00", border: "#ff8a00" });
  if (isBestseller)
    pills.push({ label: "Más vendido", bg: "#f2fff6", color: "#16a34a", border: "#16a34a" });

  return (
    <div className="d-flex flex-wrap gap-2" aria-label="Estado del producto">
      {pills.length === 0 ? (
        <span className="text-muted" style={{ fontSize: 14 }}>
          Estado: -
        </span>
      ) : (
        pills.map((p) => (
          <span
            key={p.label}
            className="px-3 py-2"
            style={{
              background: p.bg,
              color: p.color,
              border: `1px solid ${p.border}`,
              borderRadius: 999,
              fontWeight: 700,
              fontSize: 14,
              whiteSpace: "nowrap",
            }}
          >
            {p.label}
          </span>
        ))
      )}
    </div>
  );
}

