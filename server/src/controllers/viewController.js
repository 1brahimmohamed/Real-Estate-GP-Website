const Property = require('../models/propertyModel');
const asyncErrorCatching = require('../utils/asyncErrorCatching');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const APIOperations = require("../utils/apiOperations");


const aboutUsSection = fs.readFileSync(path.join(__dirname, '../data/about.json'), 'utf-8');
const commonData = fs.readFileSync(path.join(__dirname, '../data/common.json'), 'utf-8');

const jsonAboutUsSection = JSON.parse(aboutUsSection);
const jsonCommonData = JSON.parse(commonData);


const getPopularProperties = async (sortQuan,limit) => {
    return Property.find().sort(sortQuan).limit(limit);
};



exports.getHomePage = asyncErrorCatching(async (req, res) => {

    const properties = await Property.find().sort('-createdAt').limit(6);
    let counter = 1;
    properties.forEach(property => {
        property.counter = counter++;
    });

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

exports.getPropertiesPage = asyncErrorCatching(async (req, res) => {

    req.query.limit = req.query.limit || 6;
    req.query.page = req.query.page || 1;
    req.query.sort = req.query.sort || '-createdAt';


    // Do the filtering, sorting, limiting and pagination
    const operations = new APIOperations(Property.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();


    // Execute the query
    const properties = await operations.query;
    const popularProperties = await getPopularProperties('ratingQuantity',3);

    let counter = 1;
    properties.forEach(property => {
        property.counter = counter++;
    });
    popularProperties.forEach(property => {
        property.counter = counter++;
    });

    let activePage = parseInt(req.query.page) || 1;
    let limitedPages = parseInt(req.query.limit) || 6;
    let selectedOption = req.query.sort || '';

    res
        .status(200)
        .render(
            'website/properties',
            {
                pageTitle: `${jsonCommonData.pageTitlesBase} | Properties`,
                commonData: jsonCommonData,
                properties,
                popularProperties,
                activePage,
                limitedPages,
                selectedOption,
            }
        );
})

exports.getPropertyPage = asyncErrorCatching(async (req, res) => {

    const property = await Property.findOne({slug: req.params.slug});
    const popularProperties = await getPopularProperties('ratingQuantity',3);

    let counter = 1;
    popularProperties.forEach(property => {
        property.counter = counter++;
    });

    res
        .status(200)
        .render(
            'website/property',
            {
                pageTitle: `${jsonCommonData.pageTitlesBase} | Property`,
                popularProperties,
                commonData: jsonCommonData,
                property,
            }
        );
});

exports.getSignupPage = asyncErrorCatching(async (req, res) => {
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

exports.getLoginPage = asyncErrorCatching(async (req, res) => {
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

exports.getContactPage = asyncErrorCatching(async (req, res) => {
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

exports.getGalleryPage = asyncErrorCatching(async (req, res) => {
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
