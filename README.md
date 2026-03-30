# 🎂 Rising Cakes Mexicali

A modern, premium digital cake store built with React + Vite. Browse handcrafted cakes, add to cart, choose pickup or local delivery, and complete a simulated checkout — all with a polished bakery-themed UI.

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

### Store & Catalog
- **28 handcrafted cakes** across 8 categories (Birthday, Wedding, Custom, Kids, Elegant, Mini, Seasonal)
- Live search with autocomplete suggestions
- Sort by popularity, rating, price, or newest
- Category filter pills
- Product cards with hover animations, quick-add, and discount badges

### Shopping Cart
- Slide-out cart drawer with item management
- Per-item size selector, quantity controls, and special instructions
- Save for later functionality
- Undo on remove (4-second window)
- Promo code system (try: `WELCOME10`, `DULCE15`, `FREESHIP`)
- Mobile sticky cart bar

### Checkout & Payment
- 3-step checkout: Fulfillment → Review → Payment
- Store pickup with date/time selection
- Home delivery with Mexicali ZIP validation (21000–21960)
- 3 payment methods: Card (with brand detection), OXXO, Cash on Pickup
- Auto-formatting card inputs (number grouping, MM/YY expiry)
- Full-screen processing animation with 4-stage sequence
- **All payments are simulated** — no real transactions

### Order Confirmation
- Animated confetti celebration
- Full receipt with order number, payment details, and itemized breakdown
- Fulfillment timeline
- WhatsApp contact integration

### Design
- Premium typography: Cormorant Garamond (display) + Outfit (body)
- Refined warm color palette with cocoa, caramel, and vanilla tones
- Smooth CSS animations and micro-interactions
- Fully responsive: mobile, tablet, and desktop
- Decorative section dividers and visual hierarchy

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/rising-cakes-mexicali.git
cd rising-cakes-mexicali

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:3000`.

### Build for Production

```bash
npm run build
npm run preview   # Preview the production build
```

---

## 📁 Project Structure

```
rising-cakes-mexicali/
├── public/
│   └── favicon.svg          # Brand favicon
├── src/
│   ├── App.jsx              # Main application (all components)
│   ├── main.jsx             # React entry point
│   └── index.css            # Global styles, tokens, keyframes
├── index.html               # HTML shell
├── package.json
├── vite.config.js
├── .env.example             # Environment template
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🔧 Configuration

Copy `.env.example` to `.env` to configure:

| Variable | Description | Required |
|---|---|---|
| `VITE_STRIPE_PUBLIC_KEY` | Stripe publishable key | For real payments |
| `VITE_CONEKTA_PUBLIC_KEY` | Conekta public key (Mexico) | For real payments |
| `VITE_API_URL` | Backend API base URL | For real backend |
| `VITE_WHATSAPP_NUMBER` | WhatsApp Business number | Optional |

---

## 🛣️ Roadmap

- [ ] Split into multi-file component architecture
- [ ] Add React Router for URL-based navigation
- [ ] Backend API integration (Node.js/Express or Supabase)
- [ ] Real payment gateway (Stripe or Conekta)
- [ ] User authentication and order history
- [ ] Google Maps embed on contact page
- [ ] WhatsApp Business API integration
- [ ] Image optimization with lazy loading
- [ ] SEO meta tags and Open Graph
- [ ] Internationalization (ES/EN)
- [ ] Unit and E2E testing

---

## 🎨 Design System

### Colors
| Token | Hex | Usage |
|---|---|---|
| Cocoa | `#2A1810` | Primary text, dark backgrounds |
| Caramel | `#BE8E68` | Accent, CTAs, highlights |
| Vanilla | `#E4D1BC` | Borders, dividers |
| Linen | `#FAF7F3` | Page background |
| Rose | `#C8636C` | Sale prices, remove actions |
| Sage | `#4D7A5B` | Success states, availability |

### Typography
- **Display:** Cormorant Garamond (headings, prices, brand)
- **Body:** Outfit (text, buttons, labels)

---

## 📝 Payment Simulation

All payment processing is **simulated**. The `simulatePayment()` function in `App.jsx` is clearly marked and designed to be replaced with a real gateway:

```javascript
// Replace this function with:
// Stripe: stripe.confirmCardPayment(clientSecret, {...})
// Conekta: conekta.Token.create({...})
const simulatePayment = (paymentData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, transactionId: "...", orderId: "..." });
    }, 3200);
  });
};
```

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

**Made with 🤎 in Mexicali, Baja California**
