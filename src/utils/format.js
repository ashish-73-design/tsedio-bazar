export function formatINR(amount) {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
}

export function formatDate(timestamp) {
  if (!timestamp) return "-";
  return new Date(timestamp).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function generateOrderId() {
  return "TB" + Date.now().toString().slice(-8) + Math.floor(Math.random() * 90 + 10);
}
