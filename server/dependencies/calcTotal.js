const calcTotal = (products) => {
    let total = 0;
    for (let product of products) {
        total += product["price"];
    }
    return total;
};

module.exports = {calcTotal}