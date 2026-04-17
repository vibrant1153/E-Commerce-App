import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Product from "../components/Product";
import "./SearchPage.css";

export default function SearchPage() {
  const { keyword } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:5000/api/products?search=${keyword}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError("Failed to fetch search results. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (keyword) {
      fetchSearchResults();
    }
  }, [keyword]);

  return (
    <div className="search-page-container">
      <div className="search-header">
        <h1>
          Results for <span className="keyword-text">"{keyword}"</span>
        </h1>
        <p className="results-count">
          {products.length} {products.length === 1 ? "product" : "products"} found
        </p>
      </div>

      {loading ? (
        <div className="loading-state">
           <div className="spinner"></div>
           <p>Searching for the best products...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <p>{error}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <h2>No matching products found</h2>
          <p>Try checking your spelling or using different keywords.</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <Product key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
