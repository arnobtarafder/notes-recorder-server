const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const ObjectId = require("mongodb").ObjectId;
const express = require('express');
const cors = require('cors');
require("dotenv").config();
const app = express();

const port = process.env.PORT || 4000;

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.n63qw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1
});

async function run() {
    try {
        await client.connect();
        const notesCollection = client.db("notesTaker").collection("notes");


        // get api to read all notes
        app.get("/notes", async (req, res) => {
            const query = req.query;
            const cursor = notesCollection.find(query);
            const result = await cursor.toArray();

            res.send(result)
        });


        // create a note using post method
        app.post("/note", async (req, res) => {
            const data = req.body;
            // console.log("from post api", data);
            const result = await notesCollection.insertOne(data);
            res.send(result)
        });


        // update a note using put method
        app.put("/note/:id", async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            console.log(data);
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
              $set: {
                ...data,
              },
            };
            const result = await notesCollection.updateOne(
              filter,
              updateDoc,
              options
            );
            res.send(result);
          });
      
          // delete a note using delete method
          // http://localhost:5000/note/62642d6e15e58fa28951096e
          app.delete("/note/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await notesCollection.deleteOne(filter);
            res.send(result);
          });
          console.log("connected to db");
        } finally {
        }
      }
run().catch(console.dir)



app.get("/", (req, res) => {
    res.send("It's me the owner of notes recorder");
})

app.listen(port, (req, res) => {
    console.log("listening to the port", port);
})