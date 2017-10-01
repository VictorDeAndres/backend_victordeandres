const mailModule = {};

const nodemailer = require('nodemailer');
const smtpTransport = require("nodemailer-smtp-transport");
const xoauth2 = require('xoauth2');

const envVariables = require('./config_variables.js');

function sendMail(name, mailAddress, subject, message, callback){

  try {

    const transport = nodemailer.createTransport(smtpTransport({
      service: 'Gmail',
      auth:{
        xoauth2: xoauth2.createXOAuth2Generator({
          user: envVariables.data().gmail.user,
          clientId: envVariables.data().gmail.clientId,
          clientSecret: envVariables.data().gmail.clientSecret,
          refreshToken: envVariables.data().gmail.refreshToken
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
    
    // return callback(false, '');

  }
  catch(err) {
    return callback(true, `[sendMail] ${err}`);
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
    res.status(400).send(`[SendContactMail] ${err}`);
  }
};

mailModule.sendMail = sendMail;

module.exports = mailModule;


