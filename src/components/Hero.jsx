export default function Hero() {
  return (
    <section className="hero-banner">

      <div className="container">

        <div className="row align-items-center min-vh-100">

          <div className="col-lg-6">

            <span className="hero-badge">
              Nueva colección 2026 ✨
            </span>

            <h1 className="hero-title mt-4">
              Descubrí tu belleza
              con estilo y elegancia
            </h1>

            <p className="hero-text mt-4">
              Maquillaje, perfumes y accesorios
              diseñados para resaltar tu esencia.
            </p>

            <div className="d-flex gap-3 mt-4">

              <button className="btn btn-pink btn-lg">
                Comprar ahora
              </button>

              <button className="btn btn-light btn-lg shadow-sm">
                Ver catálogo
              </button>

            </div>

          </div>

          <div className="col-lg-6 text-center">

            <img
              src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9"
              alt="Beauty"
              className="hero-image"
            />

          </div>

        </div>

      </div>

    </section>
  );
}