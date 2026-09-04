import { useCallback, useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";

import ProductCard from "../components/ProductCard";
import Categories from "../components/Categories";
import Hero from "../components/Hero";
import Contact from "../components/Contact";
import About from "../components/About";
import { subscribeProducts } from "../admin/services/productService";

export default function Home() {
  const [productsList, setProductsList] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const unsubscribe = subscribeProducts(
      (data) => {
        if (isMounted) {
          setProductsList(data.filter((p) => p.estado !== "Inactivo"));
          setLoadingProducts(false);
        }
      },
      (err) => {
        console.error("Error al cargar productos:", err);
        if (isMounted) setLoadingProducts(false);
      }
    );
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const searchQuery = searchParams.get("search") || "";

  const categoryFromUrl = searchParams.get("category");

  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    } else {
      setSelectedCategory("Todos");
    }
  }, [categoryFromUrl]);

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    const params = new URLSearchParams(searchParams);
    if (category === "Todos") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    setSearchParams(params);
  };

  const filteredProducts =
    selectedCategory === "Todos"
      ? productsList
      : productsList.filter(
          (product) => product.category === selectedCategory
        );

  const searchedProducts =
    searchQuery.trim().length === 0
      ? filteredProducts
      : filteredProducts.filter((product) =>
          product.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
        );

  // Scroll por hash - funciona para Inicio, Tienda, Nosotras, Contacto
  const scrollToHash = useCallback(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const el = document.getElementById(hash.replace("#", ""));
    el?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToHash();
  }, [location.hash, scrollToHash]);

  useEffect(() => {
    const hasCategoryFilter = searchParams.has("category");
    if (hasCategoryFilter) {
      const el = document.getElementById("products");
      el?.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedCategory, searchParams]);

  return (
    <>

      <div id="home" />

      {/* HERO */}

      <Hero />


      {/* NOSOTRAS */}

      <About />

      {/* CATEGORÍAS */}

      <Categories onSelectCategory={handleSelectCategory} />

      {/* PRODUCTOS */}

      <section
        className="py-5"
        id="products"
      >

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
            {searchedProducts.length === 0 ? (
              <div className="col-12">
                <p className="text-center">No se encontraron productos.</p>
              </div>
            ) : (
              searchedProducts.map((product) => (
                <div
                  className="col-md-6 col-lg-4"
                  key={product.id}
                >
                  <ProductCard
                    id={product.id}
                    image={product.image}
                    title={product.title}
                    price={product.price}
                  />
                </div>
              ))
            )}
          </div>


        </div>

      </section>

      {/* CONTACTO */}

      <Contact />

    </>
  );
}