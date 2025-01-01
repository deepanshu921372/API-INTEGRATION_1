import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import './Weather.css'; // We'll create this file next

const Weather = () => {
    const [weatherData, setWeatherData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchedCity, setSearchedCity] = useState(null);

    const cities = useMemo(() => [
        'London', 'Paris', 'New York', 
        'Delhi', 'Mumbai', 'Tokyo', 
        'Sydney', 'Dubai', 'Toronto'
    ], []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const requests = cities.map(city => 
                    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=ad2c35e0c67d872cdec8ed942b73ccc4&units=metric`)
                );
                const responses = await Promise.all(requests);
                setWeatherData(responses.map(res => res.data));
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [cities]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery) return;

        setLoading(true);
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&appid=ad2c35e0c67d872cdec8ed942b73ccc4&units=metric`
            );
            setSearchedCity(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setSearchedCity(null);
        setSearchQuery('');
        setError(null);
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error: {error.message}</div>;

    return (
        <div className="weather-container">
            <div className="search-container">
                <form onSubmit={handleSearch}>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search city, state or country..."
                        className="search-input"
                    />
                    <button type="submit" className="search-button">Search</button>
                    <button type="button" onClick={handleReset} className="reset-button">Reset</button>
                </form>
            </div>

            <div className="weather-grid">
                {searchedCity ? (
                    <div className="weather-card searched-city">
                        <h2>{searchedCity.name}</h2>
                        <div className="weather-info">
                            <p className="temp">{Math.round(searchedCity.main.temp)}°C</p>
                            <p className="description">{searchedCity.weather[0].description}</p>
                            <div className="details">
                                <p>Humidity: {searchedCity.main.humidity}%</p>
                                <p>Wind: {searchedCity.wind.speed} m/s</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    weatherData.map((city, index) => (
                        <div key={index} className="weather-card">
                            <h2>{city.name}</h2>
                            <div className="weather-info">
                                <p className="temp">{Math.round(city.main.temp)}°C</p>
                                <p className="description">{city.weather[0].description}</p>
                                <div className="details">
                                    <p>Humidity: {city.main.humidity}%</p>
                                    <p>Wind: {city.wind.speed} m/s</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Weather;