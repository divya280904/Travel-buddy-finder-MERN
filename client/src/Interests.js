import React, {useEffect, useState} from 'react';
import axios from "axios";
import './App.css';

const Interests = () => {

    const username = localStorage.getItem("name");
    const userID = localStorage.getItem("userID");
    const [tripData, setTripData] = useState([]);

    // calls on page load and if username changes
    useEffect(() => {
        async function getInterests() {
            // gets trip data with get request from endpoint /interests/@logged in user
            try {
                const tripResponse = await axios.get(`http://localhost:3000/interests/${username}`)
                setTripData(tripResponse.data);
            } catch (error) {
                console.error("Problem fetching trip data:", error);
                setTripData({error});
            }
        }
        getInterests();
    }, [username]);

    // delete request to remove user's username from interested column in db
    async function removeInterest(e, tripID) {
        e.preventDefault();
        
        try {
            await axios.delete("http://localhost:3000/interests", {
                data: {username, tripID, userID}
            })
            .then(res => {
                if (res.data.status === "interestremoved") {
                    alert("Interest removed, updates will be displayed on refresh!")
                }
                else if (res.data.status === "interestnotfound") {
                    alert("error removing interest")
                }
            })
        } catch (error) {
            alert("Something went wrong");
            console.log(error)
        }
    }

    return (
        <div className='content'>
            <h1 className='interestTitle'>Trip Interests</h1>

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
                                        <p>Created By: {trip.username}</p>
                                        <p>Users Interested: {trip.interested}</p>
                                        <button type="submit" onClick={(e) => removeInterest(e, trip.tripID)}>Remove Interest</button>
                                    </div>
                                ))
                            ) : (
                                <p className='noData'>Trips you've expressed interest in will show here. Go explore some trips!</p>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default Interests