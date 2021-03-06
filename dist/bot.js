'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _dropbox = require('dropbox');

var _dropbox2 = _interopRequireDefault(_dropbox);

var _twit = require('twit');

var _twit2 = _interopRequireDefault(_twit);

var _nodeTelegramBotApi = require('node-telegram-bot-api');

var _nodeTelegramBotApi2 = _interopRequireDefault(_nodeTelegramBotApi);

var _v = require('watson-developer-cloud/assistant/v1');

var _v2 = _interopRequireDefault(_v);

var _convertbtc = require('./convertbtc');

var _convertbtc2 = _interopRequireDefault(_convertbtc);

var _apiai = require('apiai');

var _apiai2 = _interopRequireDefault(_apiai);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import dialogflow from 'dialogflow';

// local enviroment variables
_dotenv2.default.load();

// Telegram api config
var bot = new _nodeTelegramBotApi2.default(process.env.BOT_TOKEN, { polling: true });

// Global Var
var bddata = {},
    newBdia = void 0,
    newbdv = void 0,
    newptv = void 0,
    newBdiaCount = 0,
    newgifCount = 0,
    rgifcount = 0,
    bdiadaycount = [[], [0, 0], 0, 0],
    nvloop = 0,
    silentUsers = void 0;

var dropfilesurl = [[process.env.DROP_DATA, 'bddata.json', 'bddata'], [process.env.DROP_GIF, 'gifdata.json', 'gifdata'], [process.env.DROP_NV, 'nvdata.json', 'nvdata']];

// [process.env.DROP_NV, 'nvdata.json', 'nvdata']
var gifdata = {
  newgif: [],
  ckdgif: [],
  lastgif: []
};

// Time config
var nowDay = function nowDay() {
  return (0, _moment2.default)().format('ddd');
};
var STime = function STime() {
  return (0, _moment2.default)('14:00', 'HHmm');
}; // 14:00
var ETime = function ETime() {
  return (0, _moment2.default)('23:59', 'HHmm');
}; // 23:59

// Dropbox Config
// const dbx = new Dropbox({
//   key: process.env.DROPBOX_APP_KEY,
//   secret: process.env.DROPBOX_APP_SECRET,
//   accessToken: process.env.DROPBOX_TOKEN,
//   sandbox: false
// });

// Twitter Integration
// const T = new Twit({
//   consumer_key: process.env.TWITTER_CONSUMER,
//   consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
//   access_token: process.env.TWITTER_TOKEN,
//   access_token_secret: process.env.TWITTER_TOKEN_SECRET,
//   timeout_ms: 60 * 1000
// });

// const streamTwit = T.stream('user');
// streamTwit.on('tweet', tweetReply);

// Watson config
// const watsonContext = [];
// const watsonBot = new AssistantV1({
//   username: process.env.ASSISTANT_USERNAME,
//   password: process.env.ASSISTANT_PASSWORD,
//   url: 'https://gateway.watsonplatform.net/assistant/api/',
//   version: '2018-02-16',
// });

// Seção de Notas

// IDEA: organizar como o bot será utilizado em vários grupos:
// arquivos diferentes ? mesclar bases de dados ?

// IDEA: json não trabalha com " " dá problema, tem que
// converter regex pra detectar : (.+)(')(.+)(')(.+)?

console.log('bot server started...');

var app = (0, _apiai2.default)("1f5895d71a7e4f7fbe64005fedc741ff", { language: 'pt-BR' });
var sessionId = { sessionId: '<UNIQE SESSION ID>' };

bot.on('message', function (msg) {

  var alice = app.textRequest(msg.text, sessionId);
  alice.on('response', function (response) {
    console.log(response);
    bot.sendMessage(msg.chat.id, response.result.fulfillment.speech);
  });

  alice.on('error', function (error) {
    console.log(error);
  });

  alice.end();
});

// bot.on('message', (msg) => {

// const aliceVoz = app.voiceRequest(sessionId);

// aliceVoz.on('response', function (response) {
//   console.log(response);
// });

// aliceVoz.on('error', function (error) {
//   console.log(error);
// });

// fs.readFile("ann_smith.wav", function (error, buffer) {
//   if (error) {
//     console.log(error);
//   } else {
//     aliceVoz.write(buffer);
//   }

//   aliceVoz.end();
// });

// });


// function saveAllData(msg) {
//   const saves = [[['bd', bddata], 'Data Salvo!', 200],
//     [['gif', gifdata], 'Gifdata Salvo!', 2200],
//     [['nv', bdiadaycount], 'Validação Salvo!', 3200]];
//   saves.forEach((val) => {
//     setTimeout(() => {
//       saveNewdata(val[0][0], val[0][1]);
//       if (msg !== undefined) {
//         bot.sendMessage(msg.chat.id, val[1]);
//       }
//     }, val[2]);
//   });
// }

