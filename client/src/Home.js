import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import bannerImg from './images/banner.png';

const Home = () => {
    const username = localStorage.getItem('name');
    const [tripData, setTripData] = useState([]);
    const [search, setSearch] = useState('');

    // called on page load, get request for trip data
    useEffect(() => {
        async function getTripData() {
            try {
                const tripResponse = await axios.get('http://localhost:3000/');
                // Ensure that tripResponse.data is an array
                if (Array.isArray(tripResponse.data)) {
                    setTripData(tripResponse.data);
                } else {
                    console.error('Trip data is not an array', tripResponse.data);
                }
            } catch (error) {
                console.error('Problem fetching trip data:', error);
            }
        }
        getTripData();
    }, []);

    // put request to store unique username in database "interested" column on a specific tripID
    async function addInterest(e, tripID) {
        e.preventDefault();

        try {
            await axios.put('http://localhost:3000/', {
                username, tripID,
            }).then((res) => {
                if (res.data.status === 'interestshown') {
                    alert('Interest shown! Trip stored in interests');
                } else if (res.data.status === 'interestnotshown') {
                    alert('Error expressing interest');
                }
            });
        } catch (error) {
            alert('Something went wrong');
            console.log(error);
        }
    }

    // post request to server with location data in search bar
    async function searchQuery(e) {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3000/search', { location: search });
            if (Array.isArray(response.data)) {
                setTripData(response.data);
            } else {
                console.error('Search response is not an array', response.data);
            }
        } catch (error) {
            console.error('Error searching for trip data:', error);
        }
    }

    return (
        <div className='content'>
            <h2 className='welcome'>Welcome back, {username}</h2>

            <div className='homeBanner'>
                <img src={bannerImg} alt='banner'></img>
            </div>

            <h3>See Trips Other Users Have Created!</h3>

            <div className='search'>
                <form onSubmit={(e) => searchQuery(e)}>
                    <label htmlFor='search'>Search for Trip Locations:</label>
                    <input
                        className='searchField'
                        type='search'
                        name='search'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    ></input>
                    <button type='submit'>Search</button>
                </form>
            </div>

            <div className='tripSuggestionSection'>
                <div className='grid'>
                    {/* Ensure tripData is an array before mapping */}
                    {Array.isArray(tripData) && tripData.length > 0 ? (
                        tripData.map((trip) => (
                            trip.username !== username && (
                                <div className='gridItems' key={trip.tripID}>
                                    <h4>Trip Location: {trip.location}</h4>
                                    <p>{trip.weather.temp}°C</p>
                                    <p>Weather Condition: {trip.weather.condition}</p>
                                    <p>Trip Date: {trip.date}</p>
                                    <p>Arrival Time: {trip.time} (24hr)</p>
                                    <p>{trip.duration} Day(s)</p>
                                    <p>Created By: {trip.username}</p>
                                    <p>Users Interested: {trip.interested}</p>
                                    <button
                                        className='interestBtn'
                                        type='submit'
                                        onClick={(e) => addInterest(e, trip.tripID)}
                                    >
                                        Interested
                                    </button>
                                </div>
                            )
                        ))
                    ) : (
                        <p>No trips available or no matches for the search.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
