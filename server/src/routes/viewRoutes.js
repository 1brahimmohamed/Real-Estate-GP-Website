const express = require('express');
const viewController = require('../controllers/viewController');

const router = express.Router();


router.get('/', viewController.getHomePage);
router.get('/properties/', viewController.getPropertiesPage);
router.get('/properties/:slug', viewController.getPropertyPage);
router.get('/signup', viewController.getSignupPage);
router.get('/login', viewController.getLoginPage);
router.get('/contact', viewController.getContactPage);
router.get('/gallery', viewController.getGalleryPage);


module.exports = router;