// process.on('SIGTERM', () => {
//   console.log('Salvando dados e finalizando bot..');
//   saveAllData();
//   setTimeout(() => {
//     process.exit(0);
//   }, 7000);
// });

// pega o arquivo no dropbox e transforma em objeto
// function startRead() {
//   dropfilesurl.forEach((id) => {
//     dbx.sharingGetSharedLinkFile({ url: id[0] })
//       .then((data) => {
//         fs.writeFileSync(data.name, data.fileBinary, 'binary', (err) => {
//           if (err) { throw err; }
//         });
//         if (id[2] === 'bddata') {
//           bddata = JSON.parse(fs.readFileSync('./bddata.json', 'utf8'));
//         } else if (id[2] === 'gifdata') {
//           gifdata = JSON.parse(fs.readFileSync('./gifdata.json', 'utf8'));
//         } else if (id[2] === 'nvdata') {
//           bdiadaycount = JSON.parse(fs.readFileSync('./nvdata.json', 'utf8'));
//           silentUsers = bdiadaycount[4];
//         }
//       }).catch((err) => {
//         throw err;
//       });
//   });
// }
// startRead();

/*

const { latebdreceived, latebdsay, bomdia, bdiasvar, pontosvar } = bddata;

const { ckdgif, newgif, lastgif, tumblrgif, tumblrlist } = gifdata;

*/

// bot.on('message', (msg) => {
// });


// comando para salvar arquivos
// bot.onText(/^\/bdcsave$/, (msg, match) => {
//   saveAllData(msg);
// });

// comando para help
bot.onText(/^\/bdchelp$|^\/bdchelp@bomdiacracobot$/, function (msg) {
  var text = 'Bom dia!\n    Eu guardo toda a frase dita ap\xF3s "bom dia".\n    E respondo todos os bom dias com ou sem frases..\n    mas ainda n\xE3o entendo coisas loucas tipo "bu\xF3nday".\n\n    /bdcstatus - Ver a quantidades de bom dias no banco\n    /bdcadmin - Ver comandos de administra\xE7\xE3o\n    /bdcbtc - Ver cota\xE7\xE3o bitcoin. Formato: 1 BTC BRL\n    /bdcultimos - Ver os ultimos bom dias adicionados';
  bot.sendMessage(msg.chat.id, text).then(function () {});
});

//   watsonBot.message(watsonMsg, (err, response) => {
//     if (err) {
//       console.log('error:', JSON.stringify(err, null, 2));
//     } else {
//       const watsonResponse = JSON.stringify(response, null, 2);
//       watsonContext[0] = response;
//       // console.log(response.output.text[0]);
//       bot.sendMessage(
//         msg.chat.id, response.output.text[0],
//         { reply_to_message_id: msg.message_id }
//       ).then(() => {
//         watsonContext[1] = moment.unix(msg.date).add(15, 'minutes');
//       });
//     }
//   });
// }

//  retornar valor quando disserem bitcoin
var btctemp = 5;
bot.onText(/^(.+)?bitcoin(.+)?$/gim, function (msg, match) {
  if (Math.abs((0, _moment2.default)().diff(btctemp, 'minute')) >= 3 || btctemp === undefined) {
    (0, _convertbtc2.default)('BTC', 'BRL', 1).then(function (data) {
      bot.sendMessage(msg.chat.id, data).then(function () {
        btctemp = _moment2.default.unix(msg.date);
      });
    });
  }
});

//  comando apra retornar bitcoin especcífico
bot.onText(/^\/bdcbtc(\s)(\d+)(\s)(\w+)(\s)(\w{3})$|^\/bdcbtc@bomdiacracobot$/, function (msg, match) {
  (0, _convertbtc2.default)(match[4].toUpperCase(), match[6].toUpperCase(), match[2]).then(function (data) {
    bot.sendMessage(msg.chat.id, data).then(function () {});
  });
});

// comando para verificar bom dias
bot.onText(/^\/bdcstatus$|^\/bdcstatus@bomdiacracobot$/, function (msg, match) {
  var text = '\nN\xF3s temos OLAR';
  bot.sendMessage(msg.chat.id, text).then(function () {});
});

// sava arquivo json com bom dias no dropbox a cada 10 novos
// function saveNewdata(id, dataVar) {
//   const filename = `/${id}data.json`;
//   const json = JSON.stringify(dataVar, null, 2);
//   dbx.filesUpload({ path: filename, contents: json, mode: 'overwrite' })
//     .then((response) => {
//       console.log(`Data Saved : ${filename}`);
//       startRead();
//     })
//     .catch((err) => {
//       console.log(`Error: ${err}`);
//     });
// }