const functions = require('firebase-functions');

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const nodemailer = require('nodemailer');

const mailModule = require('./private_modules/mail.js');
const firebaseModule = require('./private_modules/firebase.js');

const app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/testOnline', (request, response) => {
  response.send(`<h3>Test Online</h3><p>El momento actual es: ${Date.now()}</p>`);
});
app.get('/testmail', mailModule.sendContactMail);

app.post('/blogcontact', mailModule.sendContactMail);
app.post('/addcomment', firebaseModule.addcomment);

app.get('*', function(req, res){
  res.sendFile(path.join(__dirname + '/404.html'));
});

exports.webapp = functions.https.onRequest(app);



