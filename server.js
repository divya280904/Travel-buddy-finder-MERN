// Imports
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");
const bodyParser = require('body-parser');

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const User = require("./models/userModel");
const Trip = require("./models/tripModel");

// RANDOM API KEY
const randomOrgAPIKey = "98abdc56-e679-4f8f-9667-5c2abfe4d401";

// WEATHER API
const weatherAPIKey = "e9522cc09ce444238ff202255240209";

app.get("/login", cors(), (req, res) => {
    
})

// requests username and password through axios, checks if user exists
app.post("/login", async(req, res) => {
    const{username, password} = req.body

    // checks if user exists before returning correct login status to client side
    try {
        const authentication = await User.findOne({username:username}).select("userID");
        
        if (authentication) {
            randomID = authentication.userID;
            res.json({
                status:"userfound",
                userID:randomID,
            })
        }
        else {
            res.json("usernotfound")
        }
    } catch (error) {
        res.json("usernotfound")
    }
})

// Creates user account if it does not exist, generates userID & stores in db
app.post("/register", async(req, res) => {
    const{username, password} = req.body

    // checks to see if account is already created, if not, lets them create
    try {
        const authentication = await User.findOne({username:username})
        
        if (authentication) {
            res.json("userexists")
        }

        // generates userID on account creation and saves under new user schema
        else {
            // ensures no userID is the same
            do {
                randomID = await generateRandomID();
            } while (await User.findOne({userID:randomID}))

            const newUser = new User({
                username:username,
                password:password,
                userID:randomID,
            });

            await newUser.save();

            res.json({
                status:"accountcreated",
                userID:randomID,
            })
        }
    } catch (error) {
        res.json("usernotfound")
    }
})

// function to generate userID & tripID
async function generateRandomID() {
    try {
      const response = await axios.post("https://api.random.org/json-rpc/2/invoke", {
            jsonrpc: "2.0",
            method: "generateIntegers",
            params: {
              apiKey: randomOrgAPIKey,
              n: 1, // number of integers to generate
              min: 1,
              max: 1000000,
              replacement: false,
            },
            id: 42,
        },
    );

      console.log("Random.org API Response:", response.data);
  
      const randomID = response.data.result.random.data[0];
      return randomID;
    } catch (error) {
        console.error("Error generating random ID:", error);
        throw error;
    }
}

// post method to create trip, returns specific parameters to client side
app.post("/proposetrip", async(req, res) => {
    const {location, date, time, duration, username} = req.body

    try {

        const user = username;

        // generate weather data from external API
        async function generateWeather() {
            try {
                const response = await axios.get(`https://api.worldweatheronline.com/premium/v1/weather.ashx?key=${weatherAPIKey}&q=${location}&num_of_days=${duration}&date=${date}&format=json`);
                const weatherData = response.data;
                const currentCondition = weatherData.data.current_condition[0];
                const temp = currentCondition.temp_C;
                const condition = currentCondition.weatherDesc[0].value;
                // only want these specific parameters
                return {
                    temp,
                    condition
                };
            } catch (error) {
                console.error("Error whilst fetching weather data:", error);
                return {
                    error: "Faled to fetch weather data. Please try again."
                }
            }
        }

        // generating tripID and weather data and storing them in new trip schema
        do {
            randomID = await generateRandomID();
            weather = await generateWeather();
        } while (await Trip.findOne({tripID:randomID}))

        newTrip = new Trip({
            location:location,
            date:date,
            time:time,
            duration:duration,
            tripID:randomID,
            username:user,
            weather:weather
        })

        await newTrip.save();

        // json response with status telling client side what operation to follow
        res.json({
            status: "tripcreated",
            tripID: randomID,
            username: user
        })
    } catch (error) {
        res.json("tripnotcreated");
        console.error("Error creating trip:", error);
    }
})

// gets trip data from db and sends 8 trips based on closest date
app.get("/", async(req, res) => {
    try {
        const tripData = await Trip.find()
            .select("tripID username location date time duration weather interested")
            .sort({date: +1})
            .limit(8);
        res.json(tripData);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

// gets all trips under username value delivered in request, each username is unique so it is equivalent to userID
app.get("/mytrips/:username", async(req,res) => {
    const {username} = req.params;

    try {
        const myTrips = await Trip.find({username})
            .select("tripID location date time duration weather interested")
            .sort({date: +1})

        if (myTrips.length > 0) {
            res.json(myTrips);
        } else {
            res.json({status: "tripsnotfound"});
        }
    } catch (error) {
        console.error("Error fetching myTrips data", error)
        res.status(500).json({message: error.message})
    }
})

// put method to add requested user to "interested" column in mongoDB
app.put("/", async(req, res) => {
    const {username, tripID} = req.body;

    // checks specific trip and adds user to interested column if not present
    try {
        const checkInterest = await Trip.findOne({tripID:tripID, interested:username});
        console.log(username)

        if (!checkInterest) {
            const addInterest = await Trip.findOneAndUpdate(
                {tripID: tripID, interested: {$ne:username}},
                {$push: {interested:username}},
                {new: true}
            );

            res.json({
                status:"interestshown",
                addInterest
            });
        } else {
            res.json({status: "interestnotshown"})
        }
    } catch (error) {
        console.error("Error showing interest", error)
        res.status(500).json({message: error.message})
    }
})

// get trips interested in by username
app.get("/interests/:username", async(req, res) => {
    const {username} = req.params;

    try {
        const myInterestedTrips = await Trip.find({interested: username})
            .select("tripID username location date time duration weather interested")
            .sort({date: +1})
        if (myInterestedTrips.length > 0) {
            res.json(myInterestedTrips);
        } else {
            res.json({status: "interestsnotfound"});
        }
        
    } catch (error) {
        console.error("Error fetching interests data", error)
        res.status(500).json({message: error.message})
    }
})

// checks specific trip and removes user from interested if present
app.delete("/interests", async(req, res) => {
    const {username, tripID, userID} = req.body;

    try {
        const checkInterest = await Trip.findOne({tripID:tripID, interested:username});

        if (checkInterest) {
            const removeInterest = await Trip.findOneAndUpdate(
                {tripID: tripID},
                {$pull: {interested:username}},
                {new: true}
            );

            res.json({
                status:"interestremoved",
                removeInterest
            });
        } else {
            res.json({status: "interestnotfound"})
        }
    } catch (error) {
        console.error("Error showing interest", error)
        res.status(500).json({message: error.message})
    }
})


// deletes trip schema with related tripID
app.delete("/mytrips", async(req, res) => {
    const {tripID} = req.body;

    try {
        const count = await Trip.deleteMany({tripID: tripID});
        console.log(typeof tripID)

        if (count.deletedCount > 0) {
            res.json({status: "tripremoved"})
        }
        else {
            res.json({status: "tripnotremoved"});
        }
    } catch (error) {
        console.error("Error removing trip", error);
        res.status(500).json({message: error.message});
    }
})

// allows users to query trips based off location parameter
app.post("/search", async(req, res) => {
    const {location} = req.body;

    try {
        const searchResults = await Trip.find({location:{$regex: new RegExp(location, "i")}})
            .select("tripID username location date time duration weather interested")
            .sort({date: +1});

        res.json(searchResults);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

// mongoDB initiation code
mongoose.set("strictQuery", false)
mongoose.connect("mongodb://localhost:27017/travelBuddyFinder")
.then(() => {
    console.log("connected to MongoDB")
    app.listen(5000, () => {
        console.log("TravelBuddyFinder app is running on port 5000")
    })
}).catch((error) => {
    console.log(error)
}) 