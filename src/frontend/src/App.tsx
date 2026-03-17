import {
  ChevronUp,
  Leaf,
  MapPin,
  MessageCircle,
  Minus,
  Phone,
  Plus,
  ShoppingCart,
  Star,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { SiFacebook, SiInstagram, SiYoutube } from "react-icons/si";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface CartItem extends Product {
  qty: number;
}

interface OrderForm {
  name: string;
  phone: string;
  address: string;
}

// ─── Products Data ────────────────────────────────────────────────────────────
const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Multani Mitti Natural Soap",
    price: 80,
    image: "/assets/uploads/WhatsApp-Image-2026-02-26-at-10.24.29-PM-1--1.jpeg",
  },
  {
    id: 2,
    name: "Neem and Tulsi Natural Soap",
    price: 80,
    image: "/assets/uploads/WhatsApp-Image-2026-02-26-at-10.24.30-PM-2--2.jpeg",
  },
  {
    id: 3,
    name: "Goat Milk Natural Soap",
    price: 80,
    image: "/assets/uploads/WhatsApp-Image-2026-02-26-at-10.24.28-PM-1--3.jpeg",
  },
  {
    id: 4,
    name: "Sandalwood Natural Soap",
    price: 80,
    image: "/assets/uploads/WhatsApp-Image-2026-02-26-at-10.24.30-PM-3--4.jpeg",
  },
  {
    id: 5,
    name: "Nalangu Maavu Natural Soap",
    price: 80,
    image: "/assets/uploads/WhatsApp-Image-2026-02-26-at-10.24.30-PM-5.jpeg",
  },
  {
    id: 6,
    name: "Mangosteen Natural Soap",
    price: 80,
    image: "/assets/uploads/WhatsApp-Image-2026-02-26-at-10.24.29-PM-6.jpeg",
  },
  {
    id: 7,
    name: "Kuppamieni Natural Soap",
    price: 80,
    image: "/assets/uploads/WhatsApp-Image-2026-02-26-at-10.24.28-PM-2--7.jpeg",
  },
  {
    id: 8,
    name: "Charcoal and Sage Natural Soap",
    price: 80,
    image: "/assets/uploads/WhatsApp-Image-2026-02-26-at-10.24.28-PM-8.jpeg",
  },
  {
    id: 9,
    name: "Aloe Vera Natural Soap",
    price: 80,
    image: "/assets/uploads/WhatsApp-Image-2026-02-27-at-12.35.07-AM-1.jpeg",
  },
];

const REVIEWS = [
  {
    id: 1,
    name: "Priya Krishnamurthy",
    rating: 5,
    text: "The Neem and Tulsi soap is incredible! My skin has never felt so clean and fresh. Will order again!",
    product: "Neem and Tulsi Natural Soap",
  },
  {
    id: 2,
    name: "Ramesh Sundaram",
    rating: 5,
    text: "Sandalwood soap has an amazing fragrance. Very gentle on skin and lathers beautifully. Highly recommended!",
    product: "Sandalwood Natural Soap",
  },
  {
    id: 3,
    name: "Meena Balakrishnan",
    rating: 5,
    text: "Goat Milk soap is so moisturising! My dry skin issues are completely gone. Love this brand.",
    product: "Goat Milk Natural Soap",
  },
  {
    id: 4,
    name: "Suresh Venkataraman",
    rating: 4,
    text: "Excellent quality herbal soaps at a very affordable price. The Aloe Vera soap is my favourite.",
    product: "Aloe Vera Natural Soap",
  },
];

const NAV_LINKS = ["Home", "Products", "Reviews", "Contact"];

