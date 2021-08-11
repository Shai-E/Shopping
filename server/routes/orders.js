const router = require('express').Router();
const {placeOrder, getLastOrderByUserId, countOrders, getInvalidDeliveryDates} = require("../logic/orders");
const {authenticateToken} = require('../middleware/authenticateToken');

router.post("/:userId",authenticateToken, placeOrder);
router.get("/last/:userId", authenticateToken, getLastOrderByUserId);
router.get("/count", countOrders);
router.get("/invalid-dates", getInvalidDeliveryDates);



module.exports = router;