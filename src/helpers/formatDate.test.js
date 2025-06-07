import { describe, it, expect } from "vitest";
import { formatDateForMySQL } from "./formatDate.js";

describe("formatDateForMySQL", () => {
  it("devuelve null si no se pasa fecha", () => {
    expect(formatDateForMySQL()).toBeNull();
    expect(formatDateForMySQL(null)).toBeNull();
  });

  it("convierte un objeto Date al formato MySQL", () => {
    const date = new Date("2025-06-07T15:30:45Z");
    expect(formatDateForMySQL(date)).toBe("2025-06-07 15:30:45");
  });

  it("convierte un string ISO al formato MySQL", () => {
    expect(formatDateForMySQL("2025-06-07T10:20:30Z")).toBe(
      "2025-06-07 10:20:30"
    );
  });

  it("devuelve el formato correcto para fechas locales", () => {
    // Fecha local: 2025-06-07 12:00:00
    const date = new Date(Date.UTC(2025, 5, 7, 12, 0, 0));
    expect(formatDateForMySQL(date)).toBe("2025-06-07 12:00:00");
  });
});
