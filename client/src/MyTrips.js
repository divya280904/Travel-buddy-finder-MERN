import React, {useEffect, useState} from 'react';
import axios from "axios";
import './App.css';

const MyTrips = () => {

    const username = localStorage.getItem("name");
    const [tripData, setTripData] = useState([]);

    // calls on page load or when username changes, gets tripm data where username is equal to logged in username
    useEffect(() => {
        async function getMyTrips() {
            try {
                const tripResponse = await axios.get(`http://localhost:3000/mytrips/${username}`)
                setTripData(tripResponse.data);
            } catch (error) {
                console.error("Problem fetching trip data:", error);
                setTripData({error});
            }
        }
        getMyTrips();
    }, [username]);

    // delete request to remove trip schema based on user's request
    async function removeTrip(e, tripID) {
        e.preventDefault();
        
        try {
            await axios.delete("http://localhost:3000/mytrips", {
                data: {tripID}
            })
            .then(res => {
                if (res.data.status === "tripremoved") {
                    alert("Trip removed, updates will be displayed on refresh!")
                }
                else if (res.data.status === "tripnotremoved") {
                    alert("error removing trip")
                }
            })
        } catch (error) {
            alert("Something went wrong");
            console.log(error)
        }
    }

    return (
        <div className='content'>
            <h1 className='myTripsTitle'>My Trips</h1>
            
            {tripData && (
                <>
                    {tripData.error ? (
                        <p>{tripData.error}</p>             
                    ) : (
                        <div className='grid'>
                            {tripData.length > 0 ? (
                                tripData.map(trip => (
                                    <div className='gridItems' key={trip.tripID}>
                                        <h4>Trip Location: {trip.location}</h4>
                                        <p>{trip.weather.temp}°C</p>
                                        <p>Weather Condition: {trip.weather.condition}</p>
                                        <p>Trip Date: {trip.date}</p>
                                        <p>Arrival Time: {trip.time} (24hr)</p>
                                        <p>{trip.duration} Day(s)</p>
                                        <p>Users Interested: {trip.interested}</p>
                                        <button type="submit" onClick={(e) => removeTrip(e, trip.tripID)}>Remove Trip</button>
                                    </div>
                                ))
                            ) : (
                                <p className='noData'>Currently have no trips</p>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>  
    );
}

export default MyTrips