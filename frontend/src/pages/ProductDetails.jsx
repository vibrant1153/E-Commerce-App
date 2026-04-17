import { useParams, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { ProductContext } from "../context/ProductContext";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cart, addToCart } = useContext(CartContext);
  const { products } = useContext(ProductContext);
  const [showToast, setShowToast] = useState(false);

  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-800">Product not found</h2>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ padding: '48px 20px', boxSizing: 'border-box' }}>
      <div className="max-w-6xl mx-auto bg-white shadow-xl overflow-hidden" style={{ borderRadius: '24px', display: 'flex', flexDirection: 'column' }}>
        <div className="flex flex-col lg:flex-row" style={{ display: 'flex', flexWrap: 'wrap' }}>
          
          {/* Image Section */}
          <div className="lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white" style={{ flex: '1 1 50%', padding: '48px', boxSizing: 'border-box' }}>
            <div className="relative" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <img 
                src={product.image} 
                alt={product.name} 
                className="max-w-full h-auto shadow-2xl hover:scale-[1.02] transition-transform duration-500"
                style={{ borderRadius: '16px' }}
              />
              <div className="absolute bg-green-500 text-white font-bold shadow-md" style={{ top: '16px', left: '16px', padding: '4px 12px', borderRadius: '999px', fontSize: '12px' }}>
                In Stock
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:w-1/2 flex flex-col justify-center" style={{ flex: '1 1 50%', padding: '48px', boxSizing: 'border-box' }}>
            <div style={{ marginBottom: '24px' }}>
              <div className="flex items-center text-indigo-600 font-semibold" style={{ fontSize: '14px', marginBottom: '8px', display: 'flex', gap: '8px' }}>
                <span>Premium Quality</span>
                <span>•</span>
                <span>Fast Shipping</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight" style={{ marginBottom: '16px' }}>
                {product.name}
              </h1>
              <p className="font-bold text-indigo-600" style={{ fontSize: '30px', marginBottom: '24px' }}>${product.price}</p>
            </div>

            <div className="text-gray-600" style={{ marginBottom: '32px' }}>
              <p className="leading-relaxed" style={{ fontSize: '18px', marginBottom: '24px' }}>
                {product.description || "Experience the perfect blend of style, performance, and durability. This high-quality product is designed to meet your everyday needs with premium materials and expert craftsmanship."}
              </p>
              
              <div className="bg-gray-50 border border-gray-100 shadow-sm flex items-start" style={{ padding: '20px', borderRadius: '12px', gap: '16px' }}>
                <div className="bg-indigo-100 text-indigo-600" style={{ padding: '8px', borderRadius: '8px' }}>
                  <svg className="w-6 h-6" style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Estimated Shipping Delivery</h4>
                  <p className="text-gray-500" style={{ fontSize: '14px', marginTop: '4px' }}>Get it by {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()} if you order within 2 hours.</p>
                </div>
              </div>
            </div>

            <div className="mt-auto border-gray-100 flex flex-col sm:flex-row relative" style={{ paddingTop: '24px', borderTop: '1px solid #f3f4f6', display: 'flex', gap: '16px' }}>
              <button  
                onClick={handleAddToCart}
                className="bg-indigo-600 text-white font-bold hover:bg-indigo-700 hover:shadow-lg transition-all duration-200 flex items-center justify-center"
                style={{ flex: 1, padding: '16px 32px', borderRadius: '12px', fontSize: '18px', cursor: 'pointer', gap: '8px' }}
              >
                <svg className="w-6 h-6" style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                <span>Add to Cart</span>
              </button>

              {showToast && (
                <div className="absolute text-white shadow-2xl flex items-center transition-opacity" style={{ top: '-56px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#111827', padding: '12px 24px', borderRadius: '12px', gap: '12px' }}>
                  <svg className="w-5 h-5 text-green-400" style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span className="font-medium whitespace-nowrap">Successfully added to cart</span>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