const TRUST_BADGES = [
  { icon: "🌿", label: "100% Natural Ingredients" },
  { icon: "🤲", label: "Handmade with Care" },
  { icon: "✅", label: "No Harmful Chemicals" },
  { icon: "♻️", label: "Eco-Friendly Packaging" },
  { icon: "🌱", label: "Cruelty Free" },
];

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [orderFormOpen, setOrderFormOpen] = useState(false);
  const [logoZoom, setLogoZoom] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [orderForm, setOrderForm] = useState<OrderForm>({
    name: "",
    phone: "",
    address: "",
  });
  const [orderErrors, setOrderErrors] = useState<Partial<OrderForm>>({});
  const [orderSent, setOrderSent] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!logoZoom) return;
    const t = setTimeout(() => setLogoZoom(false), 3000);
    return () => clearTimeout(t);
  }, [logoZoom]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCartOpen(false);
        setOrderFormOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const getQty = (id: number) => quantities[id] ?? 1;

  const setQty = (id: number, val: number) => {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(1, val) }));
  };

  const addToCart = useCallback(
    (product: Product) => {
      const qty = quantities[product.id] ?? 1;
      setCart((prev) => {
        const existing = prev.find((i) => i.id === product.id);
        if (existing) {
          return prev.map((i) =>
            i.id === product.id ? { ...i, qty: i.qty + qty } : i,
          );
        }
        return [...prev, { ...product, qty }];
      });
      setCartOpen(true);
    },
    [quantities],
  );

  const updateCartQty = (id: number, delta: number) => {
    setCart((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i,
      ),
    );
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  const validateOrder = () => {
    const errors: Partial<OrderForm> = {};
    if (!orderForm.name.trim()) errors.name = "Name is required";
    if (!orderForm.phone.trim()) errors.phone = "Phone is required";
    if (!orderForm.address.trim()) errors.address = "Address is required";
    setOrderErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const placeWhatsAppOrder = () => {
    if (!validateOrder()) return;
    const itemLines = cart
      .map((i) => `${i.name} - Qty: ${i.qty} - Rs.${i.price * i.qty}`)
      .join("\n");
    const msg = [
      "*New Order - Kishore Organic Soaps*",
      "",
      "*Order Details:*",
      itemLines,
      "",
      `*Total Amount: Rs.${cartTotal}*`,
      "",
      "*Customer Details:*",
      `Name: ${orderForm.name}`,
      `Phone: ${orderForm.phone}`,
      `Address: ${orderForm.address}`,
    ].join("\n");
    const url = `https://wa.me/918825950026?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
    setOrderSent(true);
    setTimeout(() => {
      setOrderFormOpen(false);
      setCartOpen(false);
      setCart([]);
      setOrderForm({ name: "", phone: "", address: "" });
      setOrderSent(false);
    }, 2000);
  };

  const closeCart = () => {
    setCartOpen(false);
    setOrderFormOpen(false);
  };

  return (
    <div style={{ backgroundColor: "#f5f1e8", minHeight: "100vh" }}>
      {/* Leaf background decorations */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
          zIndex: 0,
        }}
      >
        <span
          className="leaf-1"
          style={{
            position: "absolute",
            top: "10%",
            left: "5%",
            fontSize: 32,
            opacity: 0.15,
          }}
        >
          🌿
        </span>
        <span
          className="leaf-2"
          style={{
            position: "absolute",
            top: "30%",
            right: "8%",
            fontSize: 24,
            opacity: 0.12,
          }}
        >
          🍃
        </span>
        <span
          className="leaf-3"
          style={{
            position: "absolute",
            top: "55%",
            left: "3%",
            fontSize: 20,
            opacity: 0.1,
          }}
        >
          🌿
        </span>
        <span
          className="leaf-4"
          style={{
            position: "absolute",
            top: "70%",
            right: "5%",
            fontSize: 28,
            opacity: 0.12,
          }}
        >
          🍃
        </span>
        <span
          className="leaf-5"
          style={{
            position: "absolute",
            top: "85%",
            left: "10%",
            fontSize: 18,
            opacity: 0.1,
          }}
        >
          🌿
        </span>
      </div>

      {/* ── NAVBAR ── */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          backgroundColor: scrolled
            ? "rgba(15,61,46,0.97)"
            : "rgba(15,61,46,0.75)",
          backdropFilter: "blur(12px)",
          borderBottom: scrolled ? "1px solid rgba(198,168,91,0.3)" : "none",
          transition: "all 0.3s ease",
          padding: "0 1.25rem",
        }}
      >
        <nav
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 68,
          }}
        >
          {/* Logo + Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              type="button"
              data-ocid="nav.open_modal_button"
              onClick={() => setLogoZoom(true)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
              title="View Logo"
            >
              <img
                src="/assets/generated/kishore-logo-transparent.dim_200x200.png"
                alt="Kishore Organic Soaps Logo"
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: "50%",
                  border: "2px solid #c6a85b",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </button>
            <div>
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "#f5f1e8",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  lineHeight: 1.2,
                }}
              >
                Kishore Organic Soaps
              </div>
              <div
                style={{
                  color: "#c6a85b",
                  fontSize: "0.7rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                Pure Luxury Herbal Soaps
              </div>
            </div>
          </div>

          {/* Nav links - desktop */}
          <div
            style={{ display: "flex", alignItems: "center", gap: 28 }}
            className="hidden md:flex"
          >
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link}
                href={`#${link.toLowerCase()}`}
                label={link}
              />
            ))}
          </div>

          {/* Cart button */}
          <button
            type="button"
            data-ocid="cart.open_modal_button"
            onClick={() => setCartOpen(true)}
            style={{
              position: "relative",
              background: "rgba(198,168,91,0.15)",
              border: "1px solid rgba(198,168,91,0.4)",
              borderRadius: 8,
              padding: "8px 14px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "#f5f1e8",
              transition: "background-color 0.2s",
            }}
          >
            <ShoppingCart size={18} />
            <span style={{ fontSize: "0.875rem" }}>Cart</span>
            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -8,
                  right: -8,
                  background: "#c6a85b",
                  color: "#0f3d2e",
                  borderRadius: "50%",
                  width: 20,
                  height: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                }}
              >
                {cartCount}
              </span>
            )}
          </button>
        </nav>
      </header>

      {/* ── LOGO ZOOM OVERLAY ── */}
      {logoZoom && (
        <dialog
          data-ocid="logo.modal"
          aria-label="Logo preview"
          open
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            backgroundColor: "rgba(15,61,46,0.92)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Backdrop click area */}
          <button
            type="button"
            data-ocid="logo.close_button"
            onClick={() => setLogoZoom(false)}
            aria-label="Close logo preview"
            style={{
              position: "absolute",
              inset: 0,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              width: "100%",
              height: "100%",
            }}
          />
          <div
            className="logo-zoom-animate"
            style={{ textAlign: "center", position: "relative", zIndex: 1 }}
          >
            <img
              src="/assets/generated/kishore-logo-transparent.dim_200x200.png"
              alt="Kishore Organic Soaps Logo"
              style={{
                width: 220,
                height: 220,
                borderRadius: "50%",
                border: "4px solid #c6a85b",
                boxShadow: "0 0 60px rgba(198,168,91,0.5)",
                objectFit: "cover",
              }}
            />
            <p
              style={{
                color: "#c6a85b",
                marginTop: 16,
                fontSize: "0.85rem",
                letterSpacing: "0.1em",
              }}
            >
              Tap anywhere to close
            </p>
          </div>
        </dialog>
      )}

      <main id="home" style={{ position: "relative", zIndex: 1 }}>
        {/* ── HERO ── */}
        <section
          style={{
            background:
              "linear-gradient(135deg, #0f3d2e 0%, #1a5c44 50%, #0f3d2e 100%)",
            paddingTop: 120,
            paddingBottom: 80,
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "radial-gradient(circle at 20% 50%, rgba(198,168,91,0.08) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(223,232,220,0.06) 0%, transparent 50%)",
            }}
          />

          <div
            style={{
              position: "relative",
              maxWidth: 720,
              margin: "0 auto",
              padding: "0 1.5rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 20,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div className="gold-divider" style={{ width: 60 }} />
                <Leaf size={18} style={{ color: "#c6a85b" }} />
                <div className="gold-divider" style={{ width: 60 }} />
              </div>
            </div>

            <h1
              className="fade-in-up"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 700,
                color: "#f5f1e8",
                lineHeight: 1.2,
                marginBottom: 16,
              }}
            >
              Pure Luxury
              <br />
              <em style={{ color: "#c6a85b", fontStyle: "italic" }}>
                Herbal Soaps
              </em>
            </h1>

            <p
              className="fade-in-up fade-in-up-delay-1"
              style={{
                color: "#dfe8dc",
                fontSize: "1.1rem",
                lineHeight: 1.7,
                marginBottom: 36,
                opacity: 0.9,
              }}
            >
              Handcrafted with ancient botanicals and pure natural ingredients.
              Experience the luxury of nature on your skin.
            </p>

            <div
              className="fade-in-up fade-in-up-delay-2"
              style={{
                display: "flex",
                gap: 16,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <a
                href="#products"
                data-ocid="hero.primary_button"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  backgroundColor: "#c6a85b",
                  color: "#0f3d2e",
                  padding: "12px 28px",
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  textDecoration: "none",
                  boxShadow: "0 4px 16px rgba(198,168,91,0.35)",
                }}
              >
                Shop Now
              </a>
              <a
                href="https://wa.me/918825950026"
                target="_blank"
                rel="noreferrer"
                data-ocid="hero.secondary_button"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  border: "1px solid rgba(198,168,91,0.5)",
                  color: "#f5f1e8",
                  padding: "12px 28px",
                  borderRadius: 8,
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  textDecoration: "none",
                }}
              >
                <MessageCircle size={16} /> WhatsApp Us
              </a>
            </div>

            <div
              className="fade-in-up fade-in-up-delay-3"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                justifyContent: "center",
                marginTop: 48,
              }}
            >
              {[
                "100% Natural",
                "Handcrafted",
                "No Chemicals",
                "Eco-Friendly",
              ].map((b) => (
                <span
                  key={b}
                  style={{
                    border: "1px solid rgba(198,168,91,0.35)",
                    color: "#c6a85b",
                    padding: "5px 14px",
                    borderRadius: 20,
                    fontSize: "0.78rem",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRODUCTS ── */}
        <section
          id="products"
          style={{ padding: "80px 1.25rem", maxWidth: 1280, margin: "0 auto" }}
        >
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p
              style={{
                color: "#c6a85b",
                fontSize: "0.78rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Our Collection
            </p>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                fontWeight: 700,
                color: "#0f3d2e",
                marginBottom: 16,
              }}
            >
              Our Premium Soaps
            </h2>
            <div
              className="gold-divider"
              style={{ width: 80, margin: "0 auto 16px" }}
            />
            <p
              style={{
                color: "#4a6b5c",
                maxWidth: 480,
                margin: "0 auto",
                lineHeight: 1.6,
              }}
            >
              Each bar is handcrafted with premium botanicals for a truly
              luxurious bathing experience.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: 24,
            }}
          >
            {PRODUCTS.map((product, idx) => (
              <ProductCard
                key={product.id}
                product={product}
                qty={getQty(product.id)}
                idx={idx}
                onQtyChange={(val) => setQty(product.id, val)}
                onAddToCart={() => addToCart(product)}
              />
            ))}
          </div>
        </section>

        {/* ── REVIEWS ── */}
        <section
          id="reviews"
          style={{ backgroundColor: "#0f3d2e", padding: "80px 1.25rem" }}
        >
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <p
                style={{
                  color: "#c6a85b",
                  fontSize: "0.78rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Happy Customers
              </p>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
                  fontWeight: 700,
                  color: "#f5f1e8",
                  marginBottom: 12,
                }}
              >
                What Our Customers Say
              </h2>
              <div
                className="gold-divider"
                style={{ width: 80, margin: "0 auto" }}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: 24,
              }}
            >
              {REVIEWS.map((review, idx) => (
                <div
                  key={review.id}
                  data-ocid={`reviews.item.${idx + 1}`}
                  style={{
                    backgroundColor: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(198,168,91,0.2)",
                    borderRadius: 12,
                    padding: 28,
                  }}
                >
                  <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star
                        key={`star-${review.id}-${i}`}
                        size={16}
                        fill="#c6a85b"
                        style={{ color: "#c6a85b" }}
                      />
                    ))}
                  </div>
                  <p
                    style={{
                      color: "#dfe8dc",
                      lineHeight: 1.6,
                      marginBottom: 16,
                      fontSize: "0.93rem",
                    }}
                  >
                    &ldquo;{review.text}&rdquo;
                  </p>
                  <div>
                    <div
                      style={{
                        color: "#c6a85b",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                      }}
                    >
                      {review.name}
                    </div>
                    <div
                      style={{
                        color: "rgba(223,232,220,0.6)",
                        fontSize: "0.78rem",
                        marginTop: 2,
                      }}
                    >
                      Purchased: {review.product}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust badges */}
            <div
              style={{
                marginTop: 64,
                display: "flex",
                flexWrap: "wrap",
                gap: 16,
                justifyContent: "center",
              }}
            >
              {TRUST_BADGES.map((b) => (
                <div
                  key={b.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    backgroundColor: "rgba(198,168,91,0.1)",
                    border: "1px solid rgba(198,168,91,0.25)",
                    borderRadius: 8,
                    padding: "10px 20px",
                  }}
                >
                  <span style={{ fontSize: 20 }}>{b.icon}</span>
                  <span style={{ color: "#dfe8dc", fontSize: "0.85rem" }}>
                    {b.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section
          id="contact"
          style={{
            padding: "80px 1.25rem",
            maxWidth: 1000,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: "#c6a85b",
              fontSize: "0.78rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Reach Us
          </p>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
              fontWeight: 700,
              color: "#0f3d2e",
              marginBottom: 12,
            }}
          >
            Get In Touch
          </h2>
          <div
            className="gold-divider"
            style={{ width: 80, margin: "0 auto 40px" }}
          />

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 24,
              justifyContent: "center",
            }}
          >
            <div
              style={{
                flex: "1 1 260px",
                maxWidth: 320,
                backgroundColor: "white",
                borderRadius: 12,
                padding: 28,
                boxShadow: "0 8px 32px rgba(15,61,46,0.1)",
                border: "1px solid rgba(198,168,91,0.2)",
              }}
            >
              <MapPin
                size={28}
                style={{ color: "#c6a85b", marginBottom: 12 }}
              />
              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 600,
                  marginBottom: 8,
                  color: "#0f3d2e",
                }}
              >
                Our Store
              </h3>
              <p
                style={{
                  color: "#4a6b5c",
                  lineHeight: 1.6,
                  fontSize: "0.9rem",
                }}
              >
                Kishore store, Nagamalai Puthukottai,
                <br />
                Melakuilkudi, near SBOA school,
                <br />
                Koilam Nagar
              </p>
            </div>
            <div
              style={{
                flex: "1 1 260px",
                maxWidth: 320,
                backgroundColor: "white",
                borderRadius: 12,
                padding: 28,
                boxShadow: "0 8px 32px rgba(15,61,46,0.1)",
                border: "1px solid rgba(198,168,91,0.2)",
              }}
            >
              <Phone size={28} style={{ color: "#c6a85b", marginBottom: 12 }} />
              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 600,
                  marginBottom: 8,
                  color: "#0f3d2e",
                }}
              >
                Call Us
              </h3>
              <a
                href="tel:+918825950026"
                style={{
                  color: "#0f3d2e",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                +91 88259 50026
              </a>
            </div>
            <div
              style={{
                flex: "1 1 260px",
                maxWidth: 320,
                backgroundColor: "white",
                borderRadius: 12,
                padding: 28,
                boxShadow: "0 8px 32px rgba(15,61,46,0.1)",
                border: "1px solid rgba(198,168,91,0.2)",
              }}
            >
              <MessageCircle
                size={28}
                style={{ color: "#25D366", marginBottom: 12 }}
              />
              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 600,
                  marginBottom: 8,
                  color: "#0f3d2e",
                }}
              >
                WhatsApp
              </h3>
              <a
                href="https://wa.me/918825950026"
                target="_blank"
                rel="noreferrer"
                data-ocid="contact.primary_button"
                style={{
                  display: "inline-block",
                  backgroundColor: "#25D366",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: 8,
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  marginTop: 4,
                }}
              >
                Chat Now
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer
        style={{
          backgroundColor: "#0a2e20",
          borderTop: "1px solid rgba(198,168,91,0.25)",
          padding: "48px 1.25rem 24px",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 40,
              justifyContent: "space-between",
              marginBottom: 40,
            }}
          >
            <div style={{ flex: "1 1 240px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                <img
                  src="/assets/generated/kishore-logo-transparent.dim_200x200.png"
                  alt="Logo"
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    border: "2px solid #c6a85b",
                    objectFit: "cover",
                  }}
                />
                <div>
                  <div
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      color: "#f5f1e8",
                      fontWeight: 600,
                    }}
                  >
                    Kishore Organic Soaps
                  </div>
                  <div
                    style={{
                      color: "#c6a85b",
                      fontSize: "0.7rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    Pure Luxury Herbal Soaps
                  </div>
                </div>
              </div>
              <p
                style={{
                  color: "rgba(223,232,220,0.7)",
                  fontSize: "0.875rem",
                  lineHeight: 1.6,
                  maxWidth: 280,
                }}
              >
                Handcrafted natural soaps made with love and the finest
                botanical ingredients.
              </p>
            </div>

            <div style={{ flex: "1 1 200px" }}>
              <h4
                style={{
                  color: "#c6a85b",
                  fontFamily: "'Playfair Display', serif",
                  marginBottom: 16,
                  fontWeight: 600,
                }}
              >
                Contact
              </h4>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 8,
                    color: "rgba(223,232,220,0.8)",
                    fontSize: "0.85rem",
                  }}
                >
                  <MapPin
                    size={14}
                    style={{ color: "#c6a85b", marginTop: 2, flexShrink: 0 }}
                  />
                  <span>
                    Kishore store, Nagamalai Puthukottai, Melakuilkudi, near
                    SBOA school, Koilam Nagar
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    color: "rgba(223,232,220,0.8)",
                    fontSize: "0.85rem",
                  }}
                >
                  <Phone size={14} style={{ color: "#c6a85b" }} />
                  <a
                    href="tel:+918825950026"
                    style={{
                      color: "rgba(223,232,220,0.8)",
                      textDecoration: "none",
                    }}
                  >
                    +91 88259 50026
                  </a>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    color: "rgba(223,232,220,0.8)",
                    fontSize: "0.85rem",
                  }}
                >
                  <MessageCircle size={14} style={{ color: "#25D366" }} />
                  <a
                    href="https://wa.me/918825950026"
                    style={{
                      color: "rgba(223,232,220,0.8)",
                      textDecoration: "none",
                    }}
                  >
                    WhatsApp: 8825950026
                  </a>
                </div>
              </div>
            </div>

            <div style={{ flex: "1 1 160px" }}>
              <h4
                style={{
                  color: "#c6a85b",
                  fontFamily: "'Playfair Display', serif",
                  marginBottom: 16,
                  fontWeight: 600,
                }}
              >
                Follow Us
              </h4>
              <div style={{ display: "flex", gap: 12 }}>
                <FooterSocial Icon={SiInstagram} href="#" label="Instagram" />
                <FooterSocial Icon={SiFacebook} href="#" label="Facebook" />
                <FooterSocial Icon={SiYoutube} href="#" label="YouTube" />
              </div>
            </div>
          </div>

          <div className="gold-divider" />
          <div
            style={{
              paddingTop: 20,
              textAlign: "center",
              color: "rgba(223,232,220,0.5)",
              fontSize: "0.8rem",
            }}
          >
            &copy; {new Date().getFullYear()} Kishore Organic Soaps. All rights
            reserved.
          </div>
        </div>
      </footer>

      {/* ── CART OVERLAY ── */}
      {cartOpen && (
        <div
          role="button"
          tabIndex={0}
          onClick={closeCart}
          onKeyDown={(e) => {
            if (e.key === "Escape") closeCart();
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            backgroundColor: "rgba(15,61,46,0.5)",
            backdropFilter: "blur(2px)",
          }}
        />
      )}

      {/* ── CART PANEL ── */}
      <div
        data-ocid="cart.panel"
        className={`cart-panel ${cartOpen ? "cart-panel-open" : "cart-panel-closed"}`}
        style={{
          position: "fixed",
          zIndex: 300,
          backgroundColor: "#fff",
          boxShadow: "-8px 0 40px rgba(15,61,46,0.15)",
          display: "flex",
          flexDirection: "column",
          right: 0,
          top: 0,
          bottom: 0,
          width: "min(420px, 100vw)",
        }}
      >
        <div
          style={{
            padding: "20px 20px 16px",
            borderBottom: "1px solid #e8e4dc",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#0f3d2e",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ShoppingCart size={20} style={{ color: "#c6a85b" }} />
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "#f5f1e8",
                fontWeight: 600,
                fontSize: "1.05rem",
              }}
            >
              Your Cart
            </span>
            {cartCount > 0 && (
              <span
                style={{
                  backgroundColor: "#c6a85b",
                  color: "#0f3d2e",
                  borderRadius: 20,
                  padding: "1px 10px",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                }}
              >
                {cartCount} items
              </span>
            )}
          </div>
          <button
            type="button"
            data-ocid="cart.close_button"
            onClick={() => setCartOpen(false)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#dfe8dc",
              padding: 4,
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Cart items - scrollable */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
          {cart.length === 0 ? (
            <div
              data-ocid="cart.empty_state"
              style={{ textAlign: "center", padding: "60px 20px" }}
            >
              <ShoppingCart
                size={48}
                style={{
                  color: "#dfe8dc",
                  margin: "0 auto 16px",
                  display: "block",
                }}
              />
              <p style={{ color: "#7a9a8a", fontSize: "0.9rem" }}>
                Your cart is empty
              </p>
              <p style={{ color: "#aab8b4", fontSize: "0.8rem", marginTop: 4 }}>
                Add some luxurious soaps!
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {cart.map((item, idx) => (
                <div
                  key={item.id}
                  data-ocid={`cart.item.${idx + 1}`}
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    padding: 12,
                    borderRadius: 8,
                    border: "1px solid #e8e4dc",
                    backgroundColor: "#fdfaf4",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: 64,
                      height: 64,
                      borderRadius: 6,
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 600,
                        color: "#0f3d2e",
                        fontSize: "0.88rem",
                        marginBottom: 4,
                        lineHeight: 1.3,
                      }}
                    >
                      {item.name}
                    </div>
                    <div
                      style={{
                        color: "#c6a85b",
                        fontWeight: 700,
                        fontSize: "0.9rem",
                      }}
                    >
                      &#8377;{item.price * item.qty}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginTop: 6,
                      }}
                    >
                      <button
                        type="button"
                        data-ocid={`cart.secondary_button.${idx + 1}`}
                        onClick={() => updateCartQty(item.id, -1)}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 6,
                          border: "1px solid #dfe8dc",
                          background: "white",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#0f3d2e",
                        }}
                      >
                        <Minus size={12} />
                      </button>
                      <span
                        style={{
                          fontSize: "0.88rem",
                          fontWeight: 600,
                          color: "#0f3d2e",
                          minWidth: 20,
                          textAlign: "center",
                        }}
                      >
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        data-ocid={`cart.primary_button.${idx + 1}`}
                        onClick={() => updateCartQty(item.id, 1)}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 6,
                          border: "1px solid #dfe8dc",
                          background: "white",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#0f3d2e",
                        }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    data-ocid={`cart.delete_button.${idx + 1}`}
                    onClick={() => removeFromCart(item.id)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#c0a090",
                      padding: 4,
                      flexShrink: 0,
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart footer */}
        {cart.length > 0 && (
          <div
            style={{
              padding: "16px 20px",
              borderTop: "1px solid #e8e4dc",
              backgroundColor: "#fdfaf4",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 14,
              }}
            >
              <span style={{ color: "#4a6b5c", fontWeight: 500 }}>Total:</span>
              <span
                style={{
                  color: "#0f3d2e",
                  fontWeight: 700,
                  fontSize: "1.15rem",
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                &#8377;{cartTotal}
              </span>
            </div>
            {!orderFormOpen && (
              <button
                type="button"
                data-ocid="cart.primary_button"
                onClick={() => setOrderFormOpen(true)}
                style={{
                  width: "100%",
                  padding: "13px",
                  backgroundColor: "#25D366",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <MessageCircle size={18} /> Place Order via WhatsApp
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── ORDER FORM MODAL ── */}
      {orderFormOpen && (
        <div
          data-ocid="order.modal"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 400,
            backgroundColor: "rgba(15,61,46,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: 16,
              width: "100%",
              maxWidth: 460,
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 24px 80px rgba(15,61,46,0.3)",
            }}
          >
            <div
              style={{
                padding: "20px 24px 16px",
                borderBottom: "1px solid #e8e4dc",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#0f3d2e",
                borderRadius: "16px 16px 0 0",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <MessageCircle size={20} style={{ color: "#25D366" }} />
                <span
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    color: "#f5f1e8",
                    fontWeight: 600,
                  }}
                >
                  Complete Your Order
                </span>
              </div>
              <button
                type="button"
                data-ocid="order.close_button"
                onClick={() => setOrderFormOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#dfe8dc",
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: "20px 24px" }}>
              {orderSent ? (
                <div
                  data-ocid="order.success_state"
                  style={{ textAlign: "center", padding: "40px 20px" }}
                >
                  <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                  <h3
                    style={{
                      color: "#0f3d2e",
                      fontFamily: "'Playfair Display', serif",
                      marginBottom: 8,
                    }}
                  >
                    Order Sent!
                  </h3>
                  <p style={{ color: "#4a6b5c", fontSize: "0.9rem" }}>
                    Your order has been sent to WhatsApp. We&apos;ll confirm
                    shortly.
                  </p>
                </div>
              ) : (
                <>
                  <div
                    style={{
                      marginBottom: 20,
                      padding: 16,
                      backgroundColor: "#f8f5ef",
                      borderRadius: 8,
                      border: "1px solid #e8e4dc",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 600,
                        color: "#0f3d2e",
                        marginBottom: 10,
                        fontSize: "0.9rem",
                      }}
                    >
                      Order Summary
                    </div>
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "0.85rem",
                          color: "#4a6b5c",
                          marginBottom: 4,
                        }}
                      >
                        <span>
                          {item.name} &times; {item.qty}
                        </span>
                        <span style={{ fontWeight: 600, color: "#0f3d2e" }}>
                          &#8377;{item.price * item.qty}
                        </span>
                      </div>
                    ))}
                    <div
                      style={{
                        borderTop: "1px solid #e8e4dc",
                        paddingTop: 8,
                        marginTop: 8,
                        display: "flex",
                        justifyContent: "space-between",
                        fontWeight: 700,
                        color: "#0f3d2e",
                      }}
                    >
                      <span>Total</span>
                      <span>&#8377;{cartTotal}</span>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                    }}
                  >
                    <div>
                      <label
                        htmlFor="order-name"
                        style={{
                          display: "block",
                          color: "#0f3d2e",
                          fontWeight: 500,
                          marginBottom: 6,
                          fontSize: "0.875rem",
                        }}
                      >
                        Full Name *
                      </label>
                      <input
                        id="order-name"
                        data-ocid="order.input"
                        type="text"
                        placeholder="Enter your name"
                        value={orderForm.name}
                        onChange={(e) =>
                          setOrderForm((p) => ({ ...p, name: e.target.value }))
                        }
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          border: `1px solid ${orderErrors.name ? "#e05252" : "#dfe8dc"}`,
                          borderRadius: 8,
                          fontSize: "0.9rem",
                          outline: "none",
                          fontFamily: "'DM Sans', sans-serif",
                          boxSizing: "border-box",
                        }}
                      />
                      {orderErrors.name && (
                        <span
                          data-ocid="order.error_state"
                          style={{
                            color: "#e05252",
                            fontSize: "0.78rem",
                            marginTop: 4,
                            display: "block",
                          }}
                        >
                          {orderErrors.name}
                        </span>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="order-phone"
                        style={{
                          display: "block",
                          color: "#0f3d2e",
                          fontWeight: 500,
                          marginBottom: 6,
                          fontSize: "0.875rem",
                        }}
                      >
                        Phone Number *
                      </label>
                      <input
                        id="order-phone"
                        data-ocid="order.input"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={orderForm.phone}
                        onChange={(e) =>
                          setOrderForm((p) => ({ ...p, phone: e.target.value }))
                        }
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          border: `1px solid ${orderErrors.phone ? "#e05252" : "#dfe8dc"}`,
                          borderRadius: 8,
                          fontSize: "0.9rem",
                          outline: "none",
                          fontFamily: "'DM Sans', sans-serif",
                          boxSizing: "border-box",
                        }}
                      />
                      {orderErrors.phone && (
                        <span
                          data-ocid="order.error_state"
                          style={{
                            color: "#e05252",
                            fontSize: "0.78rem",
                            marginTop: 4,
                            display: "block",
                          }}
                        >
                          {orderErrors.phone}
                        </span>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="order-address"
                        style={{
                          display: "block",
                          color: "#0f3d2e",
                          fontWeight: 500,
                          marginBottom: 6,
                          fontSize: "0.875rem",
                        }}
                      >
                        Delivery Address *
                      </label>
                      <textarea
                        id="order-address"
                        data-ocid="order.textarea"
                        placeholder="Enter your full delivery address"
                        value={orderForm.address}
                        onChange={(e) =>
                          setOrderForm((p) => ({
                            ...p,
                            address: e.target.value,
                          }))
                        }
                        rows={3}
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          border: `1px solid ${orderErrors.address ? "#e05252" : "#dfe8dc"}`,
                          borderRadius: 8,
                          fontSize: "0.9rem",
                          outline: "none",
                          fontFamily: "'DM Sans', sans-serif",
                          resize: "vertical",
                          boxSizing: "border-box",
                        }}
                      />
                      {orderErrors.address && (
                        <span
                          data-ocid="order.error_state"
                          style={{
                            color: "#e05252",
                            fontSize: "0.78rem",
                            marginTop: 4,
                            display: "block",
                          }}
                        >
                          {orderErrors.address}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      data-ocid="order.submit_button"
                      onClick={placeWhatsAppOrder}
                      style={{
                        width: "100%",
                        padding: "14px",
                        backgroundColor: "#25D366",
                        color: "white",
                        border: "none",
                        borderRadius: 8,
                        fontWeight: 700,
                        fontSize: "1rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        marginTop: 4,
                      }}
                    >
                      <MessageCircle size={18} /> Send Order via WhatsApp
                    </button>

                    <button
                      type="button"
                      data-ocid="order.cancel_button"
                      onClick={() => setOrderFormOpen(false)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        backgroundColor: "transparent",
                        color: "#4a6b5c",
                        border: "1px solid #dfe8dc",
                        borderRadius: 8,
                        fontWeight: 500,
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          type="button"
          data-ocid="page.button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 150,
            width: 44,
            height: 44,
            borderRadius: "50%",
            backgroundColor: "#0f3d2e",
            border: "1px solid #c6a85b",
            color: "#c6a85b",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 16px rgba(15,61,46,0.3)",
          }}
          title="Back to top"
        >
          <ChevronUp size={20} />
        </button>
      )}
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      data-ocid="nav.link"
      href={href}
      style={{
        color: "#dfe8dc",
        fontSize: "0.875rem",
        letterSpacing: "0.05em",
        textDecoration: "none",
      }}
    >
      {label}
    </a>
  );
}

