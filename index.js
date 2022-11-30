const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const port = process.env.PORT || 5000;
const app = express()

app.use(cors());
app.use(express.json());

// const productdata = require('./data.json');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hdi07kd.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({message: 'unauthorized access'});
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'forbidden access' })
        }
        req.decoded = decoded;
        next();
    })

}


async function run() {
    try {
        productCollection = client.db('resaleproducts').collection('products');
        categoryCollection = client.db('resaleproducts').collection('categorys');
        userCollection = client.db('resaleproducts').collection('User');
        bookNowCollection = client.db('resaleproducts').collection('booknow');

        const verifyAdmin = async (req, res, next) => {
            const decodedEmail = req.decoded.email;
            const query = { email: decodedEmail };
            const user = await userCollection.findOne(query);

            if (user?.role !== 'admin') {
                return res.status(403).send({ message: 'forbidden access' })
            }
            next();
        }

        app.get('/products', async (req, res) => {
            const query = {};
            const products = await productCollection.find(query).toArray();
            res.send(products);
        })
        app.get('/products', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const products = await productCollection.find(query).toArray();
            res.send(products);
        })
        app.post('/products', async (req, res) => {
            const data = req.body;
            const product = await productCollection.insertOne(data)
            res.send(product);
        })
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productCollection.findOne(query);
            res.send(product);
        })


        app.get('/categorys', async (req, res) => {
            const query = {};
            const categorys = await categoryCollection.find(query).toArray();
            res.send(categorys)
        })
        app.get('/categorys-products/:id', async (req, res) => {
            const id = parseInt(req.params.id);
            const query = { categoryId: id };
            const productsCategorys = await productCollection.find(query).toArray();
            res.send(productsCategorys)
        })



        app.get('/booknow', verifyJWT,  async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const booknow = await bookNowCollection.find(query).toArray();
            res.send(booknow)
        })
        app.post('/booknow', async (req, res) => {
            const data = req.body;
            const booknow = await bookNowCollection.insertOne(data)
            res.send(booknow)
        })


        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const user = await userCollection.findOne(query);
            if (user) {
                const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, { expiresIn: '1d' })
                return res.send({ accessToken: token });
            }
            res.status(403).send({ accessToken: '' })
        });


        app.get('/users', verifyJWT, async (req, res) => {
            const query = {};
            const user = await userCollection.find(query).toArray()
            res.send(user)
        })
        app.get('/user', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const user = await userCollection.findOne(query)
            res.send(user)
        })
        app.post('/user', async (req, res) => {
            const data = req.body;
            const user = await userCollection.insertOne(data)
            res.send(user)
        })

        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const user = await userCollection.findOne(query);
            res.send({ isAdmin: user?.role === 'admin' });
        })
        app.get('/users/seller/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const user = await userCollection.findOne(query);
            res.send({ isSeller: user?.role === 'seller' });
        })





    }
    finally {

    }
}
run().catch(error => console.log(error))
app.get('/', (req, res) => {
    res.send('Hello World!')
})


// app.get('/products', (req, res) => {
//     res.send(productdata)
// })




app.listen(port, () => {
    console.log(`products resale server Running on ${port}`)
})

