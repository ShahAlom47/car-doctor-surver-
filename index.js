const express = require('express')
const cors = require('cors')
var cookieParser = require('cookie-parser')

var jwt = require('jsonwebtoken');
const app = express()
const port = process.env.PORT||3000
require('dotenv').config()
app.use(express.json())
app.use(cors(
    {
        origin:['http://localhost:5173'],
        credentials:true,
        // // module 60 
    }
))
app.use(cookieParser())

const ObjectId = require('mongodb').ObjectId;


const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r31xce1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const uri = `mongodb+srv://Car-Doctor-M-58-59:2N37RDsuepDJxwZFh@cluster0.r31xce1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

        const serviceCollection = client.db('CarDoctor').collection('serviceCollection')
        const checkOutCollection = client.db('CarDoctor').collection('checkOutCollection')

// ath related api 

// app.post('/jwt',async(req,res)=>{
// const userInfo = req.body;
// const token =  jwt.sign(userInfo,process.env.ACCESS_TOKEN,{expiresIn :'1h'});
 
// res.cookie('token',{

//     httpOnly:true,
//     secure:false,
//     sameSite:'none'
// })
// res.send({success:true});
// console.log(token);

// })


//  services related api 
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find()
            const result = await cursor.toArray()
            res.send(result)

        })


        app.get('/services/:id', async (req, res) => {
            const id = req.params.id
            const options = {
                projection: { title: 1, service_id: 1, description: 1 },
            };

            const query = { _id: new ObjectId(id) };
            const result = await serviceCollection.findOne(query, options)
            res.send(result)

        })


        app.post('/services/check_out', async (req, res) => {
            const bookingData = req.body
            const result = await checkOutCollection.insertOne(bookingData);

            res.send(result)

        })

        // get some data use query param 

//         app.get('/check_out', async(req, res) => {
//             let query={}
//             if(req.query?.email){
//                 query={email:req.query.email,
//                 name:req.query.name}
//             }
//             const result = await checkOutCollection.find(query).toArray()
//             res.send(result);
// // client side request api == http://localhost:3000/check_out?email=sahanalom47@gmail.com&name=sahan%20alom
//         })
        app.get('/check_out', async(req, res) => {
            let query={}
            if(req.query?.email){
                query={email:req.query.email}
            }
            const result = await checkOutCollection.find(query).toArray()
            res.send(result);
        })

// delete 

app.delete('/delete/:id',async (req,res)=>{
    const id = req.params
    const query = { _id: new ObjectId(id) };
    const result = await checkOutCollection.deleteOne(query)
    res.send(result) 


})

// update 
app.put('/update/:id', async (req, res) => {
    const id = req.params.id
    const data = req.body
    const filter = { _id: new ObjectId(id)};
    const updateDoc = {
        $set: {
          name: data.name,
          email:data.email,
          message :data.message,
           phone : data.phone,
            date : data.date,
        },
      };

    const result = await checkOutCollection.updateOne(filter, updateDoc);
    res.send(result)

})


// get one 
app.get('/check_out/:id', async (req, res) => {
    const id = req.params.id
   

    const query = { _id: new ObjectId(id) };
    const result = await checkOutCollection.findOne(query)
    res.send(result)

})

        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


// Car-Doctor-M-58-59
// 2N37RDsuepDJxwZF