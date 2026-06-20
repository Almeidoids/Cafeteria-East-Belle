export function total(cart) {
    let sum = 0;
    cart.forEach(function (item) {
        sum = (Number(sum) + Number(item.price)).toFixed(2);
    })

    return sum;
}


export function subQuantity(product, value) {
    let quantity = Number(product.quantity);
    console.log(quantity);
    quantity = quantity - value.amount;
    console.log(quantity);
    return quantity;
}