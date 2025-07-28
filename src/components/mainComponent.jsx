import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

import { FaLocationDot } from 'react-icons/fa6'
import WeatherComponent from './weatherComponent';

const apiEndPoint = 'https://geocoding-api.open-meteo.com/v1/search?name=';

const FrontPage = () => {
    const [cityName, setCityName] = useState('');
    const [searchMenu, setSearchMenu] = useState (false);
    const [searchedCities, setSearchedCities] = useState ([]);

    const [altitudes, setAltitudes] = useState ({});
    const [weather, setWeather] = useState (false);

    useEffect (() => {
        async function getData () {
            const { data: cities } = await axios.get (`${apiEndPoint}${cityName}`);

            if (cities.results && cities.results.length) {
                setSearchedCities (cities.results);
                setSearchMenu (true);
            }

            if (!cities.results) setSearchMenu (false);
        }
        getData();
    }, [cityName])

    function currentLocationWeather () {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            return;
        }
      
          navigator.geolocation.getCurrentPosition(
            (position) => {
                setWeather (false);

                const altitudes = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };
    
                async function getCityName () {
                    const { data: City } = await axios.get (`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${altitudes.latitude}&longitude=${altitudes.longitude}&localityLanguage=en`);
                    setCityName (`${City.city}, ${City.principalSubdivision}, ${City.countryName}`);
                    setWeather (true);
                }
                getCityName();

                setAltitudes (altitudes);
            },
            (err) => {
              setError("Permission denied or location unavailable");
            }
        );
    }

    return ( 
        <div className='bg-sky-500 min-h-screen'>
            <div className="h-[600px] bg-cover bg-center bg-fixed" style={{
                    backgroundImage: "url('/background.jpg')" 
                }}>
                <div className="flex justify-center items-center pt-32 px-4 sm:px-8 md:px-12 lg:px-20">
                    <input className="p-2 w-[300px] border border-sky-700 focus:outline-none focus:border-sky-950 rounded-2xl" 
                        type="text" value={cityName} onChange={(e) => setCityName(e.currentTarget.value)} placeholder="Search City . . ." />
                    <button onClick={currentLocationWeather} className='ml-2 text-3xl text-red-600 hover:text-red-700 cursor-pointer'>
                        <FaLocationDot/>
                    </button>
                </div>
                {
                    searchMenu && 
                    <div className="flex flex-col items-center">
                        {
                            searchedCities.map ((city, index) => (
                                <button key={index}
                                    onClick={() => {
                                        setWeather (false);
                                
                                        setSearchMenu (false);
                                        setCityName (`${city.name}, ${city.country}`);
                                
                                        const { latitude, longitude } = city;
                                        const altitudes = {};
                                        altitudes.latitude = latitude;
                                        altitudes.longitude = longitude;
                                        setAltitudes (altitudes);
                                        setWeather (true);
                                    }}
                                    className="text-white bg-sky-500 py-1 px-2 border border-sky-600 rounded-4xl hover:text-xl hover:bg-sky-500 active:bg-sky-500 hover:text-white md:text-black md:bg-transparent md:text- cursor-pointer">
                                    {`${city.name}, ${city.country}`}
                                </button>
                            ))
                        }   
                    </div>
                }
            </div>
            {
                weather && 
                <WeatherComponent altitudes = {altitudes} city = {cityName} />
            }
            <footer className="bg-sky-700 text-white text-center p-10 mt-10">
                <p className="text-2xl mb-1">&copy; {new Date().getFullYear()} Weatherly 🌤️ — Built with 💙 By Ashar</p>
                <p className="text-xl mt-1">Powered by Open-Meteo & BigDataCloud APIs</p>
            </footer>
        </div>
    );
}
 
export default FrontPage;