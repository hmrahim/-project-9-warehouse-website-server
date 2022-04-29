const express = require("express")
const app = express()
const cors = require("cors")
require('dotenv').config()
const port = process.env.PORT ||5000
const { MongoClient, ServerApiVersion } = require('mongodb');


// Middlewares
const corsConfig = {
    origin: true,
    credentials: true,
  }
  app.use(cors(corsConfig))
  app.options('*', cors(corsConfig))

app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.trq2z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const run =async ()=> {
    await client.connect()
    console.log("database connected");
    const productCollection = client.db("warehouse").collection("products")

    try {
    app.post("/product",async(req,res)=> {
        const data = req.body
        const cursor = await productCollection.insertOne(data)
        console.log(cursor);
        res.send(cursor)
        

    })
        
    } finally{

    }

}

run().catch(console.dir)





app.get("/",(req,res)=> {
    res.send("hello from home page")
})


app.listen(port ,()=> {
    console.log("server started on port 5000");
})