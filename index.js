const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.yfy0tas.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});


async function dbConnect() {
  try {
    await client.connect();
    console.log("Database is Connected");
  } catch (error) {
    console.log(error.message);
  }
}
dbConnect();

const optionCollection = client.db("dbTestHk").collection("datas");
const userDataCollection = client.db("dbTestHk").collection("userData");


app.get("/data", async (req, res) => {
  try {
    const result = await optionCollection.find({}).toArray();
    res.send(result);
  } catch (error) {
    console.log(error.message);
  }
});

app.get("/userdata", async (req, res) => {
  try {
    const result = await userDataCollection.find({}).toArray();
    res.send(result);
  } catch (error) {
    console.log(error.message);
  }
});

app.put("/edit/:id", async (req, res) => {
  try {
    if (req.params.id !== "noid") {
      const filter = { _id: ObjectId(req.params.id) };
      const updateDoc = {
        $set: {
          name: req.body.name,
          selection: req.body.selection,
        },
      };
      const result = await userDataCollection.updateOne(filter, updateDoc)
      res.send(result);
    } else {
      const result = await userDataCollection.insertOne(req.body);
      res.send(result);
    }
  } catch (error) {
    console.log(error.message);
  }
});

//Server Connection Status
app.get("/", (req, res) => {
  res.send("API is Running");
});

app.listen(port, () => console.log("Server is running through port: ", port));
