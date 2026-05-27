import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function ProductCard({
  id,
  image,
  title,
  price
}) {

  const { addToCart } = useContext(CartContext);

  return (
    <div className="card product-card border-0">

      <img
        src={image}
        alt={title}
        className="card-img-top product-img"
      />

      <div className="card-body text-center">

        <h5 className="fw-semibold">
          {title}
        </h5>

        <p className="text-pink fw-bold fs-5">
          ${price}
        </p>

        <button
          className="btn btn-pink w-100"
          onClick={() =>
            addToCart({
              id,
              image,
              title,
              price
            })
          }
        >
          Agregar al carrito
        </button>

      </div>

    </div>
  );
}