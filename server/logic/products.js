const {execute} = require("../data-access/dal");

const getAllCategories = async (_req, res) => {
    try{
        const sql = `SELECT id, category FROM categories`;
        const categories = await execute(sql);
        res.json(categories);
    }catch(err) {
        console.log(err);
        res.status(500).send(err);
    }
}

const createNewCategory = async (req, res) => {
    const category = req.body.category;
    try {
        const sql = `INSERT INTO categories(category) VALUES (?)`;
        await execute(sql, [category]);
        const getCategoriesSql = `SELECT id, category FROM categories`;
        const categories = await execute(getCategoriesSql);
        res.json(categories);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
}

const addPicturesToProducts = async (products) => {
    const picturesSql = `SELECT picture FROM product_pictures WHERE product_id = ?`;
    let newProds = [];
    for ( let p of products) {
        const pics = await execute(picturesSql, [p.id]);
        newProds.push({...p, picture: pics.reduce((r,i)=>[...r, i["picture"]], []) || undefined});
    }
    return newProds;
}

const getProductsWithPictures = async () => {
    
    const productsSql = `SELECT products.id, name, price, categories.category FROM products INNER JOIN categories ON products.category_id = categories.id`;
    let products = await execute(productsSql);
    return await addPicturesToProducts(products);

}

const getAllProducts = async (_req, res) => {
    try {
        res.json(await getProductsWithPictures());
    } catch(err) {
        console.log(err);
        res.status(500).send(err);
    }
}

const addProduct = async (req, res) => {
    try {
        const { categoryId, name, price } = req.body;
        const params = [categoryId, name, price]
        const sql = `INSERT INTO products (category_id, name, price) VALUES(?,?,?)`
        await execute(sql, params);
        res.json(await getProductsWithPictures());
    } catch(err) {
        console.log(err);
        res.status(500).send(err);
    }
}

const updateProductPicture = async (req, res) => {
    const productId = req.params.productId;
    const sql = `INSERT INTO product_pictures(picture, product_id) VALUES(?,?)`;
    try{
        await execute(sql, [req.fileName,productId])
        res.json(await getProductsWithPictures());
    } catch(err) {
        res.status(500).send(err);
    }
}

const removePicture = async (req, res) => {
    try{
        const fileName = req.params.fileName;
        const sql = `DELETE FROM product_pictures WHERE picture = ?`;
        await execute(sql, [fileName])
        res.json(await getProductsWithPictures());
    }catch(err) {
        res.status(500).send(err);
    }
}

const editProduct = async (req, res) => {
    const productId = req.params.productId;
    const {name, price, categoryId} = req.body;
    const sql = `UPDATE products SET name = ?, price = ?, category_id = ? WHERE id = ?`;
    try{
        await execute(sql, [name, price, categoryId ,productId])
        res.json(await getProductsWithPictures());
    } catch(err) {
        res.status(500).send(err);
    }
}

const removeProduct = async (req, res) => {
    const productId = req.params.productId;
    const sql = `DELETE FROM products WHERE id = ?`
    try{
        await execute(sql, [productId]);
        res.json(await getProductsWithPictures());
    }catch(err) {
        console.log(err)
        res.status(500).send(err);
    }
}

const filterProductsBySearchValue = async (req, res) => {
    const searchKey = `%${req.body.searchKey}%`;
    try {
        const productsSql = `SELECT products.id, name, price, categories.category FROM products INNER JOIN categories ON products.category_id = categories.id WHERE products.name LIKE ?`;
        let products = await execute(productsSql, [searchKey]);
        res.json(await addPicturesToProducts(products));
    } catch(err) {
        console.log(err)
        res.status(500).send(err);
    }

}

module.exports = {
    getAllProducts,
    addProduct,
    updateProductPicture,
    removePicture,
    editProduct,
    getAllCategories,
    createNewCategory,
    removeProduct,
    filterProductsBySearchValue
}