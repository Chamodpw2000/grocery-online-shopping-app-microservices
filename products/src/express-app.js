const express = require('express');
const cors  = require('cors');
const { products} = require('./api');
const HandleErrors = require('./utils/error-handler');
const { appEvent } = require('../../customer/src/api');


module.exports = async (app) => {

    app.use(express.json({ limit: '1mb'}));
    app.use(express.urlencoded({ extended: true, limit: '1mb'}));
    app.use(cors());
    app.use(express.static(__dirname + '/public'))

    //Listners
    appEvent(app);

    //api
    products(app);


    // error handling
    app.use(HandleErrors);
    
}