function FooterSocial({
  Icon,
  href,
  label,
}: { Icon: React.ElementType; href: string; label: string }) {
  return (
    <a
      href={href}
      data-ocid="footer.link"
      aria-label={label}
      style={{
        width: 38,
        height: 38,
        borderRadius: 8,
        border: "1px solid rgba(198,168,91,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#dfe8dc",
        textDecoration: "none",
      }}
    >
      <Icon size={16} />
    </a>
  );
}

interface ProductCardProps {
  product: Product;
  qty: number;
  idx: number;
  onQtyChange: (val: number) => void;
  onAddToCart: () => void;
}

function ProductCard({
  product,
  qty,
  idx,
  onQtyChange,
  onAddToCart,
}: ProductCardProps) {
  return (
    <div
      className="product-card"
      data-ocid={`products.item.${idx + 1}`}
      style={{
        backgroundColor: "white",
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid #e8e4dc",
        boxShadow: "0 4px 16px rgba(15,61,46,0.06)",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        display: "flex",
        flexDirection: "column",
        opacity: 1,
        visibility: "visible",
      }}
    >
      {/* Image using padding-top trick for guaranteed rendering on all browsers */}
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingTop: "75%",
          overflow: "hidden",
          backgroundColor: "#f0ede4",
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>

      <div className="gold-divider" />

      <div
        style={{
          padding: "16px 16px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          flex: 1,
        }}
      >
        <h3
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 600,
            color: "#0f3d2e",
            fontSize: "0.95rem",
            lineHeight: 1.3,
            margin: 0,
          }}
        >
          {product.name}
        </h3>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{ color: "#c6a85b", fontWeight: 700, fontSize: "1.1rem" }}
          >
            &#8377;{product.price}
          </span>
          <span style={{ color: "#7a9a8a", fontSize: "0.75rem" }}>per bar</span>
        </div>

        {/* Quantity selector */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{ color: "#4a6b5c", fontSize: "0.8rem", fontWeight: 500 }}
          >
            Qty:
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #dfe8dc",
              borderRadius: 6,
              overflow: "hidden",
            }}
          >
            <button
              type="button"
              data-ocid={`products.secondary_button.${idx + 1}`}
              onClick={() => onQtyChange(qty - 1)}
              style={{
                width: 32,
                height: 32,
                border: "none",
                backgroundColor: "#f5f1e8",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#0f3d2e",
              }}
            >
              <Minus size={12} />
            </button>
            <span
              style={{
                width: 36,
                textAlign: "center",
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "#0f3d2e",
              }}
            >
              {qty}
            </span>
            <button
              type="button"
              data-ocid={`products.primary_button.${idx + 1}`}
              onClick={() => onQtyChange(qty + 1)}
              style={{
                width: 32,
                height: 32,
                border: "none",
                backgroundColor: "#f5f1e8",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#0f3d2e",
              }}
            >
              <Plus size={12} />
            </button>
          </div>
        </div>

        <button
          type="button"
          data-ocid={`products.primary_button.${idx + 1}`}
          onClick={onAddToCart}
          style={{
            marginTop: "auto",
            width: "100%",
            padding: "10px",
            backgroundColor: "#0f3d2e",
            color: "#f5f1e8",
            border: "none",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: "0.875rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <ShoppingCart size={14} /> Add to Cart
        </button>
      </div>
    </div>
  );
}
