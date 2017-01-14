'use strict';

let bot;

function botUtil(b) {
    bot = b;
}

//TODO write one function 'getSlackInfo' that takes a parameter 'Users' or 'Channels'
botUtil.prototype.getAllUsers = cb => {
    bot
        .getUsers()
        .then(data => {
            let users = {};
            for (let val of data.members) {
                users[val.id] = val.name;
            }
            cb(users);
        });
}

botUtil.prototype.getAllChannels = cb => {
    bot
        .getChannels()
        .then(data => {
            let channels = {};
            for (let val of data.channels) {
                channels[val.id] = val.name;
            }
            cb(channels);
        });
}


module.exports = botUtil;
