import { useContext, useMemo, useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";

import {
  FaShoppingBag,
  FaSearch,
  FaUser
} from "react-icons/fa";


import logo from "../assets/logo.jpg";
import { CartContext } from "../context/CartContext";

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const isAdminLoggedIn =
    sessionStorage.getItem("adminSimulatedAuth") === "true";

  const { cart } = useContext(CartContext);

  const handleUserClick = () => {
    if (isAdminLoggedIn) {
      setIsUserMenuOpen((prev) => !prev);
    } else {
      navigate("/admin/login");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminSimulatedAuth");
    setIsUserMenuOpen(false);
    navigate("/");
  };

  const handleSearchChange = (e) => {
    const nextValue = e.target.value;
    setSearchQuery(nextValue);

    if (location.pathname === "/") {
      const params = new URLSearchParams(searchParams);
      if (nextValue.trim()) {
        params.set("search", nextValue.trim());
      } else {
        params.delete("search");
      }
      setSearchParams(params);
    } else {
      if (nextValue.trim()) {
        navigate("/?search=" + encodeURIComponent(nextValue.trim()));
      } else {
        navigate("/");
      }
    }
  };

  const handleCategoryClick = (category) => {
    navigate("/?category=" + encodeURIComponent(category));
  };

  const handleNavClick = (hash) => {
    navigate("/" + hash);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-premium">

      <div className="container">

        {/* LOGO */}

        <a
          className="navbar-brand d-flex align-items-center gap-3"
          href="/"
          onClick={(e) => { e.preventDefault(); navigate("/"); }}
        >

          <img
            src={logo}
            alt="Bella Imagen"
            className="logo-img"
          />

          <span className="brand-text">
            Bella Imagen
          </span>

        </a>

        {/* BOTÓN MOBILE */}

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#menu"
          aria-controls="menu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* MENÚ */}

        <div
          className="collapse navbar-collapse"
          id="menu"
        >

          <ul className="navbar-nav mx-auto gap-lg-4">

            {/* INICIO */}

            <li className="nav-item">
              <a
                className="nav-link active-link"
                href="/#home"
                onClick={(e) => { e.preventDefault(); navigate("/#home"); }}
              >
                Inicio
              </a>
            </li>

            {/* TIENDA */}

            <li className="nav-item">
              <a
                className="nav-link"
                href="/#products"
                onClick={(e) => { e.preventDefault(); navigate("/#products"); }}
              >
                Tienda
              </a>
            </li>

            {/* DROPDOWN CATEGORÍAS */}

            <li className="nav-item dropdown">

              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Categorías
              </a>

              <ul className="dropdown-menu custom-dropdown">

                <li>
                  <a
                    className="dropdown-item"
                    href="/?category=Maquillaje"
                    onClick={(e) => { e.preventDefault(); handleCategoryClick("Maquillaje"); }}
                  >
                    💄 Maquillaje
                  </a>
                </li>

                <li>
                  <a
                    className="dropdown-item"
                    href="/?category=Perfumes"
                    onClick={(e) => { e.preventDefault(); handleCategoryClick("Perfumes"); }}
                  >
                    🌸 Perfumes
                  </a>
                </li>

                <li>
                  <a
                    className="dropdown-item"
                    href="/?category=Accesorios"
                    onClick={(e) => { e.preventDefault(); handleCategoryClick("Accesorios"); }}
                  >
                    👜 Accesorios
                  </a>
                </li>

                <li>
                  <a
                    className="dropdown-item"
                    href="/?category=Skincare"
                    onClick={(e) => { e.preventDefault(); handleCategoryClick("Skincare"); }}
                  >
                    ✨ Skincare
                  </a>
                </li>

                <li>
                  <a
                    className="dropdown-item"
                    href="/?category=Marroquinería"
                    onClick={(e) => { e.preventDefault(); handleCategoryClick("Marroquinería"); }}
                  >
                    🛍 Marroquinería
                  </a>
                </li>

                <li>
                  <a
                    className="dropdown-item"
                    href="/?category=Carteras"
                    onClick={(e) => { e.preventDefault(); handleCategoryClick("Carteras"); }}
                  >
                    👛 Carteras
                  </a>
                </li>

                <li>
                  <a
                    className="dropdown-item"
                    href="/?category=Bolsos"
                    onClick={(e) => { e.preventDefault(); handleCategoryClick("Bolsos"); }}
                  >
                    💼 Bolsos
                  </a>
                </li>

                <li>
                  <a
                    className="dropdown-item"
                    href="/?category=Bijouterie"
                    onClick={(e) => { e.preventDefault(); handleCategoryClick("Bijouterie"); }}
                  >
                    🎀 Bijouterie
                  </a>
                </li>

              </ul>

            </li>

            {/* NOSOTRAS */}

            <li className="nav-item">
              <a
                className="nav-link"
                href="/#about"
                onClick={(e) => { e.preventDefault(); navigate("/#about"); }}
              >
                Nosotras
              </a>
            </li>

            {/* CONTACTO */}

            <li className="nav-item">
              <a
                className="nav-link"
                href="/#contact"
                onClick={(e) => { e.preventDefault(); navigate("/#contact"); }}
              >
                Contacto
              </a>
            </li>



          </ul>

          {/* ICONOS */}

          <div className="d-flex align-items-center gap-4 nav-icons">

            {isSearchOpen ? (
              <input
                type="text"
                className="form-control"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            ) : (
              <FaSearch
                role="button"
                tabIndex={0}
                aria-label="Buscar"
                onClick={() => setIsSearchOpen(true)}
              />
            )}

            <div className="position-relative">
              <FaUser
                role="button"
                tabIndex={0}
                aria-label="Usuario"
                style={{ cursor: "pointer" }}
                onClick={handleUserClick}
              />

              {isUserMenuOpen && isAdminLoggedIn && (
                <div
                  className="position-absolute end-0 mt-2 bg-white shadow rounded-3 p-2"
                  style={{
                    zIndex: 9999,
                    minWidth: 200,
                    border: "1px solid rgba(0,0,0,0.08)",
                  }}
                >
                  <a
                    href="/admin"
                    className="d-block px-3 py-2 text-dark text-decoration-none rounded-2"
                    style={{ fontSize: 14 }}
                    onMouseEnter={(e) =>
                      (e.target.style.background = "#f8f9fa")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.background = "transparent")
                    }
                  >
                    🔧 Panel de Administración
                  </a>
                  <hr className="my-1" />
                  <button
                    className="d-block w-100 text-start px-3 py-2 bg-transparent border-0 rounded-2"
                    style={{ fontSize: 14 }}
                    onClick={handleLogout}
                    onMouseEnter={(e) =>
                      (e.target.style.background = "#f8f9fa")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.background = "transparent")
                    }
                  >
                    🚪 Cerrar sesión
                  </button>
                </div>
              )}
            </div>


            {/* CARRITO */}

            <div
              className="cart-icon"
              data-bs-toggle="offcanvas"
              data-bs-target="#cartSidebar"
            >

              <FaShoppingBag />

              <span className="cart-badge">
                {cart.length}
              </span>

            </div>

          </div>

        </div>

      </div>

    </nav>
  );
}