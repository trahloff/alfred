"use strict";
const fs = require('fs');
const dashDbUtil = require('./dashDbUtil');

function insertNewLink(category, link) {
  dashDbUtil.uploadNewLink(link, category, r => console.log(r));
}

exports.updateLinkCollection = (text) => {
    let link = text.match(new RegExp("http(.*)>"))[0].replace(">", "").replace(/ *|[^)]*> */g, "");
    let category = text.match(new RegExp(/\[([^}]+)\]/))[0].replace("[", "").replace("]", "").toLowerCase();
    insertNewLink(category, link);
}
