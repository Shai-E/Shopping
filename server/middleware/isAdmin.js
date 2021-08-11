const isAdmin = (req, res, next) => {
    if(!req.user.isAdmin) return res.sendStatus(403);
    next();
}

module.exports = {isAdmin};