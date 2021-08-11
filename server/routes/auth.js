const { login, isUserTaken, registerStep1, registerStep2, updateProfilePicture,updateUserByUserId, refresh, logout } = require('../logic/auth');
const upload = require('../middleware/profile-pic-upload')
const {authenticateToken} = require('../middleware/authenticateToken');

const router = require('express').Router();

router.post("/check/:value", isUserTaken);
router.post("/login", login);
router.post("/register/1", registerStep1);
router.patch("/register/2", registerStep2);
router.post("/upload-image/:userId", upload.single('myImage'), updateProfilePicture);
router.patch("/update-user/:userId", authenticateToken, updateUserByUserId);
router.get("/token", refresh);
router.delete("/logout/:userId", logout);

module.exports = router;