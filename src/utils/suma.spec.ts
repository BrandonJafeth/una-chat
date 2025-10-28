import { describe, it, expect } from "vitest";
import { suma } from "./suma";

describe("suma()", () => {
  it("Dado dos números, cuando se suman, entonces retorna el total", () => {
    // Given
    const a = 2, b = 3;
    // When
    const resultado = suma(a, b);
    // Then
    expect(resultado).toBe(5);
  });
});
