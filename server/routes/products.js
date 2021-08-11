const {
    addProduct,
    getAllProducts,
    updateProductPicture,
    removePicture,
    editProduct,
    getAllCategories,
    createNewCategory,
    removeProduct,
    filterProductsBySearchValue,
} = require("../logic/products");
const upload = require("../middleware/image-upload");
const {authenticateToken} = require('../middleware/authenticateToken');
const {isAdmin} = require('../middleware/isAdmin');


const router = require("express").Router();

router.get("/categories", getAllCategories);
router.post("/categories",authenticateToken, isAdmin, createNewCategory);
router.get("/", getAllProducts);
router.post("/add",authenticateToken, isAdmin, addProduct);
router.post("/search",authenticateToken, filterProductsBySearchValue);
router.put("/update/:productId",authenticateToken, isAdmin, editProduct);
router.post("/upload-image/:productId",authenticateToken, isAdmin, upload.single("myImage"), updateProductPicture);
router.delete("/remove-image/:fileName",authenticateToken, isAdmin, removePicture);
router.delete("/remove-product/:productId",authenticateToken, isAdmin, removeProduct);

module.exports = router;
