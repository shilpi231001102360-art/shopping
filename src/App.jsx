
import { useState } from "react";
import "./App.css";

const products = [
  { id: 1, name: "Classic Sneakers", category: "Footwear", price: 2499, emoji: "👟", color: "#e8e9ff" },
  { id: 2, name: "Premium Headphones", category: "Electronics", price: 3299, emoji: "🎧", color: "#fce8e8" },
  { id: 3, name: "Smart Watch", category: "Accessories", price: 1999, emoji: "⌚", color: "#e2f5ef" },
  { id: 4, name: "Travel Backpack", category: "Lifestyle", price: 1599, emoji: "🎒", color: "#fff0d9" },
  { id: 5, name: "Classic Sunglasses", category: "Accessories", price: 899, emoji: "🕶️", color: "#e6f0fa" },
  { id: 6, name: "Wireless Speaker", category: "Electronics", price: 2199, emoji: "🔊", color: "#f1e7fa" },
];

function Header({ count }) {
  return (
    <header className="header">
      <div className="logo">LUXE<span>.</span></div>
      <nav>
        <a href="#home">Home</a>
        <a href="#products">Shop</a>
        <a href="#products">Collections</a>
      </nav>
      <a className="cart-icon" href="#cart">
        🛍️ <span>{count}</span>
      </a>
    </header>
  );
}

function ProductCard({ product, addToCart }) {
  return (
    <div className="product-card">
      <div className="product-image" style={{ background: product.color }}>
        <span className="product-emoji">{product.emoji}</span>
        <span className="tag">NEW</span>
      </div>
      <div className="product-info">
        <p className="category">{product.category}</p>
        <h3>{product.name}</h3>
        <div className="product-bottom">
          <strong>₹{product.price.toLocaleString("en-IN")}</strong>
          <button onClick={() => addToCart(product)}>+ Add</button>
        </div>
      </div>
    </div>
  );
}

function Cart({ cart, updateQuantity, removeItem, coupon, setCoupon, applyCoupon, discount }) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const gst = Math.round(subtotal * 0.18);
  const discountAmount = Math.round(subtotal * discount / 100);
  const total = subtotal - discountAmount + gst;

  return (
    <section className="cart-section" id="cart">
      <div className="section-heading">
        <div>
          <p className="eyebrow">YOUR SELECTION</p>
          <h2>Shopping Cart <span>({cart.reduce((sum, item) => sum + item.quantity, 0)})</span></h2>
        </div>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <div>🛍️</div>
              <h3>Your cart is waiting</h3>
              <p>Add something you love from our collection.</p>
              <a href="#products" className="shop-btn">Explore Products</a>
            </div>
          ) : (
            cart.map(item => (
              <div className="cart-item" key={item.id}>
                <div className="cart-product-image" style={{ background: item.color }}>
                  {item.emoji}
                </div>
                <div className="cart-product-details">
                  <h3>{item.name}</h3>
                  <p>₹{item.price.toLocaleString("en-IN")}</p>
                  <div className="quantity">
                    <button onClick={() => updateQuantity(item.id, -1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                  </div>
                </div>
                <div className="cart-item-right">
                  <strong>₹{(item.price * item.quantity).toLocaleString("en-IN")}</strong>
                  <button className="remove" onClick={() => removeItem(item.id)}>Remove</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="summary">
          <h3>Order Summary</h3>
          <div className="coupon">
            <input
              value={coupon}
              onChange={e => setCoupon(e.target.value)}
              placeholder="Enter coupon code"
            />
            <button onClick={applyCoupon}>Apply</button>
          </div>

          <p className="coupon-hint">Use LUXE10 for 10% off</p>

          {discount > 0 && <p className="success">✓ {discount}% discount applied!</p>}

          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{subtotal.toLocaleString("en-IN")}</span>
          </div>
          <div className="summary-row">
            <span>Discount</span>
            <span className="discount">−₹{discountAmount.toLocaleString("en-IN")}</span>
          </div>
          <div className="summary-row">
            <span>GST (18%)</span>
            <span>₹{gst.toLocaleString("en-IN")}</span>
          </div>

          <div className="summary-total">
            <span>Grand Total</span>
            <strong>₹{total.toLocaleString("en-IN")}</strong>
          </div>

          <button
            className="checkout"
            disabled={cart.length === 0}
            onClick={() => alert("Order placed successfully! Thank you for shopping with LUXE.")}
          >
            Proceed to Checkout →
          </button>
          <p className="secure">🔒 Secure checkout · GST included as calculated</p>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="logo">LUXE<span>.</span></div>
      <p>Designed for your everyday elegance.</p>
      <p>© 2026 LUXE Store. All rights reserved.</p>
    </footer>
  );
}

export default function App() {
  const [cart, setCart] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [message, setMessage] = useState("");

  function addToCart(product) {
    setCart(prev => {
      const found = prev.find(item => item.id === product.id);
      if (found) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }

  function updateQuantity(id, change) {
    setCart(prev =>
      prev
        .map(item =>
          item.id === id
            ? { ...item, quantity: item.quantity + change }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  }

  function removeItem(id) {
    setCart(prev => prev.filter(item => item.id !== id));
  }

  function applyCoupon() {
    if (coupon.trim().toUpperCase() === "LUXE10") {
      setDiscount(10);
      setMessage("");
    } else {
      setDiscount(0);
      setMessage("Invalid coupon. Please try LUXE10.");
    }
  }

  return (
    <>
      <Header count={cart.reduce((sum, item) => sum + item.quantity, 0)} />

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <p className="eyebrow">THE NEW COLLECTION · 2026</p>
            <h1>Style that speaks.<br /><span>Quality that lasts.</span></h1>
            <p className="hero-description">
              Discover thoughtfully selected essentials
              designed to elevate your everyday lifestyle.
            </p>
            <a href="#products" className="hero-btn">Explore Collection ↗</a>
          </div>
          <div className="hero-art">
            <div className="hero-circle"></div>
            <div className="hero-emoji">🛍️</div>
            <div className="floating-card">✦ Curated for you</div>
          </div>
        </section>

        <section className="products-section" id="products">
          <div className="section-heading">
            <div>
              <p className="eyebrow">HANDPICKED FOR YOU</p>
              <h2>Featured Products</h2>
            </div>
            <span className="product-count">{products.length} products</span>
          </div>

          <div className="product-grid">
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                addToCart={addToCart}
              />
            ))}
          </div>
        </section>

        <Cart
          cart={cart}
          updateQuantity={updateQuantity}
          removeItem={removeItem}
          coupon={coupon}
          setCoupon={setCoupon}
          applyCoupon={applyCoupon}
          discount={discount}
        />

        {message && <div className="toast">{message}</div>}
      </main>

      <Footer />
    </>
  );
}