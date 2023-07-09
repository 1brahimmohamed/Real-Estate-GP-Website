const Property = require('../models/propertyModel');
const asyncErrorCatching = require('../utils/asyncErrorCatching');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const APIOperations = require("../utils/apiOperations");


const aboutUsSection = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/about.json'), 'utf-8'));
const commonData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/common.json'), 'utf-8'));
const contactData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/contact.json'), 'utf-8'));

// const aboutUsSection = JSON.parse(aboutUsSection);
// const commonData = JSON.parse(commonData);


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
                pageTitle: `${commonData.pageTitlesBase} | Home`,
                commonData,
                properties,
                aboutUs: aboutUsSection
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
                pageTitle: `${commonData.pageTitlesBase} | Properties`,
                commonData,
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
                pageTitle: `${commonData.pageTitlesBase} | Property`,
                commonData,
                popularProperties,
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
                pageTitle: `${commonData.pageTitlesBase} | Signup`,
                commonData,
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
                pageTitle: `${commonData.pageTitlesBase} | Login`,
                commonData,
            }
        );
});

exports.getContactPage = asyncErrorCatching(async (req, res) => {
    res
        .status(200)
        .render(
            'website/contact',
            {
                pageTitle: `${commonData.pageTitlesBase} | Contact Us`,
                commonData,
                contact: contactData,
            }
        );
});

exports.getGalleryPage = asyncErrorCatching(async (req, res) => {
    res
        .status(200)
        .render(
            'website/gallery',
            {
                pageTitle: `${commonData.pageTitlesBase} | Gallery`,
                commonData: commonData,
            }
        );
});
