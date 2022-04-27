const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 4000;
require("dotenv").config();

//middleware
app.use(cors());
app.use(express.json());

// notetaker
// Pj9NNfDgHIZlka7B



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


        // create notesTaker
        app.post("/note", async (req, res) => {
            const data = req.body;
            console.log(data);
            const result = await notesCollection.insertOne();
            res.send(result)
        });


        // update notesTaker
        app.put("/note/:id", async (req, res) => {
            const data = req.body;
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };

            const updateDoc = {
                $set: {
                    // username: data.userName, 
                    // textData: data.textData,
                    ...data
                },
                // $set: req.body
            };

            const result = await notesCollection.updateOne(filter, updateDoc, options);

            res.send(result);

        });


        // delete note
        app.delete("/note/:id", async(req,res) => {
            const id = req.params.id;
            const filter = {_id: ObjectId(id)};
            const result = await notesCollection.deleteOne(filter);

            res.send(result);
        })

        console.log("connected to database");
    }
    finally {

    }
}
run().catch(console.dir)



app.get("/", (req, res) => {
    res.send("It's me the owner of notes recorder");
})

app.listen(port, (req, res) => {
    console.log("listening to the port", port);
})