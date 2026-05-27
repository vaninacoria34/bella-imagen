import {
  FaShoppingBag,
  FaSearch,
  FaUser
} from "react-icons/fa";

import logo from "../assets/logo.jpg";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-premium">

      <div className="container">

        {/* LOGO */}

        <a
          className="navbar-brand d-flex align-items-center gap-3"
          href="#"
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

            <li className="nav-item">
              <a className="nav-link active-link" href="#">
                Inicio
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#">
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
      <a className="dropdown-item" href="#">
        💄 Maquillaje
      </a>
    </li>

    <li>
      <a className="dropdown-item" href="#">
        🌸 Perfumes
      </a>
    </li>

    <li>
      <a className="dropdown-item" href="#">
        👜 Accesorios
      </a>
    </li>

    <li>
      <a className="dropdown-item" href="#">
        ✨ Skincare
      </a>
    </li>

    <li>
      <a className="dropdown-item" href="#">
        🛍 Marroquinería
      </a>
    </li>

    <li>
      <a className="dropdown-item" href="#">
        👛 Carteras
      </a>
    </li>

    <li>
      <a className="dropdown-item" href="#">
        💼 Bolsos
      </a>
    </li>

    <li>
      <a className="dropdown-item" href="#">
        🎀 Bijouterie
      </a>
    </li>

  </ul>

</li>

            <li className="nav-item">
              <a className="nav-link" href="#">
                Nosotras
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#">
                Contacto
              </a>
            </li>

          </ul>

          {/* ICONOS */}

          <div className="d-flex align-items-center gap-4 nav-icons">

            <FaSearch />

            <FaUser />

            {/* CARRITO */}

            <div
              className="cart-icon"
              data-bs-toggle="offcanvas"
              data-bs-target="#cartSidebar"
            >

              <FaShoppingBag />

              <span className="cart-badge">
                0
              </span>

            </div>

          </div>

        </div>

      </div>

    </nav>
  );
}