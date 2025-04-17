import React, {useEffect, useState} from 'react';
import axios from "axios";
import './App.css';

const ProposeTrip = () => {

    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [duration, setDuration] = useState("");
    const [weather, setWeather] = useState("");
    const username = localStorage.getItem("name");
    const weatherAPIKey = "e9522cc09ce444238ff202255240209";

    // calls on page load and when location and date are both inputted
    useEffect(() => {
        if (location && date) {
            async function generateWeather() {
                try {
                    const response = await axios.get(`https://api.worldweatheronline.com/premium/v1/weather.ashx?key=${weatherAPIKey}&q=${location}&date=${date}&format=json`);
                    setWeather(response.data);
                } catch (error) {
                    console.error("Error whilst fetching weather data:", error);
                    setWeather({error});
                }
            }
            generateWeather();
        } else {
            setWeather(null);
        }
    }, [location, date])

    // posts trip details based off user inputs and API generated data to server side, server returns with status update
    async function submit(e) {
        e.preventDefault();

        try {
            await axios.post("http://localhost:3000/proposetrip", {
                location, date, time, duration, username, weather: weather && {temp: weather.temp, condition: weather.condition}
            })
            .then(res => {
                if (res.data.status === "tripcreated") {
                    //const tripID = res.data.tripID;
                    //localStorage.setItem("tripID", tripID)
                    alert("trip created!")
                }
                else if (res.data === "tripnotcreated") {
                    alert("trip was not created, can't create a trip more than 14 days in the future.")
                }
            })
        } catch (error) {
            alert("Something went wrong")
            console.log(error)
        }
    }

    return (
        <div className='content'>
            <h1 className='planTripTitle'>Create a Trip</h1>
            <form action="POST" className='createTripForm'>
                <div className='formItem1'>
                    <label htmlFor="location">Trip Location:</label>
                    <input type="text" name="location" onChange={(e) =>{setLocation(e.target.value)}}></input>
                </div>

                <div className='formItem2'>
                    <label htmlFor="date">Trip Date:</label>
                    <input type="date" name="date" onChange={(e) =>{setDate(e.target.value)}}></input>
                </div>

                <div className='formItem3'>
                    <label htmlFor="time">Arrival Time:</label>
                    <input type="time" name="time" onChange={(e) =>{setTime(e.target.value)}}></input>
                </div>

                <div className='formItem4'>
                    <label htmlFor="duration">Trip Duration Days:</label>
                    <input type="text" name="duration" placeholder="Days" onChange={(e) =>{setDuration(e.target.value)}}></input>
                </div>
                <div className='formItem5'>
                    <input type="submit" onClick={submit}></input>
                </div>
            </form>

            {weather && (
                <div className='weather'>
                    {weather.error ? (
                        <p>{weather.error}</p>
                    ) : (
                        <>
                            <h2>Weather:</h2>
                            {weather.data && weather.data.current_condition && weather.data.current_condition.length > 0 ? (
                                <>
                                    <p className='weatherDesc'>Temperature: {weather.data.current_condition[0].temp_C}°C</p>
                                    <p className='weatherDesc'>Condition: {weather.data.current_condition[0].weatherDesc[0].value}</p>
                                </>
                            ) : (
                                <p className='noData'>Weather data not available past 14 days from today.</p>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

export default ProposeTrip