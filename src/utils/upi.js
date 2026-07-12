const UPI_ID = import.meta.env.VITE_UPI_ID || "yourid@upi";
const PAYEE_NAME = import.meta.env.VITE_UPI_PAYEE_NAME || "Tsedio Bazar";

/**
 * Builds a UPI deep link with the amount pre-filled.
 * Opening this link on a phone launches the user's UPI app directly.
 */
export function buildUpiUri({ amount, note }) {
  const params = new URLSearchParams({
    pa: UPI_ID,
    pn: PAYEE_NAME,
    am: String(amount),
    cu: "INR",
    tn: note || "Order payment",
  });
  return `upi://pay?${params.toString()}`;
}

/**
 * Returns an image URL for a scannable QR code of the given UPI URI.
 * Uses a free public QR rendering endpoint — no API key needed.
 */
export function buildUpiQrImage(upiUri, size = 260) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=8&data=${encodeURIComponent(
    upiUri
  )}`;
}

export { UPI_ID, PAYEE_NAME };
