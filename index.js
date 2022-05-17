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
        const bookingCollection = client.db("Doctor_portal").collection("booking");

        app.get("/services", async (req, res) => {
            const query = {}

            const cursor = servicesCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get("/available", async (req, res) => {
            const date = req.query.InputDate

            const query = { InputDate: date }
            //get all services
            const services = await servicesCollection.find().toArray()
            //get booking data for that day
            const booking = await bookingCollection.find(query).toArray()

            services.forEach(service => {
                const serviceBooking = booking.filter(b => b.name === service.name)
                const bookedSlot = serviceBooking.map(booked => booked.slot)

                const available = service.slots.filter(slot => !bookedSlot.includes(slot));

                service.slot = available
            })
            res.send(services)
        })

        app.post("/booking", async (req, res) => {
            const booking = req.body
            const query = { name: booking.name, InputDate: booking.InputDate, email: booking.email }
            const exist = await bookingCollection.findOne(query)
            if (exist) {
                return res.send({ success: false, exist })
            }
            const result = await bookingCollection.insertOne(booking)
            res.send({ success: true, result })
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

