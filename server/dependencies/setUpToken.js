require("dotenv").config();
const { execute } = require("../data-access/dal");
const jwt = require("jsonwebtoken");


const stripUserFromIrrelevantInfoForToken = (user) => {
    const newUser = { ...user };
    delete newUser.password;
    delete newUser.firstName;
    delete newUser.lastName;
    delete newUser.street;
    delete newUser.city;
    delete newUser.picture;
    delete newUser.receipts;
    return newUser;
};

const processToken = async (res, token, userId) => {
    try{
        //delete old tokens from db
        await execute(`DELETE FROM tokens WHERE user_id = ?`, [userId]);
        // remove old cookie
        res.clearCookie("jid");
        // save Refresh Token To Db
        await execute(`INSERT INTO tokens(token, user_id) VALUES(?, ?)`, [token, userId]);
        // set new cookie
        res.cookie("jid", token, { httpOnly: true });
    }
    catch(err){
        console.log(err)
    }
};

const generateAccessToken = (tokenUserInfo) => {
    return jwt.sign(tokenUserInfo, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};

const generateRefreshToken = (tokenUserInfo) => {
    return jwt.sign(tokenUserInfo, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

const setUpTokens = async (tokenUserInfo, res) => {
    const accessToken = generateAccessToken(tokenUserInfo);
    const refreshToken = generateRefreshToken(tokenUserInfo);
    await processToken(res, refreshToken, tokenUserInfo.id);
    return accessToken
}

module.exports = {
    stripUserFromIrrelevantInfoForToken,
    setUpTokens
}