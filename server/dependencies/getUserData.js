const { execute } = require("../data-access/dal");


const getUserReceiptsById = async (userId) => {
    return await execute(`SELECT name, order_date as orderDate FROM receipts WHERE user_id = ?`, [userId]);
};

const getUserByEmailOrId = async (key, value) => {
    if(!key in ["id", "email"]) return false;
    let sql = `SELECT 
    users.id, 
    email, 
    first_name AS firstName, 
    last_name AS lastName, 
    password, 
    street, 
    city, 
    is_admin AS isAdmin, 
    picture 
    FROM users WHERE ${key} = ?`;
    const [user] = await execute(sql, [value]);
    if (!user) return false;
    const receipts = await getUserReceiptsById(user.id);
    return { ...user, receipts };
};

module.exports = {
    getUserByEmailOrId,
    getUserReceiptsById
}