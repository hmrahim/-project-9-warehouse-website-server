const express = require("express")
const app = express()
const cors = require("cors")
require('dotenv').config()
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion } = require('mongodb');




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.trq2z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const run =async ()=> {
    try {
        await client.connect()
    console.log("database connected");
        
    } finally{
        
    }

}

run().catch(console.dir)


app.use(cors)
app.use(express.json())




app.get("/",(req,res)=> {
    res.send("hello home")
})


app.listen(port ,()=> {
    console.log("server started on port 5000");
})