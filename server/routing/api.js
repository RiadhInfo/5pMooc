const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const router = express.Router();
const cors = require('cors');



router.use(cors());


const connection = (closure) => {
    return MongoClient.connect('mongodb://localhost:27017/MoocBD',(err,client)=>{
        if(err) return console.log(err);
        let db = client.db('MoocBD');
        closure(db);
    })
}


router.get('/cours/listcours', (req, res)=>{
    connection((db) => {
        db.collection('cours')
            .find({})
            .toArray(function(err, data){
                if (err) throw err;
                res.json(data);
            });
    });
});

router.get('/cours/listcours/:id', (req, res) => {
  //  res.header('Access-Control-Allow-Origin', '*');
    connection((db) => {
        db.collection('cours').findOne({ "_id": ObjectID(req.params.id)}, (err, result) => {
            console.log(result);
           res.json(result);
           console.log(req.params.id)

        })
    })
});

router.get('/cours/categorie/:name', (req, res) => {
    connection((db) => {
        db.collection('cours').find({ "categories":  { $elemMatch: { "name": req.params.name} }}).toArray(function (err, data) {
            if (err) throw err;
            console.log(req.params.name)
            res.json(data);
        });
    });
 });

 router.get('/comment/:id', (req, res) => {
console.log('ena api');
  connection(function (db) {

      db.collection('cours').findOne(
          { "_id": ObjectID(req.params.id)}, function (err, result) {
          if (err) throw err;
          var commentaires = result.comments;

          let resuContent = {};
          commentaires.forEach(function (com) {
              var contents = com.content;
              resuContent["commentaire"] = contents;

          });
          console.log(resuContent);
          res.json(resuContent);
      })
  })
})



module.exports = router;
