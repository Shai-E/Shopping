const router = require("express").Router();
const {
    getUsersActiveCart,
    addProductToCart,
    removeProductFromCart,
    increaseProductAmount,
    decreaseProductAmount,
    removeAllProductsFromCart,
} = require("../logic/carts");
const {authenticateToken} = require('../middleware/authenticateToken');

router.get("/:userId",authenticateToken, getUsersActiveCart);
router.post("/add-item/:userId",authenticateToken, addProductToCart);
router.patch("/update-amount/increase/:userId/:itemId",authenticateToken, increaseProductAmount);
router.patch("/update-amount/decrease/:userId/:itemId",authenticateToken, decreaseProductAmount);
router.delete("/remove-item/:userId/:itemId",authenticateToken, removeProductFromCart);
router.delete("/remove-all-items/:userId",authenticateToken, removeAllProductsFromCart);

module.exports = router;
