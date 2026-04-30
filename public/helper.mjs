export function formatDate(date) {
  return date.toISOString().split("T")[0];
}
export function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
export function rgbToHex(rgb) {
  // Extract all numbers from the string using regex
  const parts = rgb.match(/\d+/g);

  if (!parts || parts.length < 3) return null;

  // Convert each part to hex, zero-pad, and join
  return (
    "#" +
    parts
      .slice(0, 3)
      .map((x) => {
        const hex = parseInt(x).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
      .toUpperCase()
  );
}
