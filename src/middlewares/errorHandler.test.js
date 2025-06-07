import { describe, it, expect, vi, beforeEach } from "vitest";
import { errorHandler } from "./errorHandler.js";

describe("errorHandler", () => {
  let req, res;
  beforeEach(() => {
    req = {};
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("responde 500 y mensaje genérico", () => {
    const err = new Error("Test error");
    errorHandler(err, req, res);
    expect(console.error).toHaveBeenCalledWith(err);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error interno del servidor",
    });
  });
});
