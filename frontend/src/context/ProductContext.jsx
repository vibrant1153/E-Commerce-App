import { createContext, useState, useEffect, useCallback } from "react";

export const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);

  const fetchProducts = useCallback(() => {
    fetch("http://localhost:5000/api/products")
      .then(res => res.json())
      .then(data => setProducts(Array.isArray(data) ? data : data.rows || []));
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <ProductContext.Provider value={{ products, refreshProducts: fetchProducts }}>
      {children}
    </ProductContext.Provider>
  );
}