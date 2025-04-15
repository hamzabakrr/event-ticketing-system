const express = require('express');
const { register, login } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);

module.exports = router;
const authRouter = express.Router();
const { loginUser, forgetPassword } = require('../controllers/authController');

authRouter.post('/login', loginUser);
authRouter.put('/forgetPassword', forgetPassword);

module.exports = authRouter;