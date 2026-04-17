import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";

function Product({ product, variant = "grid" }) {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [showToast, setShowToast] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const isList = variant === "list";

  return (
    <div 
      className="group relative bg-white border border-gray-200" 
      style={{ 
        padding: '24px', 
        borderRadius: '16px', 
        display: 'flex', 
        flexDirection: isList ? 'row' : 'column', 
        alignItems: isList ? 'center' : 'stretch',
        height: isList ? 'auto' : '100%', 
        boxSizing: 'border-box',
        transition: 'all 0.3s ease',
        cursor: 'default'
      }}
    >
      <div 
        className="relative overflow-hidden bg-gray-100 flex items-center justify-center" 
        style={{ 
          height: isList ? '160px' : '200px', 
          width: isList ? '200px' : '100%',
          flexShrink: 0,
          borderRadius: '12px', 
          marginBottom: isList ? '0' : '20px',
          marginRight: isList ? '24px' : '0'
        }}
      >
        <img 
          src={product.image}
          alt={product.name}
          className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="flex-grow" style={{ padding: isList ? '0' : '0 8px' }}>
        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-1">
          {product.name}
        </h3>
        <p className="text-gray-500 text-sm mt-1 line-clamp-2" style={{ display: isList ? 'block' : 'none' }}>
          {product.description || "Premium quality product designed for your everyday needs."}
        </p>
        <p className="font-bold text-gray-900" style={{ marginTop: '8px', fontSize: isList ? '28px' : '24px' }}>
          ${product.price}
        </p>
      </div>

      <div 
        className="flex gap-3" 
        style={{ 
          padding: isList ? '0' : '0 8px', 
          marginTop: isList ? '0' : '24px', 
          display: 'flex', 
          flexDirection: isList ? 'column' : 'row',
          width: isList ? '180px' : 'auto',
          marginLeft: isList ? '24px' : '0'
        }}
      >
        <button 
          onClick={() => navigate(`/product/${product.id}`)} 
          className="w-full flex items-center justify-center border border-black text-black bg-white hover:bg-gray-100 transition-colors"
          style={{ padding: '12px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          View Details
        </button>
        <button 
          onClick={handleAddToCart}
          className="w-full flex items-center justify-center border border-transparent text-white bg-black hover:bg-gray-800 transition-colors"
          style={{ padding: '12px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Add to Cart
        </button>
      </div>

      {showToast && (
        <div className="absolute top-4 right-4 bg-green-500 text-white font-medium shadow-lg z-10" style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '14px' }}>
          Added to cart
        </div>
      )}
    </div>
  );
}

export default Product;