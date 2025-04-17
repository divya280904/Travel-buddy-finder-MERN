const mongoose = require("mongoose");

const tripSchema = mongoose.Schema({
    tripID: {
        type: String
    },
    username: {
        type: String
    },
    location: {
        type: String
    },
    date: {
        type: String
    },
    time: {
        type: String
    },
    duration: {
        type: String
    },
    weather: {
        type: Object
    },
    interested: {
        type: [String]
    }
},
{
    timestamps: true,
    default: Date.now()
});

const Trip = mongoose.model("Trip", tripSchema);
module.exports = Trip;