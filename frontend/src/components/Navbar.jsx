// components/Navbar.jsx
import { Link, useLocation, useNavigate  } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

export default function Navbar() {
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (pathname.startsWith("/search/")) {
       const pathKeyword = pathname.split("/search/")[1];
       if (pathKeyword) {
         setSearchTerm(decodeURIComponent(pathKeyword));
       }
    } else {
      setSearchTerm("");
    }
  }, [pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search/${searchTerm.trim()}`);
    }
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => {
    setMenuOpen(false);
  };

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const isLoggedIn = !!userInfo;

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* Main bar */}
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <span className="logo-dot" />
          Shopname
        </Link>

        {/* Search Bar - Desktop */}
        <form className="navbar-search-desktop" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" aria-label="Search">
            <SearchIcon />
          </button>
        </form>

        {/* Desktop links */}
        <div className="navbar-desktop-menu">
          <Link
            to="/"
            className={`nav-link ${pathname === "/" ? "active" : ""}`}
          >
            Home
          </Link>

          {userInfo?.role === 'admin' && (
            <Link
              to="/admin/orders"
              className={`nav-link ${pathname.startsWith("/admin") ? "active" : ""}`}
            >
              Admin
            </Link>
          )}

          {/* Cart with badge */}
          <Link
            to="/cart"
            className={`nav-link cart-link ${pathname === "/cart" ? "active" : ""}`}
          >
            <CartIcon />
            <span>Cart</span>
            {itemCount > 0 && (
              <span className="cart-badge">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>

          <div className="nav-divider" />

          {isLoggedIn ? (
        <button onClick={handleLogout} className="nav-btn-primary">
          Logout
        </button>
      ) : 
      (
        <>
          <Link to="/login" className="nav-link">
            Login
          </Link>
          <Link to="/signup" className="nav-btn-primary">
            Sign up
          </Link>
        </>
      )}
        </div>

        {/* Mobile: cart icon + hamburger */}
        <div className="navbar-mobile-controls">
          <Link to="/cart" className="mobile-cart-icon" onClick={closeMenu}>
            <CartIcon />
            {itemCount > 0 && (
              <span className="cart-badge-mobile">{itemCount}</span>
            )}
          </Link>
          <button
            onClick={toggleMenu}
            className="menu-toggle-btn"
            aria-label="Toggle menu"
          >
            {menuOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="navbar-mobile-dropdown">
          {/* Search Bar - Mobile */}
          <form className="navbar-search-mobile" onSubmit={(e) => {
            handleSearch(e);
            closeMenu();
          }}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">
              <SearchIcon />
            </button>
          </form>

          <Link to="/" onClick={closeMenu} className="mobile-nav-link">
            Home
          </Link>
          {userInfo?.role === 'admin' && (
            <Link to="/admin/orders" onClick={closeMenu} className="mobile-nav-link">
              Admin Dashboard
            </Link>
          )}
          <Link to="/cart" onClick={closeMenu} className="mobile-nav-link mobile-cart-row">
            <span>Cart</span>
            {itemCount > 0 && (
              <span className="mobile-badge-inline">{itemCount}</span>
            )}
          </Link>
          <div className="mobile-divider" />


          <div className="mobile-auth-buttons">
          {isLoggedIn ? (
            <button
              onClick={() => {
                handleLogout();
                closeMenu();
              }}
              className="nav-btn-primary"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu} className="nav-btn-secondary">
                Login
              </Link>
              <Link to="/signup" onClick={closeMenu} className="nav-btn-primary">
                Sign up
              </Link>
            </>
          )}
        </div>
        </div>
      )}
    </nav>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}