require("dotenv").config();
const { execute } = require("../data-access/dal");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createCart } = require("../logic/orders");
const { getUserByEmailOrId } = require("../dependencies/getUserData");
const { stripUserFromIrrelevantInfoForToken: userForToken, setUpTokens } = require("../dependencies/setUpToken");

const isUserTaken = async (req, res) => {
    const key = req.params.value;
    if (!req.body[key]) return res.status(400).send("Missing value to check");
    if (!["email", "id"].includes(key)) {console.log(key); return res.status(400).send("No id or email sent to verify")};
    const sql = `SELECT * FROM users WHERE ${key} = ?`;
    const [user] = await execute(sql, [req.body[key]]);
    if (user) return res.json(`${key.toUpperCase()}_TAKEN`);
    return res.json(`${key.toUpperCase()}_OK`);
};

const registerStep1 = async (req, res) => {
    const { id, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const params = [id, email, hashedPassword];
    const sql = `INSERT INTO users (id, email, password) VALUES (?,?,?)`;
    try {
        await execute(sql, params);
        await createCart(id);
        res.send({ id });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

const registerStep2 = async (req, res) => {
    const { id, city, street, firstName, lastName } = req.body;
    const params = [city, street, firstName, lastName, id];
    const sql = `UPDATE users SET city = ?, street = ?, first_name = ?, last_name = ? WHERE id = ?`;
    try {
        await execute(sql, params);
        res.send({ id });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

const updateProfilePicture = async (req, res) => {
    const userId = req.params.userId;
    const sql = `UPDATE users SET picture = ? WHERE id = ?`;
    try {
        await execute(sql, [req.fileName, userId]);
        res.json({ fileName: req.fileName });
    } catch (err) {
        res.status(500).send(err);
    }
};

const isPasswordValid = async (user, password) => {
    return await bcrypt.compare(password, user.password);
};

const refresh = async (req, res) => {
    const refreshToken = req.cookies.jid;
    if (!refreshToken) return res.sendStatus(401);
    const doesRefreshTokenExistInDb = await execute(`SELECT * FROM tokens WHERE token = ?`, [refreshToken]);
    if (doesRefreshTokenExistInDb.length === 0) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
        if (err) return res.sendStatus(403);
        const tokenUserInfo = { id: user.id, email: user.email, isAdmin: user.isAdmin };
        const accessToken = await setUpTokens(tokenUserInfo, res);
        res.json({ accessToken });
    });
};

const logout = async (req, res) => {
    const token = req.cookies.jid;
    token && (await execute(`DELETE FROM tokens WHERE token = ?`, [token]));
    res.clearCookie("jid");
    res.sendStatus(204);
};

const login = async (req, res) => {
    //authentication
    const { email, password } = req.body;

    const user = await getUserByEmailOrId("email", email);
    if (!user) {
        res.status(403).json({ message: "User does not exist" });
        return;
    }

    if (!(await isPasswordValid(user, password)))
        return res.status(403).json({ message: "Wrong username or password" });

    // create token
    const tokenUserInfo = userForToken(user);
    const accessToken = await setUpTokens(tokenUserInfo, res);

    res.json({ ...user, password: null, accessToken });
};

const updateUserByUserId = async (req, res) => {
    const { city, street, firstName, lastName, password, email, oldPassword } = req.body;
    const userId = req.params.userId;
    let user = await getUserByEmailOrId("id", userId);
    const params = [];
    try {
        let sql = `UPDATE users SET`;
        if (city) {
            sql += ` city = ?,`;
            params.push(city);
        }
        if (street) {
            sql += ` street = ?,`;
            params.push(street);
        }
        if (firstName) {
            sql += ` first_name = ?,`;
            params.push(firstName);
        }
        if (lastName) {
            sql += ` last_name = ?,`;
            params.push(lastName);
        }
        if (email) {
            const exists = await getUserByEmailOrId("email", email);
            if (exists && exists.id !== userId) {
                return res.status(400).json({ message: "Email is already in use." });
            }
            sql += ` email = ?,`;
            params.push(email);
        }
        if (password) {
            if (!oldPassword) return res.status(400).json({ message: "Missing old password for verification." });
            const isOldPassValid = await isPasswordValid(user, oldPassword);
            if (!isOldPassValid) return res.status(400).json({ message: "Wrong password." });
            sql += ` password = ?,`;
            const hashedPassword = await bcrypt.hash(password, 10);
            params.push(hashedPassword);
        }
        sql = sql.substr(0, sql.length - 1);
        sql += ` WHERE id = ?`;
        params.push(userId);
        await execute(sql, params);
        user = await getUserByEmailOrId("id", userId);
        const tokenUserInfo = userForToken(user);
        const accessToken = await setUpTokens(tokenUserInfo, res);
        res.json({ ...user, password: null, accessToken });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

module.exports = {
    isUserTaken,
    registerStep1,
    registerStep2,
    updateProfilePicture,
    login,
    updateUserByUserId,
    refresh,
    logout,
};
