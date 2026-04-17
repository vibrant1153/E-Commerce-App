import { BrowserRouter, Routes, Route,Navigate,useNavigate } from "react-router-dom";
// import products from "./data/products";
import Product from "./components/Product";
import ProductDetails from './pages/ProductDetails'
import Cart from "./pages/Cart";
// import { useNavigate } from "react-router-dom";
import { ProductContext } from "./context/ProductContext";
import { useContext } from "react";
import Login  from './pages/loginAndRegister/Login';
import Signup  from './pages/loginAndRegister/Signup';
import Navbar from "./components/Navbar";
import CheckoutPage from "./pages/checkOut/CheckoutPage";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminRoute from "./pages/admin/AdminRoute";
import SearchPage from "./pages/SearchPage";

// import SignUp from './pages/SignUp';
// import Home   from './pages/Home'; 

// function PrivateRoute({ children }) {
//   const token = localStorage.getItem('token');
//   return token ? children : <Navigate to="/login" />;
// }

function App() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
         {/* <Route
          path="/"
          element={userInfo ? <Home /> : <Navigate to="/login" />}
        /> */}
        <Route path="/" element={<Home />} />
        <Route path="/login"  element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/product/:id" element={<ProductDetails/>} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/search/:keyword" element={<SearchPage />} />
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function Home() {
  const navigate = useNavigate();
  const { products } = useContext(ProductContext);
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" style={{ padding: '40px 20px' }}>
      <div className="w-full">
        <div className="flex justify-between items-end mb-8" style={{ paddingBottom: '20px' }}>
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight" style={{ marginBottom: '10px' }}>Our Collection</h1>
            <p className="mt-2 text-lg text-gray-500">Discover handpicked, premium products</p>
          </div>
          <button 
            onClick={() => navigate("/cart")}
            className="border border-transparent rounded-md shadow-sm font-medium text-white bg-black hover:bg-gray-800 transition-colors"
            style={{ padding: '12px 24px', fontSize: '16px', borderRadius: '8px', cursor: 'pointer' }}
          >
            View Cart
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
          {products.map(product => (
            <Product key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;