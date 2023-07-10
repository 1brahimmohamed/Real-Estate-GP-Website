const express = require('express');
const viewController = require('../controllers/viewController');
const authenticationController = require('../controllers/authenticationController');

const router = express.Router();


router.use(authenticationController.isLoggedIn);

router.get('/', viewController.getHomePage);
router.get('/properties/', viewController.getPropertiesPage);
router.get('/properties/:slug', viewController.getPropertyPage);
router.get('/signup', viewController.getSignupPage);
router.get('/login', viewController.getLoginPage);
router.get('/contact', viewController.getContactPage);
router.get('/gallery', viewController.getGalleryPage);


router.get('/admin',
    authenticationController.protect,
    authenticationController.restrictTo('admin'),
    viewController.getAdminPage
);

module.exports = router;
