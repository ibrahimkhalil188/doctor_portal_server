const express = require("express")
const app = express()
const port = process.env.PORT || 5000
const cors = require("cors")
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()

app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6ibga.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });




async function run() {

    try {
        await client.connect()
        const servicesCollection = client.db("Doctor_portal").collection("Services");

        app.get("/services", async (req, res) => {
            const query = {}

            const cursor = servicesCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })
    }
    finally {

    }
}
run().catch(console.dir)

app.get("/", (req, res) => {
    res.send("Look mama professional web server")
})

app.listen(port, () => {
    console.log("This is doctors portal", port)
})