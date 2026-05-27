export default function Categories() {

  const categories = [
    {
      id:1,
      title:"Maquillaje",
      image:"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9"
    },
    {
      id:2,
      title:"Perfumes",
      image:"https://images.unsplash.com/photo-1541643600914-78b084683601"
    },
    {
      id:3,
      title:"Accesorios",
      image:"https://images.unsplash.com/photo-1617038220319-276d3cfab638"
    },
    {
      id:4,
      title:"Skincare",
      image:"https://images.unsplash.com/photo-1556228578-8c89e6adf883"
    }
  ];

  return (
    <section className="categories py-5">

      <div className="container">

        <div className="text-center mb-5">

          <h2 className="fw-bold display-5">
            Categorías ✨
          </h2>

          <p className="text-muted">
            Descubrí todo para tu belleza
          </p>

        </div>

        <div className="row g-4">

          {categories.map((category) => (

            <div
              className="col-6 col-lg-3"
              key={category.id}
            >

              <div className="category-card">

                <img
                  src={category.image}
                  alt={category.title}
                />

                <div className="overlay">

                  <h4>
                    {category.title}
                  </h4>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}