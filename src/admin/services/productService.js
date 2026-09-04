import rawProducts from "../../data/products";
import { firebaseRepository } from "./firebaseRepository.js";
import { useFirestore } from "./firebaseService.js";

const DEFAULT_PRODUCT_IMAGE =
  "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80";

function normalizeProduct(product) {
  return {
    id: product.id,
    title: product.title || "Producto sin nombre",
    category: product.category || "General",
    price: product.price || 0,
    image: product.image || DEFAULT_PRODUCT_IMAGE,
    description: product.description || "",
    availability: product.availability || "Disponible",
    stock: product.stock ?? 10,
    estado: product.estado || "Activo",
  };
}

function requireFirestore() {
  if (!useFirestore) {
    throw new Error(
      "Firebase no está configurado. Completá las variables VITE_FIREBASE_* en .env."
    );
  }
}

export async function getAllProducts() {
  if (!useFirestore) return rawProducts.map(normalizeProduct);

  const products = await firebaseRepository.products.getAll();
  return (products || []).map(normalizeProduct);
}

export function subscribeProducts(onProducts, onError) {
  if (!useFirestore) {
    onProducts(rawProducts.map(normalizeProduct));
    return () => {};
  }

  return firebaseRepository.products.subscribe(
    (products) => onProducts(products.map(normalizeProduct)),
    onError
  );
}

export async function getProductById(id) {
  if (!useFirestore) {
    return (
      rawProducts.map(normalizeProduct).find((p) => String(p.id) === String(id)) ||
      null
    );
  }

  const product = await firebaseRepository.products.getById(id);
  return product ? normalizeProduct(product) : null;
}

export async function createProduct(productData) {
  requireFirestore();
  await firebaseRepository.products.create({
    title: productData.title,
    category: productData.category,
    price: productData.price,
    image: productData.image,
    description: productData.description || "",
    availability: "Disponible",
    stock: productData.stock ?? 0,
    estado: productData.estado || "Activo",
  });
}

export async function updateProduct(id, productData) {
  requireFirestore();
  await firebaseRepository.products.update(id, {
    title: productData.title,
    category: productData.category,
    price: productData.price,
    image: productData.image,
    description: productData.description || "",
    stock: productData.stock ?? 0,
    estado: productData.estado || "Activo",
  });
}

export async function deleteProduct(id) {
  requireFirestore();
  await firebaseRepository.products.remove(id);
}

export async function seedProducts() {
  requireFirestore();
  await Promise.all(
    rawProducts.map((product) =>
      firebaseRepository.products.set(product.id, normalizeProduct(product))
    )
  );
}
