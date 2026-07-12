# Tsedio Bazar

A multi-category shopping site built with React, Vite, and Firebase Realtime Database. Includes a customer storefront, cart, dynamic UPI QR checkout (no payment gateway needed), order tracking, and an admin panel for managing products and verifying orders.

## Stack

- React 18 + Vite
- React Router v6
- Firebase Realtime Database (data) + Firebase Auth (admin login)
- Tailwind CSS
- UPI dynamic QR via `upi://pay` deep links, rendered as an image through a free QR API — no payment gateway or API key required

## 1. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com) and create a new project.
2. Enable **Realtime Database** (Build > Realtime Database > Create Database). Start in locked mode; you'll deploy the rules from this repo.
3. Enable **Authentication** (Build > Authentication > Sign-in method) and turn on **Email/Password**.
4. Go to Project Settings > General > Your apps, add a **Web app**, and copy the config values.
5. Copy `.env.example` to `.env` and paste your Firebase config values in, plus your real UPI ID:

   ```
   cp .env.example .env
   ```

6. Deploy `database.rules.json` to your Realtime Database (Realtime Database > Rules tab in the console — paste the contents of this file and publish).

## 2. Create Your Admin Account

The admin panel only allows in users listed under `/admins/{uid}` in the database.

1. In Firebase Console > Authentication > Users, click **Add user**, enter your admin email and password.
2. Copy the generated **User UID**.
3. In Realtime Database, manually add:

   ```
   admins/
     <paste-your-uid-here>: true
   ```

4. You can now log in at `/admin/login` with that email and password.

## 3. Install and Run

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` for the storefront and `http://localhost:5173/admin/login` for the admin panel.

## 4. Add Sample Products (optional)

To quickly populate a few sample products across categories (Electronics, Fashion, Grocery, Beauty, Home & Kitchen, Sports & Fitness):

```bash
npm run seed
```

Or just add products manually through the admin panel at `/admin/products/new`.

## 5. Product Images

The `image` field expects a direct image URL. Easiest free options:
- Upload to [Cloudinary](https://cloudinary.com) (you've used this before for other projects) and paste the resulting URL
- Or any direct-linkable image host

## 6. How Checkout Works (No Payment Gateway)

1. Customer fills in name, phone, and address at checkout.
2. A UPI QR code is generated client-side with the exact cart total pre-filled — no backend call needed:
   ```js
   upi://pay?pa=YOUR_UPI_ID&pn=Tsedio+Bazar&am=<total>&cu=INR&tn=Order+<id>
   ```
3. Customer scans and pays in their own UPI app, then optionally enters the UPI transaction ID and taps "I've Paid."
4. The order is written to `/orders/{orderId}` with `status: "pending"`.
5. You verify the payment manually (check your bank/UPI app) and update the status from the admin panel — Orders tab, tap an order to expand, then "Mark verified" / "Mark shipped" / "Mark delivered".

When you're ready for automated payments, swap the checkout section for Razorpay/Cashfree — the rest of the app (cart, orders, admin) doesn't need to change.

## 7. Order Tracking

Customers can bookmark their order confirmation link (`/order/<orderId>`), or go to `/track` and enter their order ID to look up status anytime — no login required.

## 8. Deployment

Recommended: [Vercel](https://vercel.com).

```bash
npm run build
```

Deploy the `dist/` folder, and set the same environment variables from your `.env` in your Vercel project settings (Settings > Environment Variables).

## Folder Structure

```
src/
  firebase.js              Firebase app initialization
  contexts/
    CartContext.jsx         Cart state (persisted to localStorage)
    AdminAuthContext.jsx    Firebase Auth + admin check
  components/
    Header.jsx, CategoryStrip.jsx, ProductCard.jsx,
    CartDrawer.jsx, ProtectedAdminRoute.jsx
  pages/
    Home.jsx                Storefront
    Checkout.jsx             Cart summary + UPI QR + order creation
    OrderConfirmation.jsx    Live order status receipt
    TrackOrder.jsx           Order ID lookup
    admin/
      AdminLogin.jsx
      AdminDashboard.jsx     Shell with Orders / Products tabs
      AdminOrders.jsx        List, filter, update order status
      AdminProducts.jsx      List, delete products
      AdminProductForm.jsx   Add / edit product
  utils/
    format.js                Currency, date, order ID helpers
    upi.js                   UPI URI + QR image builder
  data/
    seedProducts.js          One-time sample data script
```
