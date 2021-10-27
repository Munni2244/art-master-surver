const express= require('express');
const cors = require('cors')
const { MongoClient } = require('mongodb');
const Objected = require('mongodb').ObjectId;
require('dotenv').config()


const app =express();
const port=process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.crn6x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db("ArtMaster");
        const databaseCollection = database.collection("survices");
         
        //get
        app.get('/survices', async (req, res)=>{
            const cursor = databaseCollection.find({});
            const survice= await cursor.toArray();
            console.log(survice);
            res.send(survice);

        })

        //get single survice
        app.get('/survices/:id', async(req, res)=>{
            const id= req.params.id;
            console.log('hitting id' ,id);
            const query= {_id: Objected(id)};
            const survice = await databaseCollection.findOne(query);
            res.json(survice)

        })

        //post
        app.post('/survices', async(req, res)=>{
          const survice= req.body;
          console.log('hit the post api ', survice);
            const result = await databaseCollection.insertOne(survice);
            console.log(result);
            res.send(result)

        })

        //delete
        app.delete('/survices/:id', async(req, res)=>{
            const id= req.params.id;
            console.log( 'delete',id);
            const query= {_id: Objected(id)};
            const result = await databaseCollection.deleteOne(query);
            res.json(result)
        })


    }
    finally {
        // await client.close();
      }
}
run().catch(console.dir);




app.get('/', (req, res)=>{
    res.send('surver is running');
})

app.listen(port, (req,res)=>{
    console.log('running port', port);
})