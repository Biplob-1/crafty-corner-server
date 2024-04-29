const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

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
    await client.connect();

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
    await client.db("admin").command({ ping: 1 });
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
