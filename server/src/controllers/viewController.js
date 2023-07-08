const Property = require('../models/propertyModel');
const asyncErrorCatching = require('../utils/asyncErrorCatching');
const fs = require('fs');
const path = require('path');


const aboutUsSection = fs.readFileSync(path.join(__dirname, '../data/about.json'), 'utf-8');
const commonData = fs.readFileSync(path.join(__dirname, '../data/common.json'), 'utf-8');

const jsonAboutUsSection = JSON.parse(aboutUsSection);
const jsonCommonData = JSON.parse(commonData);


exports.getHomePage = asyncErrorCatching(async(req, res) => {

    const properties = await Property.find();

    res
        .status(200)
        .render(
            'website/index',
            {
                pageTitle: `${jsonCommonData.pageTitlesBase} | Home`,
                commonData: jsonCommonData,
                properties,
                aboutUs: jsonAboutUsSection
            }
        );
});

exports.getPropertyPage = asyncErrorCatching(async(req, res) => {
    res
        .status(200)
        .render(
            'website/properties',
            {
                pageTitle: `${jsonCommonData.pageTitlesBase} | Property`,
                commonData: jsonCommonData,
            }
        );
})

exports.getSignupPage = asyncErrorCatching(async(req, res) => {
    res
        .status(200)
        .render(
            'admin/authentication-register',
            // 'website/register',
            {
                pageTitle: `${jsonCommonData.pageTitlesBase} | Signup`,
                commonData: jsonCommonData,
            }
        );
})

exports.getLoginPage = asyncErrorCatching(async(req, res) => {
    res
        .status(200)
        .render(
            // 'website/signin',
            'admin/authentication-login',
            {
                pageTitle: `${jsonCommonData.pageTitlesBase} | Login`,
                commonData: jsonCommonData,
            }
        );
});

exports.getContactPage = asyncErrorCatching(async(req, res) => {
    res
        .status(200)
        .render(
            'website/contact',
            {
                pageTitle: `${jsonCommonData.pageTitlesBase} | Contact Us`,
                commonData: jsonCommonData,
            }
        );
});

exports.getGalleryPage = asyncErrorCatching(async(req, res) => {
    res
        .status(200)
        .render(
            'website/gallery',
            {
                pageTitle: `${jsonCommonData.pageTitlesBase} | Gallery`,
                commonData: jsonCommonData,
            }
        );
});