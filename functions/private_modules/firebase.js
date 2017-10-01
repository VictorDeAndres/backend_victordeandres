const firebaseModule = {};

const firebase = require('firebase');
const envVariables = require('./config_variables.js');


const mailModule = require('./mail.js');

function writedb(idpost, user, comment, callback){

  try {

    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: envVariables.data().firedb.apiKey,
        authDomain: envVariables.data().firedb.authDomain,
        databaseURL: envVariables.data().firedb.databaseURL,
        projectId: envVariables.data().firedb.projectId,
        storageBucket: envVariables.data().firedb.storageBucket,
        messagingSenderId: envVariables.data().firedb.messagingSenderId
      });
    }

    const TIMESTAMP = new Date().getTime();
    const CURRENTDATE = new Date();

    firebase.auth().signInWithEmailAndPassword(envVariables.data().gmail.user, envVariables.data().gmail.clientSecret)
      .then(function(firebaseUser) {
        firebase.database().ref(`/${idpost}/${TIMESTAMP}`).set({
            username: user,
            commentdate : {
              day: `${CURRENTDATE.getDate()}/${CURRENTDATE.getMonth() + 1}/${CURRENTDATE.getFullYear()}`,
              hour:`${CURRENTDATE.getHours()}:${CURRENTDATE.getMinutes()}`,
            },
            comment: comment
        });
        return callback(false, `El comentario en ${idpost} de ${user} se ha registrado correctamente`);
      })
      .catch(function(error) {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        return callback(true, `Error ([firebaseAuth] ${errorCode}) ${errorMessage}`);
    });

  }
  catch(err){
    return callback(true, `[write] ${err}.`)
  }

}

firebaseModule.addcomment = function(req, res){
  try {
    const idpost = req.body.idpost;
    const name = req.body.name;
    const comment = req.body.comment;


    writedb(idpost, name, comment, function(err, response){
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
    res.status(400).send(`[addcomment] ${err}`);
  }
}

module.exports = firebaseModule;