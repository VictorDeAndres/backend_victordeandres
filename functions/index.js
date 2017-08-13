const functions = require('firebase-functions');
const express = require('express');

const app = express();

app.get('/timestamp', (request, response) => {
  response.send(`El momento actual es: ${Date.now()}`);
});


exports.webapp = functions.https.onRequest(app);
