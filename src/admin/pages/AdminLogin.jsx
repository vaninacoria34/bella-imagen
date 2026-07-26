import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  // Credenciales simuladas (Aldana)
  // Preparado para reemplazar por Firebase Authentication sin tocar interfaz/rutas.
  const ADMIN_EMAIL = "admin@bellaimagen.com";
  const ADMIN_PASSWORD = "Bella2026!";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const email = form.email.trim();
    const password = form.password;

    if (!email || !password) {
      setError("Completá correo y contraseña.");
      return;
    }

    // Validación simulada — cuando llegue Firebase se reemplaza este bloque
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      sessionStorage.setItem("adminSimulatedAuth", "true");
      navigate("/admin", { replace: true });
    } else {
      setError("Credenciales incorrectas. Probá de nuevo.");
    }
  };

  return (
    <section className="py-5">
      <div className="container" style={{ maxWidth: 520 }}>
        <div className="mb-4">
          <h2 className="fw-bold">Login Administrador</h2>
          <p className="text-muted">Accedé al panel de administración.</p>
        </div>

        <div className="mb-3">
          <button
            type="button"
            className="btn btn-outline-secondary d-inline-flex align-items-center gap-1 px-3 py-2"
            style={{ borderRadius: 12, borderColor: "#ddd", color: "#666" }}
            onClick={() => navigate("/")}
          >
            <span style={{ fontSize: "1.2rem", lineHeight: 1 }}>←</span> Volver a la tienda
          </button>
        </div>

        <div className="card border-0 shadow-sm" style={{ borderRadius: 16 }}>
          <div className="card-body p-4">
            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
              <div>
                <label className="form-label">Correo electrónico</label>
                <input
                  type="email"
                  className="form-control custom-input"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="admin@bella.com"
                  required
                />
              </div>

              <div>
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  className="form-control custom-input"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>

              {error && (
                <div className="alert alert-danger py-2" role="alert">
                  {error}
                </div>
              )}

              <button type="submit" className="btn btn-pink w-100 py-2">
                Ingresar
              </button>
            </form>
          </div>
        </div>

        <div className="text-muted mt-3" style={{ fontSize: 12 }}>
          Esta pantalla está lista para integrar Authentication. En esta etapa, el acceso se simula en el navegador.
        </div>
      </div>
    </section>
  );
}


