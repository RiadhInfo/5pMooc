const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const router = express.Router();
const cors = require('cors');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt-nodejs');
const validator = require("email-validator");
const passwordValidator = require('password-validator');

const schema = new passwordValidator();

schema
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits()                                 // Must have digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123','12345678','87654321']);


router.use(cors());


const connection = (closure) => {
    return MongoClient.connect('mongodb://localhost:27017/MoocBD',(err,client)=>{
        if(err) return console.log(err);
        let db = client.db('MoocBD');
        closure(db);
    })
}

router.post('/register', (req, res)=> {

  if (!validator.validate(req.body.email)){
    res.json({ success : false, message:'verifier votre email'});
  }else{
    if (!req.body.username){
      res.json({ success : false, message:'username vide'});
    }else{
      if(!schema.validate(req.body.password)){
        res.json({ success : false, message:'le mot de passe doit contenir au moins une majuscule,un chiffres et une miniscule '});
        console.log(schema.validate('joke', { list: true }));
      }else {

        bcrypt.hash(req.body.password,null ,null, (err,hash) => {
          if (err) throw err ;

          connection((db)=>{
            db.collection('users').findOne({"email":req.body.email},(err,result)=>{
              console.log(result);
                if (err){  res.json({ success : false, message:'username can not saved try again !!! '});}

                 if (result === null){
                  req.body.password = hash;
                  req.body.username.toLowerCase();

                  connection((db)=>{
                    db.collection('users').insertOne(req.body,(err,result)=>{
                        if(err) throw err;

                        res.json({ success : true, message:'User registred'});
                    })
                 })

                }  else   res.json({ success : false, message:'email already exists'});


            })
          });


        });


      }
    }

  }
});

 /* ========
  LOGIN ROUTE
  ======== */
  router.post('/login', (req, res) => {
    // Check if username was provided
    if (!req.body.username) {
      res.json({ success: false, message: 'No username was provided' }); // Return error
    } else {
      // Check if password was provided
      if (!req.body.password) {
        res.json({ success: false, message: 'No password was provided.' }); // Return error
      } else {
        // Check if username exists in database
        connection((db)=>{
          db.collection('users').findOne({ username: req.body.username.toLowerCase() }, (err, user) => {
          // Check if error was found
          if (err) {
            res.json({ success: false, message: err }); // Return error
          } else {
            // Check if username was found
            if (!user) {
              res.json({ success: false, message: 'Username not found.' }); // Return error
            } else {
             // const validPassword = user.comparePassword(req.body.password); // Compare password provided to password in database
              const validPassword = bcrypt.compareSync(req.body.password, user.password);
              console.log(req.body.password);
              console.log(user.password);
              console.log(bcrypt.compareSync(req.body.password, user.password));
              // Check if password is a match
              if (!validPassword) {
                res.json({ success: false, message: 'Password invalid' }); // Return error
              } else {
                const token = jwt.sign({ userId: user._id }, 'crypto', { expiresIn: '24h' }); // Create a token for client
                res.json({
                  success: true,
                  message: 'Success!',
                  token: token,
                  user: {
                    username: user.username
                  }
                }); // Return success and token to frontend
              }
            }
          }
        })});
      }
    }
  });

/* ============================================================
     Route to check if user's email is available for registration
  ============================================================ */
  router.get('/checkEmail/:email', (req, res) => {
    // Check if email was provided in paramaters
    if (!req.params.email) {
      res.json({ success: false, message: 'E-mail was not provided' }); // Return error
    } else {
      // Search for user's e-mail in database;
      connection((db)=>{
        db.collection('users').findOne({ email: req.params.email }, (err, user) => {
        if (err) {
          res.json({ success: false, message: err }); // Return connection error
        } else {
          // Check if user's e-mail is taken
          if (user) {
            res.json({ success: false, message: 'E-mail is already taken' }); // Return as taken e-mail
          } else {
            res.json({ success: true, message: 'E-mail is available' }); // Return as available e-mail
          }
        }
      })});
    }
  });

/* ===============================================================
     Route to check if user's username is available for registration
  =============================================================== */
 router.get('/checkUsername/:username', (req, res) => {

    // Check if username was provided in paramaters
    if (!req.params.username) {
      res.json({ success: false, message: 'Username was not provided' }); // Return error
    } else {
      // Look for username in database
      connection((db)=>{
        db.collection('users').findOne({ username: req.params.username }, (err, user) => { // Check if connection error was found
        if (err) {
          res.json({ success: false, message: err }); // Return connection error
        } else {
          // Check if user's username was found
          if (user) {
            res.json({ success: false, message: 'Username is already taken' }); // Return as taken username
          } else {
            res.json({ success: true, message: 'Username is available' }); // Return as vailable username
          }
        }
      })});
    }
  });

   /* ================================================
  MIDDLEWARE - Used to grab user's token from headers
  ================================================ */
  router.use((req, res, next) => {
    const token = req.headers['authorization']; // Create token found in headers
    // Check if token was found in headers
    if (!token) {
      res.json({ success: false, message: 'No token provided' }); // Return error
    } else {
      // Verify the token is valid
      jwt.verify(token, 'crypto', (err, decoded) => {
        // Check if error is expired or invalid
        if (err) {
          res.json({ success: false, message: 'Token invalid: ' + err }); // Return error for token validation
        } else {
          req.decoded = decoded; // Create global variable to use in any request beyond
          next(); // Exit middleware
        }
      });
    }
  });

  module.exports = router;
