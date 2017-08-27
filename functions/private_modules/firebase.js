const firebaseModule = {};

const firebase = require('firebase');
const mailModule = require('./mail.js');

function write(idpost, user, comment, callback){

  try {

    firebase.initializeApp({
      databaseURL: 'https://blog-d845e.firebaseio.com',
      // serviceAccount: 'myapp-13ad200fc320.json', //this is file that I downloaded from Firebase Console
    });

    const TIMESTAMP = new Date().getTime();
    const CURRENTDATE = new Date();

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
        mailModule.sendMail('blog@victordeandres.es', 'blog@victordeandres.es', message, function(err, response){
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