import { useContext, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


import { CartContext } from "../context/CartContext";

import ProductGallery from "../components/ProductGallery";
import ProductRating from "../components/ProductRating";
import ProductStatusPills from "../components/ProductStatusPills";
import ShippingInfo from "../components/ShippingInfo";
import SecurePurchaseInfo from "../components/SecurePurchaseInfo";

import productsCatalog from "../data/products";

function clampQuantity(n) {
  const num = Number(n);
  if (Number.isNaN(num) || num < 1) return 1;
  return Math.floor(num);
}

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);

  const navigate = useNavigate();

  const productId = Number(id);

  const product = useMemo(
    () => productsCatalog.find((p) => p.id === productId),
    [productId]
  );

  const [quantity, setQuantity] = useState(1);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return productsCatalog
      .filter((p) => p.id !== product.id && p.category === product.category)
      .slice(0, 3);
  }, [product]);

  if (!product) {
    return (
      <section className="py-5" id="product-detail">
        <div className="container">
          <h2 className="fw-bold">Producto no encontrado</h2>
        </div>
      </section>
    );
  }

  const handleAddToCart = () => {
    const qty = clampQuantity(quantity);

    // Mantener el funcionamiento actual: addToCart suma +1 por llamada.
    for (let i = 0; i < qty; i++) {
      addToCart({
        id: product.id,
        image: product.image,
        title: product.title,
        price: product.price,
      });
    }
  };

  return (
    <section className="py-5" id="product-detail">
      <div className="container">
        <div className="row g-4 align-items-start">
          <div className="col-md-6">
            <ProductGallery
              images={[product.image /* estructura lista para más imágenes */]}
              alt={product.title}
            />

            {/* Espacio preparado para futuras imágenes */}
          </div>

          <div className="col-md-6">
            <ProductStatusPills
              status={{
                isNew: true,
                isOffer: product.id === 2,
                isBestseller: product.id === 3,
              }}
            />

            <h2 className="fw-bold mt-3">{product.title}</h2>

            <p className="text-pink fw-bold fs-4 mb-3">${product.price}</p>

            <p className="mb-3">{product.description}</p>

            <p className="mb-1">
              <strong>Categoría:</strong> {product.category}
            </p>
            <p className="mb-1">
              <strong>Stock disponible:</strong> {product.id === 1 ? 12 : product.id === 2 ? 7 : 18}
            </p>
            <p className="mb-4">
              <strong>Disponibilidad:</strong> {product.availability}
            </p>

            <ProductRating value={product.id === 1 ? 4.7 : product.id === 2 ? 4.4 : 4.9} />

            <ShippingInfo />
            <SecurePurchaseInfo />

            <div className="d-flex align-items-center gap-2 mb-3">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setQuantity((q) => clampQuantity(q - 1))}
                aria-label="Bajar cantidad"
              >
                -
              </button>

              <div className="px-3 py-2 bg-light rounded">
                <span className="fw-bold">{quantity}</span>
              </div>

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setQuantity((q) => clampQuantity(q + 1))}
                aria-label="Subir cantidad"
              >
                +
              </button>
            </div>

            <button className="btn btn-pink btn-lg" onClick={handleAddToCart}>
              Agregar al carrito
            </button>
          </div>
        </div>

        <div className="mt-5">
          <h3 className="fw-bold mb-4">Productos relacionados</h3>

          <div className="row g-4">
            {relatedProducts.length === 0 ? (
              <div className="col-12">
                <p className="text-muted mb-0">No hay productos relacionados.</p>
              </div>
            ) : (
              relatedProducts.map((p) => (
                <div key={p.id} className="col-md-6 col-lg-4">
                  <div className="card product-card border-0">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="card-img-top product-img"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="card-body text-center py-3">
                      <h5 className="fw-semibold">{p.title}</h5>
                      <p className="text-pink fw-bold fs-5">${p.price}</p>
                      <button
                        className="btn btn-pink w-100"
                        onClick={() => {
                          // navegación SPA
                          navigate(`/product/${p.id}`);

                        }}
                      >
                        Ver producto
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

