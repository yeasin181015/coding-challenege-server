const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

app.use(express.json());
app.use(cors());
// app.use(bodyParser.json());

const port = 5000;

//user: dbUser1
//password: m25RMfuUSvPm4W5N

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.2xrlof8.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const sectorCollection = client
      .db("challengeDatabase")
      .collection("sector");
    const profileCollection = client
      .db("challengeDatabase")
      .collection("profile");

    app.get("/allprofiles", async (req, res) => {
      const query = {};
      const cursor = profileCollection.find(query);
      const profiles = await cursor.toArray();
      res.send(profiles);
    });

    app.get("/allsectors", async (req, res) => {
      const query = {};
      const cursor = sectorCollection.find(query);
      const sectors = await cursor.toArray();
      res.send(sectors);
    });

    app.post("/profile", async (req, res) => {
      const profile = req.body;
      const data = await profileCollection.insertOne(profile);

      res.send(data);
    });

    app.put("/profileupdate/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const profileData = req.body;
      profileData._id = id;

      const option = { upsert: true };
      const updatedProfile = {
        $set: {
          name: profileData.name,
          sector: profileData.sector,
          checkbox: profileData.checkbox,
        },
      };
      const result = await profileCollection.updateOne(
        filter,
        updatedProfile,
        option
      );

      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`App runing on port ${port}`);
});
