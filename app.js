'use strict';
const config = require('./config');
const SlackBot = require('slackbots');
const parserUtil = require('./components/parserUtil');
const dashDbUtil = require('./components/dashDbUtil');
const animals = config.animals;
const sa = config.still_alive_lyrics;
const bot = new SlackBot({
    token: config.token,
    name: config.name
});
const botUtil = new(require('./components/botUtil'))(bot);


let users = {};
let params = {
    'slackbot': false,
    'icon_emoji': ':' + animals[Math.floor(Math.random() * (animals.length - 1) + 1)] + ':'
};


bot
    .on('start', () => {
        botUtil.getAllUsers(r => users = r); // this static mapping is needed because of the fkn stupid chat.postMessage API
        bot.postMessageToUser('trahloff', 'I am alive!!', params);
    })
    .on('team_join', () => {
        botUtil.getAllUsers(r => users = r); // srsly, what the fuck is wrong with you guys?!
    })
    .on('message', data => {
        if (data.type == 'message' && data.subtype != 'bot_message') {
            let userTmp = users[data.user];
            let input = data.text.toLowerCase();

            if (input.charAt(0) == "[" && input.includes(']') && input.includes('http')) {
                parserUtil.updateLinkCollection(input);
            } else if (input.includes('categories')) {
                bot.postMessageToUser(userTmp, 'You asked for all categories in my database, please give me a few seconds.', params);
                dashDbUtil.getAllCategoriesFormatted((err, result) => {
                    if (!err) {
                        bot.postMessageToUser(userTmp, result, params);

                    } else {
                        bot.postMessageToUser(userTmp, 'Oops. I fucked up. Or the DB fucked up. Well, somebody or something fucked up, sorry.', params);
                    }
                });
            } else if (input.includes('category')) {
                let categoryFormatted = input.replace('category', '').replace(':', '').replace(' ', '');
                bot.postMessageToUser(userTmp, 'You asked for all links of the category: ' + categoryFormatted + ', please give me a few seconds.', params);
                dashDbUtil.getLinksByCategoryFormatted(categoryFormatted, (err, result) => {
                    if (!err) {
                        bot.postMessageToUser(userTmp, result, params);
                    } else {
                        bot.postMessageToUser(userTmp, 'Well, that is embarrassing. I couldn\'t find the category "' + categoryFormatted + '". If you are sure that this category exists something went terribly wrong. Sorry."', params);
                    }
                });
            } else if (input.includes('alfred') && input.includes('help')) {
                let rndAnimal = animals[Math.floor(Math.random() * (animals.length - 1) + 1)];
                let indefArticle = (/^(a|e|i|o|u)$/.exec(rndAnimal.charAt(0)) == null) ? 'a' : 'an';
                bot.postMessageToUser(userTmp, 'Sorry, I didn\'t understand you.\nYou can write "categories" to get all the categories I have in my database.\nYou could also write "category: <category_name>" to get all the links I have saved for this category.\nHere is ' + indefArticle + ' ' + rndAnimal + ' to cheer you up:\n:' + rndAnimal + ':', params);
            } else if (input.includes('still alive')) {
                let i = -1;
                (function postLine() {
                    i = (i + 1) % sa.length;
                    bot.postMessageToUser(userTmp, sa[i], params);
                    if (i < sa.length - 1) setTimeout(postLine, 1800);
                })();
            } else if (input.includes('new animal')) {
                params.icon_emoji = ':' + animals[Math.floor(Math.random() * (animals.length - 1) + 1)] + ':'
                bot.postMessageToUser(userTmp, 'Ok.', params);
            }

        }
    });
