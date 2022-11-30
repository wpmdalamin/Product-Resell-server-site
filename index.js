const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 5000;
const app = express()

app.use(cors());
app.use(express.json());

// const productdata = require('./data.json');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hdi07kd.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


app.get('/', (req, res) => {
    res.send('Hello World!')
})


// app.get('/products', (req, res) => {
//     res.send(productdata)
// })




app.listen(port, () => {
    console.log(`products resale server Running on ${port}`)
})

