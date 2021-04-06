const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gfmry.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection error', err);
  const productCollection = client.db("fresh").collection("products");
  const orderCollection = client.db("fresh").collection("order");

    app.get('/products', (req, res) => {
        productCollection.find()
        .toArray((err, items) => {
            res.send(items);
            console.log('from database',items)
        })
    })

    app.get('/orders', (req, res) => {
     // console.log(req.query.email);
      orderCollection.find({email: req.query.email})
      .toArray((err, items) => {
          res.send(items);
      })
  })

  app.post('/addProduct', (req, res) => {
      const newProduct = req.body;
      console.log('adding new product: ', newProduct);
      productCollection.insertOne(newProduct)
      .then(result => {
          console.log('inserted count',result.insertedCount);
          res.send(result.insertedCount > 0)
      })
  })

  app.post('/addOrder', (req, res) => {
    const orderInformation = req.body;
    console.log('adding new product: ', orderInformation);
    orderCollection.insertOne(orderInformation)
    .then(result => {
        console.log('inserted count',result.insertedCount);
        res.send(result.insertedCount > 0)
    })
})

app.delete('/deleteEvent/:id', (req, res) => {
    productCollection.findOneAndDelete({_id: ObjectID (req.params.id)})
    .then( (result) => {
        res.send(result.deletedCount > 0);
    })
    // const id = ObjectID(req.params.id);
    //console.log(req.params.id);
    // orderCollection.findOneAndDelete({_id: id})
    // .then(documents => res.send(! ! documents.value));
})

});




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

