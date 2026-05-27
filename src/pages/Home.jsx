import ProductCard from "../components/ProductCard";
import Categories from "../components/Categories";
import Hero from "../components/Hero";
import Contact from "../components/Contact";
import Checkout from "../components/Checkout";
export default function Home() {

  const products = [
    {
      id:1,
      title:"Perfume Rosé",
      price:25000,
      image:"https://images.unsplash.com/photo-1541643600914-78b084683601"
    },
    {
      id:2,
      title:"Kit Makeup Pink",
      price:18000,
      image:"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9"
    },
    {
      id:3,
      title:"Labial Matte",
      price:8500,
      image:"https://images.unsplash.com/photo-1586495777744-4413f21062fa"
    },
  ];

  return (
    <>
    
    <Hero />
      <Categories />

      <section className="py-5">

        <div className="container">

          <div className="text-center mb-5">

            <h1 className="fw-bold display-5">
              Productos Destacados ✨
            </h1>

            <p className="text-muted">
              Elegí tus favoritos
            </p>

          </div>

          <div className="row g-4">

            {products.map((product) => (
              <div className="col-md-6 col-lg-4" key={product.id}>

                <ProductCard
                  id={product.id}
                  image={product.image}
                  title={product.title}
                  price={product.price}
                />
              </div>
            ))}

          </div>

        </div>

      </section>

      <Contact />
<Checkout />
    </>
  );
}