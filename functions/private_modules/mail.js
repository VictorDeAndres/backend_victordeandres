const mailModule = {};

const nodemailer = require('nodemailer');

mailModule.sendContactMail = function(req, res){
  
  try {
    const name = req.body.name;
    const mailAddress = req.body.mailAddress;
    const message = req.body.message;

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
          res.status(200).send(`${err}`);
        } else {
          res.status(200).send(`Message from ${name}<${mailAddress}> ${message}`);
        }
    });
  }
  catch(err) {
    res.status(400).send(`${err}`);
  }

};

module.exports = mailModule;