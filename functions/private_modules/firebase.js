const firebaseModule = {};

const firebase = require('firebase');
const functions = require('firebase-functions');

const mailModule = require('./mail.js');

function write(idpost, user, comment, callback){

  try {

    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: functions.config().db.apikey,
        authDomain: functions.config().db.authdomain,
        databaseURL: functions.config().db.databaseurl,
        projectId: functions.config().db.projectid,
        storageBucket: functions.config().db.storagebucket,
        messagingSenderId: functions.config().db.messagingsenderid
      });
    }

    const TIMESTAMP = new Date().getTime();
    const CURRENTDATE = new Date();

    firebase.auth().signInWithEmailAndPassword(functions.config().authmail.user, functions.config().authmail.clientsecret)
      .catch(function(error) {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(`Error (${errorCode}) ${errorMessage}`);
    });

    firebase.database().ref(`/${idpost}/${TIMESTAMP}`).set({
        username: user,
        commentdate : {
          day: `${CURRENTDATE.getDate()}/${CURRENTDATE.getMonth() + 1}/${CURRENTDATE.getFullYear()}`,
          hour:`${CURRENTDATE.getHours()}:${CURRENTDATE.getMinutes()}`,
        },
        comment: comment
    });
    return callback(false, `El comentario en ${idpost} de ${user} se ha registrado correctamente`);
  }
  catch(err){
    return callback(true, `${err}`)
  }

}

firebaseModule.addcomment = function(req, res){
  try {
    const idpost = req.body.idpost;
    const name = req.body.name;
    const comment = req.body.comment;

    write(idpost, name, comment, function(err, response){
      if (err){
        res.status(400).send(response);    
      } else {
        const message = `
Hola, 

${name} ha escrito el siguiente comentario en el post ${idpost}.

"${comment}"        
`
        mailModule.sendMail(`${name}`, '', `Nuevo comentario en ${idpost}`, message, function(err, response){
          if (err){
            res.status(202).send(response);
          } else {
            res.status(200).send(response);            
          }
        });
      }
    });
  }
  catch(err) {
    res.status(400).send(`${err}`);
  }
}

module.exports = firebaseModule;