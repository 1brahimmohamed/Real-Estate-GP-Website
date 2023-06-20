/************************************************************************************
 *
 * File Name  : apiOperations.js
 * Description: This file contains the API operations class that we do on APIs when a request
 * is done.
 * Author     : Ibrahim Mohamed
 *
 ************************************************************************************/


class APIOperations {

    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }


    /**
     * @name filter
     * @description This function is used to filter the data that we get from the database based on the query string
     * that we get from the request.
     * @returns {APIOperations}
     */
    filter() {

        const queryObj = {...this.queryString};

        // Exclude the fields that we don't want to filter which are the page, sort, limit and fields
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr));

        return this;
    }

    /**
     * @name sort
     * @description This function is used to sort the data that we get from the database based on the query string
     * @returns {APIOperations}
     */
    sort() {

        // Check if the query string has a sort field, if it does then sort based on it, if not then sort by the date
        if (this.queryString.sort) {
            let sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }

    /**
     * @name limitFields
     * @description This function is used to limit the fields that we get from the database based on the query string
     * @returns {APIOperations}
     */
    limitFields() {

        // Check if the query string has a fields field, if it does then limit the fields based on it, if not then
        // limit the fields to not include the __v field

        if (this.queryString.fields) {
            let fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }
        return this;
    }


    /**
     * @name paginate
     * @description This function is used to divide the data that we get from the database into pages based on the
     * query string
     * @returns {APIOperations}
     */
    paginate() {

        // calculate the page number and the limit of the data that we want to get
        const page = parseInt(this.queryString.page) || 1;
        const limit = parseInt(this.queryString.limit) || 100;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}

// Export the class
module.exports = APIOperations;