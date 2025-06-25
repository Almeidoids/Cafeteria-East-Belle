import { total } from "./buy.js";
import { subQuantity } from "./buy.js";

test("Função soma dos produtos do carrinho", () => {
    const result = total([{price: 45}, {price: 72}, {price: 73}]);
    expect(Number(result)).toBe(190.00);
})

test("Função para subtrair a quantidade de produtos qwe há na loja", () => {
    const result = subQuantity({quantity: 69}, {amount: 25});
    expect(Number(result)).toBe(44);
})