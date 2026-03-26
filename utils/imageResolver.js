// src/utils/imageResolver.js

/**
 * Resolve image URL
 * - Nếu là link http → dùng luôn
 * - Nếu là path local (/images/...) → dùng luôn
 * - Nếu rỗng → fallback
 */
export function resolveImage(src, fallback = "/images/no-image.jpg") {
  if (!src) return fallback;

  // link online
  if (src.startsWith("http")) return src;

  // ảnh local trong public
  if (src.startsWith("/")) return src;

  return fallback;
}
