import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";

function Product({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [showToast, setShowToast] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="group relative bg-white border border-gray-200" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
      <div className="relative w-full overflow-hidden bg-gray-100 flex items-center justify-center" style={{ height: '200px', borderRadius: '12px', marginBottom: '20px' }}>
        <img 
          src={product.image}
          alt={product.name}
          className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="flex-grow" style={{ padding: '0 8px' }}>
        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-1">{product.name}</h3>
        <p className="font-bold text-gray-900" style={{ marginTop: '8px', fontSize: '24px' }}>${product.price}</p>
      </div>

      <div className="grid grid-cols-2 gap-3" style={{ padding: '0 8px', marginTop: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
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