import { useState, useMemo } from "react";

/**
 * CustomerTable
 * ─────────────────────────────────────────────────
 * Tabla responsive de clientes con búsqueda/filtro.
 *
 * Props:
 *   customers  → array de clientes
 *   loading    → booleano (muestra spinner)
 *   error      → string (muestra alerta)
 *   onEdit     → fn(customer)
 *   onDelete   → fn(customer)
 *   onDetail   → fn(customer)
 *   onToggleEstado → fn(customer)
 */

const EstadoBadge = ({ estado }) => {
  const isActive = estado === "Activo";
  return (
    <span
      className="badge rounded-pill"
      style={{
        background: isActive ? "#e8f5e9" : "#e9d8a6",
        color: isActive ? "#2e7d32" : "#c62828",
        fontSize: 12,
        fontWeight: 600,
        padding: "6px 14px",
      }}
    >
      {isActive ? "● Activo" : "○ Inactivo"}
    </span>
  );
};

export default function CustomerTable({
  customers,
  loading,
  error,
  onEdit,
  onDelete,
  onDetail,
  onToggleEstado,
}) {
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("Todos");

  const filtered = useMemo(() => {
    let result = customers;

    // Filtro por estado
    if (filterEstado !== "Todos") {
      result = result.filter((c) => c.estado === filterEstado);
    }

    // Filtro por búsqueda
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.nombre.toLowerCase().includes(q) ||
          c.apellido.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.whatsapp.toLowerCase().includes(q)
      );
    }

    return result;
  }, [customers, search, filterEstado]);

  // ── Estado vacío ─────────────────────────────────
  if (!loading && !error && filtered.length === 0) {
    return (
      <section>
        {/* Buscador + Filtros */}
        <div className="d-flex flex-wrap gap-2 mb-3">
          <div style={{ maxWidth: 360, flex: 1 }}>
            <div className="input-group">
              <span
                className="input-group-text"
                style={{
                  background: "#e9d8a6",
                  border: "none",
                  borderRadius: "12px 0 0 12px",
                  color: "#ee9b00",
                }}
              >
                🔍
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar por nombre, apellido, email o whatsapp..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  background: "#e9d8a6",
                  border: "none",
                  borderRadius: "0 12px 12px 0",
                  padding: "12px 16px",
                  fontSize: 14,
                }}
              />
            </div>
          </div>
          <select
            className="form-select"
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            style={{
              width: "auto",
              borderRadius: 12,
              padding: "10px 14px",
              fontSize: 14,
              border: "1px solid #e0e0e0",
              background: "#fff",
            }}
          >
            <option value="Todos">Todos los estados</option>
            <option value="Activo">Activos</option>
            <option value="Inactivo">Inactivos</option>
          </select>
        </div>

        <div className="text-center py-5 text-muted">
          <div style={{ fontSize: 48, marginBottom: 12 }}>👤</div>
          <p className="fw-semibold mb-1">
            {search.trim() || filterEstado !== "Todos"
              ? "No se encontraron clientes con ese filtro."
              : "No hay clientes para mostrar."}
          </p>
          <p className="mb-3" style={{ fontSize: 14 }}>
            {search.trim() || filterEstado !== "Todos"
              ? "Intentá con otros términos o filtros."
              : "Agregá tu primer cliente para comenzar."}
          </p>
          <div className="d-flex justify-content-center gap-2">
            {(search.trim() || filterEstado !== "Todos") && (
              <button
                type="button"
                className="btn btn-sm"
                style={{
                  background: "#e9d8a6",
                  color: "#ee9b00",
                  borderRadius: 8,
                  border: "none",
                  padding: "8px 18px",
                }}
                onClick={() => {
                  setSearch("");
                  setFilterEstado("Todos");
                }}
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      {/* Buscador + Filtros */}
      <div className="d-flex flex-wrap gap-2 mb-3">
        <div style={{ maxWidth: 360, flex: 1 }}>
          <div className="input-group">
            <span
              className="input-group-text"
              style={{
                background: "#e9d8a6",
                border: "none",
                borderRadius: "12px 0 0 12px",
                color: "#ee9b00",
              }}
            >
              🔍
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por nombre, apellido, email o whatsapp..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                background: "#e9d8a6",
                border: "none",
                borderRadius: "0 12px 12px 0",
                padding: "12px 16px",
                fontSize: 14,
              }}
            />
          </div>
        </div>
        <select
          className="form-select"
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}
          style={{
            width: "auto",
            borderRadius: 12,
            padding: "10px 14px",
            fontSize: 14,
            border: "1px solid #e0e0e0",
            background: "#fff",
          }}
        >
          <option value="Todos">Todos los estados</option>
          <option value="Activo">Activos</option>
          <option value="Inactivo">Inactivos</option>
        </select>
      </div>

      {/* Loading */}
      {loading && (
        <div className="d-flex align-items-center gap-2 py-4 text-muted">
          <div
            className="spinner-border spinner-border-sm"
            role="status"
            style={{ color: "#ee9b00" }}
          />
          <span>Cargando clientes…</span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          className="alert alert-danger d-flex align-items-center gap-2 py-2"
          role="alert"
          style={{ borderRadius: 12, fontSize: 14 }}
        >
          <span>⚠️</span> {error}
        </div>
      )}

      {/* Contador */}
      {!loading && !error && (
        <div
          className="d-flex align-items-center gap-2 mb-3 px-3 py-2"
          style={{
            background: "#e9d8a6",
            borderRadius: 12,
            fontSize: 14,
            color: "#333",
          }}
        >
          <span style={{ fontSize: 18 }}>👥</span>
          <span className="fw-semibold">
            Total de clientes:{" "}
            <span style={{ color: "#ee9b00" }}>{customers.length}</span>
          </span>
          {(search.trim() || filterEstado !== "Todos") && (
            <span className="text-muted" style={{ fontSize: 13 }}>
              (filtrados: {filtered.length})
            </span>
          )}
        </div>
      )}

      {/* Tabla — desktop */}
      {!loading && !error && (
        <div className="d-none d-md-block">
          <div
            className="table-responsive"
            style={{ borderRadius: 16, overflow: "hidden" }}
          >
            <table
              className="table align-middle mb-0"
              style={{ background: "#fff", fontSize: 14 }}
            >
              <thead>
                <tr style={{ background: "#e9d8a6", color: "#333" }}>
                  <th style={{ padding: "14px 16px", fontWeight: 600 }}>Cliente</th>
                  <th style={{ padding: "14px 16px", fontWeight: 600 }}>Email</th>
                  <th style={{ padding: "14px 16px", fontWeight: 600 }}>WhatsApp</th>
                  <th style={{ padding: "14px 16px", fontWeight: 600 }} className="text-center">Pedidos</th>
                  <th style={{ padding: "14px 16px", fontWeight: 600 }} className="text-end">Total Comprado</th>
                  <th style={{ padding: "14px 16px", fontWeight: 600 }}>Estado</th>
                  <th style={{ padding: "14px 16px", fontWeight: 600 }} className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((customer) => (
                  <tr
                    key={customer.id}
                    style={{
                      borderBottom: "1px solid #f5f5f5",
                      transition: "background 0.2s",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#e9d8a6")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                    onClick={() => onDetail?.(customer)}
                  >
                    <td style={{ padding: "12px 16px" }}>
                      <div className="fw-semibold">
                        {customer.nombre} {customer.apellido}
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontSize: 13, color: "#555" }}>
                        {customer.email}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontSize: 13 }}>{customer.whatsapp}</span>
                    </td>
                    <td style={{ padding: "12px 16px" }} className="text-center">
                      <span className="fw-semibold">{customer.cantidadPedidos}</span>
                    </td>
                    <td style={{ padding: "12px 16px" }} className="text-end fw-semibold">
                      $ {customer.totalComprado.toLocaleString("es-AR")}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <EstadoBadge estado={customer.estado} />
                    </td>
                    <td style={{ padding: "12px 16px" }} className="text-center">
                      <div className="d-flex gap-1 justify-content-center">
                        {/* Activar / Desactivar */}
                        <button
                          type="button"
                          className="btn btn-sm d-inline-flex align-items-center gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleEstado?.(customer);
                          }}
                          title={
                            customer.estado === "Activo"
                              ? "Desactivar cliente"
                              : "Activar cliente"
                          }
                          style={{
                            background: "transparent",
                            border: "1px solid #e0e0e0",
                            color: "#555",
                            borderRadius: 8,
                            padding: "6px 10px",
                            fontSize: 13,
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#e9d8a6";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                          }}
                        >
                          {customer.estado === "Activo" ? "🔴" : "🟢"}
                        </button>

                        {/* Editar */}
                        <button
                          type="button"
                          className="btn btn-sm d-inline-flex align-items-center gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit?.(customer);
                          }}
                          title="Editar cliente"
                          style={{
                            background: "transparent",
                            border: "1px solid #f3c6de",
                            color: "#ee9b00",
                            borderRadius: 8,
                            padding: "6px 12px",
                            fontSize: 13,
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#e9d8a6";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                          }}
                        >
                          ✏️ Editar
                        </button>

                        {/* Eliminar */}
                        <button
                          type="button"
                          className="btn btn-sm d-inline-flex align-items-center gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete?.(customer);
                          }}
                          title="Eliminar cliente"
                          style={{
                            background: "transparent",
                            border: "1px solid #ffcdd2",
                            color: "#e53935",
                            borderRadius: 8,
                            padding: "6px 12px",
                            fontSize: 13,
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#ffebee";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                          }}
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div
            className="d-flex justify-content-between align-items-center mt-2"
            style={{ fontSize: 13, color: "#888" }}
          >
            <span>
              Mostrando {filtered.length} de {customers.length} clientes
            </span>
            {(search.trim() || filterEstado !== "Todos") && (
              <button
                type="button"
                className="btn btn-sm"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#ee9b00",
                  textDecoration: "underline",
                }}
                onClick={() => {
                  setSearch("");
                  setFilterEstado("Todos");
                }}
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>
      )}

      {/* Vista móvil — cards */}
      {!loading && !error && (
        <div className="d-md-none">
          <div className="d-flex flex-column gap-3">
            {filtered.map((customer) => (
              <div
                key={customer.id}
                className="card border-0 shadow-sm"
                style={{ borderRadius: 16, overflow: "hidden", cursor: "pointer" }}
                onClick={() => onDetail?.(customer)}
              >
                <div className="card-body p-3">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="fw-semibold" style={{ fontSize: 15 }}>
                      {customer.nombre} {customer.apellido}
                    </div>
                    <EstadoBadge estado={customer.estado} />
                  </div>
                  <div className="d-flex flex-column gap-1 mb-2" style={{ fontSize: 13, color: "#555" }}>
                    <span>📧 {customer.email}</span>
                    <span>📱 {customer.whatsapp}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span style={{ fontSize: 13 }}>
                      Pedidos: <strong>{customer.cantidadPedidos}</strong>
                    </span>
                    <span className="fw-bold" style={{ color: "#2e7d32", fontSize: 15 }}>
                      $ {customer.totalComprado.toLocaleString("es-AR")}
                    </span>
                  </div>

                  <div className="d-flex gap-2 mt-3 pt-2 border-top">
                    {/* Activar / Desactivar */}
                    <button
                      type="button"
                      className="btn btn-sm d-inline-flex align-items-center justify-content-center gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleEstado?.(customer);
                      }}
                      title={
                        customer.estado === "Activo"
                          ? "Desactivar cliente"
                          : "Activar cliente"
                      }
                      style={{
                        background: "transparent",
                        border: "1px solid #e0e0e0",
                        color: "#555",
                        borderRadius: 8,
                        padding: "6px 8px",
                        fontSize: 13,
                        cursor: "pointer",
                      }}
                    >
                      {customer.estado === "Activo" ? "🔴" : "🟢"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm flex-grow-1 d-inline-flex align-items-center justify-content-center gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit?.(customer);
                      }}
                      title="Editar cliente"
                      style={{
                        background: "transparent",
                        border: "1px solid #f3c6de",
                        color: "#ee9b00",
                        borderRadius: 8,
                        padding: "6px 12px",
                        fontSize: 13,
                        cursor: "pointer",
                      }}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm flex-grow-1 d-inline-flex align-items-center justify-content-center gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.(customer);
                      }}
                      title="Eliminar cliente"
                      style={{
                        background: "transparent",
                        border: "1px solid #ffcdd2",
                        color: "#e53935",
                        borderRadius: 8,
                        padding: "6px 12px",
                        fontSize: 13,
                        cursor: "pointer",
                      }}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            className="d-flex justify-content-between align-items-center mt-2"
            style={{ fontSize: 13, color: "#888" }}
          >
            <span>
              Mostrando {filtered.length} de {customers.length} clientes
            </span>
            {(search.trim() || filterEstado !== "Todos") && (
              <button
                type="button"
                className="btn btn-sm"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#ee9b00",
                  textDecoration: "underline",
                }}
                onClick={() => {
                  setSearch("");
                  setFilterEstado("Todos");
                }}
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

