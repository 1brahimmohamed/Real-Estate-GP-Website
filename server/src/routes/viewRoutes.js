const express = require('express');
const viewController = require('../controllers/viewController');
const authenticationController = require('../controllers/authenticationController');

const router = express.Router();


router.use(authenticationController.isLoggedIn);


router.get('/my-profile',
    authenticationController.protect,
    viewController.getMyProfilePage
);

router.get('/', viewController.getHomePage);
router.get('/contact', viewController.getContactPage);
router.get('/properties/', viewController.getPropertiesPage);
router.get('/properties/:slug', viewController.getPropertyPage);
router.get('/signup', viewController.getSignupPage);
router.get('/login', viewController.getLoginPage);


router.get('/admin',
    authenticationController.protect,
    authenticationController.restrictTo('admin'),
    viewController.getAdminPage
);

router.get('/admin/users',
    authenticationController.protect,
    authenticationController.restrictTo('admin'),
    viewController.getAdminUsersPage
);

router.get('/admin/users/:id',
    authenticationController.protect,
    authenticationController.restrictTo('admin'),
    viewController.getAdminUserPage
);

router.get('/admin/properties',
    authenticationController.protect,
    authenticationController.restrictTo('admin'),
    viewController.getAdminPropertiesPage
);

router.get('/admin/properties/:id',
    authenticationController.protect,
    authenticationController.restrictTo('admin'),
    viewController.getAdminPropertyPage
);

router.get('/admin/messages',
    authenticationController.protect,
    authenticationController.restrictTo('admin'),
    viewController.getAdminMessagesPage
);

router.get('/admin/messages/:id',
    authenticationController.protect,
    authenticationController.restrictTo('admin'),
    viewController.getAdminMessagePage
);

router.get('/admin/inquires',
    authenticationController.protect,
    authenticationController.restrictTo('admin'),
    viewController.getAdminInquriesPage
);

router.get('/admin/inquires/:id',
    authenticationController.protect,
    authenticationController.restrictTo('admin'),
    viewController.getAdminInquiryPage
);


module.exports = router;
