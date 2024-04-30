const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
// const { ObjectId } = require('mongodb');

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@biplob.whidwsu.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server (optional starting in v4.7)
    await client.connect(); //ai line comment kore dite hobe

    // create database and data table
    const addAllCrafts = client.db('artfulGlassAndPaper').collection('addCrafts');

    // Get data from database to show data
    app.get('/addCrafts', async (req, res) => {
      try {
        const cursor = addAllCrafts.find();
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching crafts:", error);
        res.status(500).json({ error: "Failed to fetch crafts" });
      }
    });

    // get data by id for update
    app.get('/addCrafts/:id', async(req, res) =>{
      try{
        const id = req.params.id;
        const query ={_id: new ObjectId(id)}
        const user = await addAllCrafts.findOne(query);
        res.send(user)
      } catch(error){
        console.error('"Error updating crafts:", error');
        res.status(500).json({ error: "Failed to update crafts" });
      }
    })

    app.put('/addCrafts/:id', async(req, res) =>{
      console.log('tezst')
      try{
        const id = req.params.id;
        const craft = req.body;
        const filter = {_id: new ObjectId(id)}
        const options ={upsert: true}
        const updatedCraft = {
          $set: {
            name: craft.name,
            image: craft.image,
            itemName: craft.itemName,
            subcategoryName: craft.subcategoryName,
            shortDescription: craft.shortDescription,
            price: craft.price,
            rating: craft.rating,
            customization: craft.customization,
            processingTime: craft.processingTime,
            stockStatus: craft.stockStatus,
            email: craft.email,
          }
        }
        const result = await addAllCrafts.updateOne(filter, updatedCraft, options);
        res.send(result);
      } catch(error){
        console.log(error);
        console.error('"Error updating crafts:", error');
        res.status(500).json({ error: "Failed to update crafts" });
      }
    })

    app.delete('/addCrafts/:id', async (req, res) => {
      try {
          const id = req.params.id;
          const query = { _id: new ObjectId(id) };
          const result = await addAllCrafts.deleteOne(query);
          if (result.deletedCount === 1) {
              res.json({ message: 'Craft deleted successfully' });
          } else {
              res.status(404).json({ error: 'Craft not found' });
          }
      } catch (error) {
          console.error('Error deleting craft:', error);
          res.status(500).json({ error: 'Failed to delete craft' });
      }
  });

    app.post('/addCrafts', async(req, res) => {
      try {
        const newAddCraft = req.body;
        const result = await addAllCrafts.insertOne(newAddCraft);
        console.log("New craft added:", newAddCraft);
        res.json(result);
      } catch (error) {
        console.error("Error adding craft:", error);
        res.status(500).json({ error: "Failed to add craft" });
      }
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 }); 
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensure that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
