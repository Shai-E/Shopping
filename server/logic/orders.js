const { execute } = require("../data-access/dal");
const { activeCart, getActiveCartId } = require("./carts");
const { getUserByEmailOrId, getUserReceiptsById } = require('../dependencies/getUserData');
const { calcTotal } = require('../dependencies/calcTotal');
const { createPdfReceipt } = require("../middleware/create-pdf");
const {stripUserFromIrrelevantInfoForToken : userForToken, setUpTokens} = require('../dependencies/setUpToken')


const createCart = async (userId) => {
    const sql = `INSERT INTO carts(user_id) VALUES (?)`;
    return await execute(sql, [userId]);
};

const deactivateOldCarts = async (userId) => {
    const sql = `UPDATE carts SET is_active = 0 WHERE user_id = ?`;
    return await execute(sql, [userId]);
};

const setNewActiveCart = async (userId) => {
    await deactivateOldCarts(userId);
    return await createCart(userId);
};

const isDeliveryDateValid = async (date, max) => {
    const orders = await execute(`SELECT * FROM orders WHERE delivery_date = ?`, [date]);
    return orders.length < max;
};

const getInvalidDeliveryDates = async (req, res) => {
    try{
        const orderDatesArr = await execute(`SELECT count(delivery_date) as count, delivery_date as delivaryDate FROM orders GROUP BY delivery_date`);
        const forbiddenDates = orderDatesArr.reduce((results, orderDate) => orderDate.count >= 3 ?[...results, orderDate.delivaryDate.toLocaleDateString('fr-CA', { year: 'numeric', month: '2-digit', day: '2-digit' })] : results,[]);
        res.json(forbiddenDates)
    }catch(err) {
        console.log(err);
        res.status(500).send(err);
    }
}

const generateReceiptData = async (userId, reqBody) => {
    const products = await activeCart(userId);
    const total = calcTotal(products);
    const user = await getUserByEmailOrId("id", userId);
    user.city = reqBody.city || user.city;
    user.street = reqBody.street || user.street;
    const payment = reqBody.card;
    return {products, user, payment, total}
}

const startFreshCart = async (userId) => {
    await setNewActiveCart(userId);
    return await getActiveCartId(userId);
}

const placeOrder = async (req, res) => {
    const userId = req.params.userId;
    const deliveryDate = req.body.date;
    if (!(await isDeliveryDateValid(deliveryDate, 3)))
        return res.status(400).send("Too many deliveries that day. Choose a different date.");
    try {
        const {products, user, payment, total} = await generateReceiptData(userId, req.body);
        const fileName = await createPdfReceipt(products, user, payment, total);
        const cartId = await startFreshCart(userId);
        //place order
        await execute(
            `INSERT INTO orders (user_id, cart_id, total, delivery_city, delivery_street, delivery_date, payment) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [userId, cartId, total, user.city, user.street, deliveryDate, payment]
        );
        await execute(`INSERT INTO receipts (user_id, name, order_date) values (?,?,?)`, [
            userId,
            fileName,
            new Date(),
        ]);
        const receipts = await getUserReceiptsById(userId);
        const tokenUserInfo = userForToken(user); // id, email, isAdmin
        const accessToken = await setUpTokens(tokenUserInfo, res);
        console.log("order")
        res.json( { fileName, user: {...user, password: null, receipts, accessToken} } );
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

const getLastOrderByUserId = async (req, res) => {
    const userId = req.params.userId;
    try {
        const sql = `SELECT user_id AS userId, cart_id AS cartId, total, delivery_city AS city, delivery_street AS street, delivery_date AS deliveryDate, order_date AS orderDate FROM orders WHERE user_id = ? ORDER BY order_date DESC`;
        const order = await execute(sql, [userId]);
        res.json(order);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

const countOrders = async (req, res) => {
    try {
        const sql = `SELECT count(id) AS orders FROM orders`;
        const [{ orders }] = await execute(sql);
        res.json(orders);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

module.exports = {
    createCart,
    placeOrder,
    getLastOrderByUserId,
    countOrders,
    getInvalidDeliveryDates
};
