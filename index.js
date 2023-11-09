const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5005

// middleware
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eugvbbj.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const booksCollection = client.db('booksDB').collection('books')
    const borrowedCollection = client.db('booksDB').collection('borrowed')

    app.get('/books', async(req, res) =>{
        const cursor = booksCollection.find()
        const result = await cursor.toArray()
        res.send(result)
      })
    app.get('/borrowed', async(req, res) =>{
        const cursor = borrowedCollection.find()
        const result = await cursor.toArray()
        res.send(result)
      })

      app.get('/books/:id', async(req, res) =>{
        const id = req.params.id
        const query = {_id: new ObjectId(id)}
        const result = await booksCollection.findOne(query)
        res.send(result)
      })

      app.post('/books', async(req, res) =>{
        const newBooks = req.body
        console.log(newBooks)
        const result = await booksCollection.insertOne(newBooks)
        res.send(result)
    })

    app.post('/borrowed', async(req,res)=> {
      const newBorrowedBook = req.body;
      console.log(newBorrowedBook)
      const result = await borrowedCollection.insertOne(newBorrowedBook)
      res.send(result)
      console.log(result)
    })

    app.put('/books/:id', async(req, res) =>{
      const id = req.params.id
      const updateProduct = req.body
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true}
      const product = {
        $set: {
          photo: updateProduct.photo,
          name: updateProduct.name,
          author: updateProduct.author,
          type: updateProduct.type,
          rating: updateProduct.rating,
         
        }
      }
      const result = await booksCollection.updateOne(filter, product, options)
      res.send(result)
    })

    app.put('/books/:newNumber', async(req, res) =>{
      const id = req.params.newNumber
      const updateCount = req.body
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true}
      const product = {
        $set: {
         
         
        }
      }
      const result = await booksCollection.updateOne(filter, product, options)
      res.send(result)
    })

    app.delete('/borrowed/:id', async(req,res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)};
      const result = await borrowedCollection.deleteOne(query)
      res.send(result)
      
    })

    
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Library server is running')
})

app.listen(port, () => {
  console.log(`Library server is running on port ${port}`)
})