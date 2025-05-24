export const reduceHexAlpha = (hex: string, alpha: number): string => {
    // Ensure the hex starts with "#"
    hex = hex.replace(/^#/, "");

    // Extract RGB components
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    // Convert alpha (0 to 1) to a hex value (0 to 255)
    let a = Math.round(255 * (1-alpha))
        .toString(16)
        .padStart(2, "0"); // Ensure 2-digit hex format

    return `#${hex.substring(0, 6)}${a}`; // Return hex with reduced alpha
};

export const reduceHexIntensity = (hex: string, factor: number): string => {
    // Ensure the hex starts with "#"
    hex = hex.replace(/^#/, "");

    // Extract RGB components
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    // Optional: Extract alpha if present, otherwise default to FF (opaque)
    let a = hex.length === 8 ? hex.substring(6, 8) : "FF";

    // Reduce intensity by moving each component toward 128 (gray midpoint)
    // Factor is between 0 (no change) and 1 (fully gray)
    const midpoint = 128;
    r = Math.round(r + (midpoint - r) * factor);
    g = Math.round(g + (midpoint - g) * factor);
    b = Math.round(b + (midpoint - b) * factor);

    // Convert back to hex, ensuring 2-digit format
    const rHex = r.toString(16).padStart(2, "0");
    const gHex = g.toString(16).padStart(2, "0");
    const bHex = b.toString(16).padStart(2, "0");

    // Return hex with original or maintained alpha
    return `#${rHex}${gHex}${bHex}${a}`;
};

export function increaseHexIntensity(hex: string, factor: number): string {
  // Ensure hex starts with #
  hex = hex.replace(/^#/, "");
  
  // Convert 3-digit hex to 6-digit
  if (hex.length === 3) {
    hex = hex.split("").map(c => c + c).join("");
  }

  // Convert HEX to RGB
  let [r, g, b] = [
    parseInt(hex.substring(0, 2), 16),
    parseInt(hex.substring(2, 4), 16),
    parseInt(hex.substring(4, 6), 16)
  ];

  // Increase intensity by factor point ( 0 - 1)
  r = Math.min(255, Math.floor(r * (1 + factor)));
  g = Math.min(255, Math.floor(g * (1 + factor)));
  b = Math.min(255, Math.floor(b * (1 + factor)));

  // Convert back to HEX
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}