const { execute } = require("../data-access/dal");

const activeCart = async (userId) => {
    const sql = `SELECT cart_items.id, 
    products.id AS productId, 
    carts.id AS cartId, 
    creation_date as date,
    products.name, 
    amount, 
    cart_items.size,
    price*amount AS price 
    FROM carts INNER JOIN cart_items 
    ON carts.id = cart_items.cart_id 
    INNER JOIN products 
    ON cart_items.product_id = products.id 
    WHERE user_id = ? AND is_active = 1`;
    const cartItems = await execute(sql, [userId])
    const picturesSql = `SELECT picture FROM product_pictures WHERE product_id = ?`;
    let newProds = [];
    for ( let p of cartItems) {
        const pics = await execute(picturesSql, [p.productId]);
        newProds.push({...p, picture: pics.reduce((r,i)=>[...r, i["picture"]], []) || undefined});
    }
    return newProds;
}

const getActiveCartId = async (userId) => {
    const sql = `SELECT carts.id AS cartId FROM carts WHERE user_id = ? AND is_active = 1`;
    const [cartId] = await execute(sql, [userId]);
    if(cartId["cartId"]) return cartId["cartId"];
}


const getUsersActiveCart = async (req, res) => {
    const userId = req.params.userId;
    try {
        const cartItems = await activeCart(userId);
        const cartId = await getActiveCartId(userId);
        res.json({cartItems, cartId});
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

const addProductToCart = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { cartId, productId, amount, size } = req.body;
        const sql = `INSERT INTO cart_items(cart_id, product_id, amount, size) VALUES(?,?,?,?)`;
        await execute(sql, [cartId, productId, amount, size]);
        const cartItems = await activeCart(userId);
        res.json({cartItems, cartId});
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

const increaseProductAmount = async (req, res) => {
    try{
        const userId = req.params.userId;
        const itemId = req.params.itemId;
        const sql = `UPDATE cart_items SET amount = amount+1 WHERE id = ?`;
        await execute(sql, [itemId]);
        const cartItems = await activeCart(userId);
        const cartId = await getActiveCartId(userId);
        res.json({cartItems, cartId});
    }catch(err) {
        console.log(err);
        res.status(500).send(err);
    }
}

const decreaseProductAmount = async (req, res) => {
    try{
        const userId = req.params.userId;
        const itemId = req.params.itemId;
        const sql = `UPDATE cart_items SET amount = amount-1 WHERE id = ?`;
        await execute(sql, [itemId]);
        const cartItems = await activeCart(userId);
        const cartId = await getActiveCartId(userId);
        res.json({cartItems, cartId});
    }catch(err) {
        console.log(err);
        res.status(500).send(err);
    }
}

const removeProductFromCart = async (req, res) => {
    try {
        const userId = req.params.userId;
        const itemId = req.params.itemId;
        const sql = `DELETE FROM cart_items WHERE id = ?`;
        await execute(sql, [itemId]);
        const cartItems = await activeCart(userId);
        const cartId = await getActiveCartId(userId);
        res.json({cartItems, cartId});
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

const removeAllProductsFromCart = async (req, res) => {
    try {
        const userId = req.params.userId;
        const cartId = await getActiveCartId(userId);
        const sql = `DELETE FROM cart_items WHERE cart_id = ?`;
        await execute(sql, [cartId]);
        const cartItems = await activeCart(userId);
        res.json({cartItems, cartId});
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

module.exports = {
    activeCart,
    getUsersActiveCart,
    addProductToCart,
    removeProductFromCart,
    removeAllProductsFromCart,
    getActiveCartId,
    increaseProductAmount,
    decreaseProductAmount
};
