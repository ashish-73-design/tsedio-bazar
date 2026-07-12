// Run once to populate sample products: npm run seed
// Requires a .env file with your Firebase config already set up.
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set } from "firebase/database";
import dotenv from "dotenv";
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VITE_FIREBASE_DATABASE_URL,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const sampleProducts = [
  { name: "Wireless Bluetooth Earbuds", category: "Electronics", price: 899, mrp: 1499, stock: 40, rating: 4.5, image: "" },
  { name: "Smartphone Fast Charger 33W", category: "Electronics", price: 449, mrp: 699, stock: 60, rating: 4.3, image: "" },
  { name: "Men's Cotton Casual Shirt", category: "Fashion", price: 599, mrp: 999, stock: 25, rating: 4.4, image: "" },
  { name: "Women's Kurti Set", category: "Fashion", price: 799, mrp: 1299, stock: 20, rating: 4.6, image: "" },
  { name: "Basmati Rice 5kg", category: "Grocery", price: 549, mrp: 649, stock: 100, rating: 4.7, image: "" },
  { name: "Cold Pressed Mustard Oil 1L", category: "Grocery", price: 189, mrp: 229, stock: 80, rating: 4.5, image: "" },
  { name: "Herbal Face Wash 100ml", category: "Beauty", price: 199, mrp: 299, stock: 50, rating: 4.2, image: "" },
  { name: "Non-Stick Frying Pan", category: "Home & Kitchen", price: 449, mrp: 799, stock: 30, rating: 4.4, image: "" },
  { name: "Yoga Mat 6mm", category: "Sports & Fitness", price: 349, mrp: 549, stock: 45, rating: 4.6, image: "" },
];

async function seed() {
  for (const product of sampleProducts) {
    const newRef = push(ref(db, "products"));
    await set(newRef, { ...product, createdAt: Date.now() });
    console.log("Added:", product.name);
  }
  console.log("Seeding complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
