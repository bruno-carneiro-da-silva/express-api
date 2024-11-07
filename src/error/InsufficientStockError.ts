export class InsufficientStockError extends Error {
  constructor(productId: string) {
    super(`Quantidade insuficiente no estoque para o produto ${productId}`);
    this.name = "InsufficientStockError";
  }
}
