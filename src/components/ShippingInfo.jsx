export default function ShippingInfo() {
  return (
    <div className="mt-4" style={{ borderTop: "1px solid #eee" }}>
      <h5 className="fw-bold mt-4 mb-3">Información de envío</h5>
      <div className="d-flex flex-column gap-2">
        <div style={{ color: "#ff4f9a", fontWeight: 700 }}>✔ Envíos a todo el país</div>
        <div style={{ color: "#ff4f9a", fontWeight: 700 }}>✔ Andreani</div>
        <div style={{ color: "#ff4f9a", fontWeight: 700 }}>
          ✔ Correo Argentino
        </div>
      </div>
    </div>
  );
}

