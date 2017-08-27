const mailModule = {};

const nodemailer = require('nodemailer');


function sendMail(name, mailAddress, message, callback){

  try {
    const transporter = nodemailer.createTransport({
      sendmail: true,
      newline: 'unix',
      path: '/usr/sbin/sendmail'
    });
    transporter.sendMail({
        from: `${name}<${mailAddress}>`,
        to: 'victor.deandres@gmail.com',
        subject: 'Mensaje desde formulario contacto',
        text: `${message}`
    }, (err, info) => {
        if (err){
          return callback(true, `${err}`);
        } else {
          return callback(false, `Message from ${name}<${mailAddress}> ${message}`);
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
    const message = req.body.message;
    sendMail(name, mailAddress, message, function(err, response){
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