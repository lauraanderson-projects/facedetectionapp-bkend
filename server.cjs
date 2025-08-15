require("dotenv").config({ path: "./.env" });

const express = require("express");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const cors = require("cors");
const knex = require("knex");

const register = require("./controllers/register.js");
const signin = require("./controllers/signin.js");
const profile = require("./controllers/getprofile.js");
const image = require("./controllers/image.js");
const clarifaiimage = require("./controllers/clarifaiimage.js");

//db connection
const db = knex({
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
  },
});

const app = express();
app.use(
  cors({
    origin: "https://facedetectionapp-m8fw.onrender.com", // your frontend domain
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Access-Control-Allow-Origin",
      "Origin",
    ],
  })
);

// Use Render’s provided PORT
const PORT = process.env.PORT || 3000;

// OR allow all origins temporarily (not for production security)
//app.use(cors());

app.use(express.json());

//const CLARIFAI_API_KEY = process.env.CLARIFAI_API_KEY;
//const USER_ID = process.env.USER_ID;
//const APP_ID = process.env.APP_ID;
//const MODEL_VERSION_ID = process.env.MODEL_VERSION_ID;
const PAT = process.env.PAT;

app.get("/", (req, res) => {
  res.send("success");
});

app.post("/signin", (req, res) => signin.handleSignin(req, res, db, bcrypt));

app.post("/register", (req, res) =>
  register.handleRegister(req, res, db, bcrypt)
);

app.get("/profile/:id", (req, res) => profile.handleProfileGet(req, res, db));

app.put("/image", (req, res) => image.handleImage(req, res, db));

app.post("/imageurl", (req, res) =>
  clarifaiimage.handleApiCall(req, res, fetch, PAT)
);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
