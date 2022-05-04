const express = require("express")
const app = express()
const cors = require("cors")
require('dotenv').config()
const port = process.env.PORT ||5000
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const jwt = require("jsonwebtoken")


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
    const categorieCollection = client.db("warehouse").collection("categorie")
    const orderCollection = client.db("warehouse").collection("order")
    

    try {
    app.post("/product",async(req,res)=> {
        const header = req.headers.authorization
        const [email,token] = header.split(" ")
      const decoded = verifyToken(token)
      if(email === decoded.email){
        const data = req.body
        const cursor = await productCollection.insertOne(data)
       console.log(cursor);
        res.send(cursor)

      }else{
          console.log("unauthorize user");
          res.send("unauthorize user")
      }
      

        
        

    })

    app.put("/product/:id",async(req,res)=> {
        const data = req.body
        const id = req.params.id
        const filter = {_id:ObjectId(id)}
        const option = {upsert:true}
        const docs = {
            $set:{
                title:data.title,
                unit : data.unit,
                categorie:data.categorie,
                price:data.price,
                quantity:data.quantity,
                link:data.link,
                desc:data.desc

            }


        }

        const updateResult =await productCollection.updateOne(filter,docs,option)
        res.send(updateResult)
       // console.log(updateResult);
        

    })

    app.get("/product",async(req,res)=> {
        const header = req.headers.authorization
        const [email,token] = header.split(" ")
      const decoded = verifyToken(token)
       //const decoded = jwt.verify(token,process.env.SECRET)
       console.log("decoded data",decoded.email);

        const curosr = productCollection.find({})
        const data = await curosr.toArray()
        res.send(data)

    })
    app.get("/product/:id",async(req,res)=> {
        const header = req.headers.authorization
        const [email,token] = header.split(" ")
      const decoded = verifyToken(token)

        const id = req.params.id
        const data = await productCollection.findOne({_id:ObjectId(id)})
        res.send(data)
        //console.log(data);
    })

    app.delete("/product/:id",async(req,res)=> {
        const id = req.params.id
        const deletedData = await productCollection.deleteOne({_id:ObjectId(id)})
        res.send(deletedData)
        //console.log(deletedData);

    })

    app.post("/categorie",async(req,res)=> {
        const data = req.body
        const cursor =await categorieCollection.insertOne(data)
        console.log(cursor);
        res.send(cursor)

    })

    app.get("/categorie",async(req,res)=> {
        const query = {}
        const cursor = categorieCollection.find(query)
        const data = await cursor.toArray()
        res.send(data)

    })
    app.get("/categorie/:id",async(req,res)=> {
        const id = req.params.id
        const data = await categorieCollection.findOne({_id:ObjectId(id)})

        res.send(data)
       // console.log(data);
    })
    app.put("/categorie/:id",async(req,res)=> {
        const id = req.params.id
        const data = req.body
        const query = {_id:ObjectId(id)}
        const options = { upsert: true };
        const docs = {
            $set:{categorie:data.categorie}
        }

        const updatedData =await categorieCollection.updateOne(query,docs,options)
        res.send(updatedData)
       // console.log(updatedData);
    })
    app.delete("/categorie/:id",async(req,res)=> {
        const id = req.params.id
        const data = await categorieCollection.deleteOne({_id:ObjectId(id)})
        res.send(data)
       // console.log(data);
        
    })

    app.post("/order",async(req,res)=> {
        const data  = req.body
        console.log("data",data);
        const cursor = await orderCollection.insertOne(data)
        res.send(cursor)
       // console.log(cursor);
    })

    app.post("/updateqty/:id",async(req,res)=> {
        const id = req.params.id
        const data = req.body
        const filter = {_id:ObjectId(id)}
        const option = {upsert:true}
        const doc = {
            $set:{
                quantity:data.finalQty
            }
        }

       const updatedData =await productCollection.updateOne(filter,doc,option)
    //     console.log(updatedData);
    //    console.log(data.finalQty);
        
        
    })

    app.get("/getproductbyemail",async(req,res)=> {
        const email = req.query.email
        const query = {email:email}
        const curosr = productCollection.find(query)
        const data = await curosr.toArray()
        res.send(data)
        

    })

    app.post("/privetapi",(req,res)=> {
        const email = req.body
        const token = jwt.sign(email, process.env.SECRET);
        res.send(token)
        console.log("token ",token);
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


const verifyToken = (token)=> {
    let email;
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
        if(err){
            email = "invalid email"

        }
        if(decoded){
            email = decoded
            
        }
        
      });
      return email
}