const mailModule = {};

const nodemailer = require('nodemailer');
const smtpTransport = require("nodemailer-smtp-transport");
const xoauth2 = require('xoauth2');

const functions = require('firebase-functions');

function sendMail(name, mailAddress, subject, message, callback){

  try {

    const transport = nodemailer.createTransport(smtpTransport({
      service: 'Gmail',
      auth:{
        xoauth2: xoauth2.createXOAuth2Generator({
          user: functions.config().authmail.user,
          clientId: functions.config().authmail.clientid,
          clientSecret: functions.config().authmail.clientsecret,
          refreshToken: functions.config().authmail.refreshtoken
        })
      }
    }));

    transport.sendMail({
      from: `${name}<${mailAddress}>`,
      to: 'victor.deandres@gmail.com',
      subject: `${subject}`,
      text: message
    }, (err, info) => {
        if (err){
          return callback(true, `${err}`);
        } else {
          return callback(false, `Message from ${name}<${mailAddress}>. OK`);
        }
    });

  }
  catch(err) {
    return callback(true, `${err}`);
  }
}

mailModule.sendContactMail = function(req, res){

  try {
    const name = req.body.name;
    const mailAddress = req.body.mailAddress;
    const message = `
Hola, 

${name}<${mailAddress}>

Te ha escrito el siguiente mensaje desde el formulario de contacto:

${req.body.message}`;
    const subject = 'Contacto desde pagina personal';
    sendMail(name, mailAddress, subject, message, function(err, response){
      if (err){
        res.status(400).send(response);
      } else {
        res.status(200).send(response);
      }
    });
  }
  catch(err) {
    res.status(400).send(`${err}`);
  }
};

mailModule.sendMail = sendMail;

module.exports = mailModule;


