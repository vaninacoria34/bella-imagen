export default function About() {

  return (

    <section
      className="about-section py-5"
      id="about"
    >

      <div className="container">

        <div className="row align-items-center g-5">

          {/* IMAGEN */}

          <div className="col-lg-6">

            <img
              src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1"
              alt="Belleza femenina"
              className="about-image"
            />

          </div>

          {/* TEXTO */}

          <div className="col-lg-6">

            <span className="about-mini">
              NOSOTRAS
            </span>

            <h2 className="about-title">
              Creemos en el amor propio ✨
            </h2>

            <p className="about-text">
              Bella Imagen nació para inspirar a
              cada mujer a dedicarse tiempo,
              sentirse hermosa y conectar con
              su esencia.
            </p>

            <p className="about-text">
              Creemos que maquillarse,
              cuidarse y mimarse no es un lujo,
              sino una forma de amor propio 💖
            </p>

            <p className="about-text">
              Queremos acompañarte con productos
              que te hagan sentir segura,
              auténtica y brillante todos los días.
            </p>

            <a
              href="#products"
              className="btn btn-pink mt-3"
            >
              Descubrir productos ✨
            </a>

          </div>

        </div>

      </div>

    </section>
  );
}