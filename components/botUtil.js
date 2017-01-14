function botUtil(b) {
    bot = b;
}

var bot;


botUtil.prototype.getAllUsers = (cb) => {
    bot.getUsers().then(function(data) {
        var users = {};
        for (val of data.members) {
            users[val.id] = val.name;
        }
        cb(users);
    });
}

botUtil.prototype.getAllChannels = (cb) => {
    bot.getChannels().then(function(data) {
        var channels = {};
        for (val of data.channels) {
            channels[val.id] = val.name;
        }
        cb(channels);
    });
}

botUtil.prototype.getAllGroups = (cb) => {
    bot.getGroups().then(function(data) {
        var channels = {};
        for (val of data.channels) {
            channels[val.id] = val.name;
        }
        cb(channels);
    });
}

module.exports = botUtil;
