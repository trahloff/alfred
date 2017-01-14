'use strict';
const ibmdb = require('ibm_db');
const connString = require('../config').dashDB.credentials.dsn;


function sendQuery(query, params, cb) {
    ibmdb.open(connString, function(err, conn) {
        if (err) {} else {
            conn.query(query, params, function(err, tables) {
                if (!err) {
                    cb(null, tables);
                } else {
                    cb("Query:\n" + query + "\nhad an error and was aborted", null)
                }
                conn.close();
            });
        }
    });
}

function getAllCategories(cb) {
    sendQuery("SELECT CATEGORY FROM LINKS GROUP BY CATEGORY;", (err, result) => {
        if (!err) {
            let tmp = [];
            for (val of result) {
                tmp.push(val.CATEGORY);
            }
            cb(null, tmp);
        } else {
            cb(err, null);
        }
    });
}

function getLinksByCategory(category, cb) {
    let query = "";
    let params = [];
    if (category == 'all' || category == '' || category == 'undefined' || category == null) {
        query = "SELECT LINK_VALUE FROM LINKS;";
        params = null;
    } else {
        query = "SELECT LINK_VALUE FROM LINKS WHERE CATEGORY=?;";
        params = [category];
    }
    sendQuery(query, params, (err, result) => {
        if (!err) {
            let tmp = [];
            for (val of result) {
                tmp.push(val.LINK_VALUE);
            }
            cb(null, tmp);
        } else {
            cb(err, null);
        }
    });
}

function getAllLinks(cb) {
    sendQuery("SELECT LINK_VALUE FROM LINKS;", (err, result) => {
        if (!err) {
            let tmp = [];
            for (val of result) {
                tmp.push(val.LINK_VALUE);
            }
            cb(null, tmp);
        } else {
            cb(err, null);
        }
    });
}


exports.uploadNewLink = (link, category, cb) => {
    sendQuery("INSERT INTO LINKS VALUES (?,?)", [link, category], (err, result) => {
        if (!err) {
            cb(null, result);
        } else {
            cb(err, null);
        }
    });
}

exports.getAllCategoriesFormatted = (cb) => {
    getAllCategories((err, result) => {
        if (!err) {
            let tmp = 'I have these categories in my database:\n';
            for (val of result) {
                tmp += '   - ' + val + '\n';
            }
            cb(null, tmp);
        } else {
            cb(err, null);
        }
    });
}

exports.getLinksByCategoryFormatted = (category, cb) => {
    getLinksByCategory(category, (err, result) => {
        if (!err) {
            let tmp = 'I have these links for the category "' + category + '" in my database:\n';
            for (val of result) {
                tmp += '   - ' + val + '\n';
            }
            cb(null, tmp);
        } else {
            cb(err, null);
        }
    });
}
