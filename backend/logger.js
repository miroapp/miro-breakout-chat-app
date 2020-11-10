"use strict"

module.exports.log = (message) => {
    console.log(`${new Date().toISOString()} ${message}`);
};

module.exports.warn = (message) => {
    console.warn(`${new Date().toISOString()} ${message}`);
};

module.exports.error = (err) => {
    console.error(`${new Date().toISOString()} ${err.message} ${err.stack}`)
};