const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/userController');
const updateProfileRouter = express.Router();
const { updateProfile } = require('../controllers/userController');
const { isAuthenticated } = require('../middleware/authMiddleware');
updateProfileRouter.put('/users/profile', isAuthenticated, updateProfile);

module.exports = updateProfileRouter;

router.post('/register', registerUser);

module.exports = router;
const loginRouter = express.Router();
const { loginUser } = require('../controllers/userController');

loginRouter.post('/login', loginUser);

module.exports = loginRouter;

const forgetPasswordRouter = express.Router();
const { forgetPassword } = require('../controllers/userController');

forgetPasswordRouter.put('/forgetPassword', forgetPassword);

module.exports = forgetPasswordRouter;

const profileRouter = express.Router();
const { getUserProfile } = require('../controllers/userController');
const { authMiddleware } = require('../middleware/authMiddleware');

profileRouter.get('/profile', authMiddleware, getUserProfile);
profileRouter.put('/profile', authMiddleware, updateUserProfile);

module.exports = profileRouter;
const usersRouter = express.Router();
const { getUsers } = require('../controllers/userController');
const { isAdmin } = require('../middleware/authMiddleware');

usersRouter.get('/users', isAdmin, getUsers);

module.exports = usersRouter;
const userProfileRouter = express.Router();
const { getUserProfile: getOwnProfile, updateUserProfile: updateOwnProfile, getUserById, updateUserRole, deleteUser } = require('../controllers/userController');
const { isAuthenticated: isAuth, isAdmin: checkAdmin } = require('../middleware/authMiddleware');

userProfileRouter.get('/users/profile', isAuth, getOwnProfile);
userProfileRouter.put('/users/profile', isAuth, updateOwnProfile);
userProfileRouter.get('/users/:id', checkAdmin, getUserById);
userProfileRouter.put('/users/:id', checkAdmin, updateUserRole);
userProfileRouter.delete('/users/:id', checkAdmin, deleteUser);

module.exports = userProfileRouter;