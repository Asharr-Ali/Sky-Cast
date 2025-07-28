import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WeatherComponent = ({ altitudes, city }) => {
    const [weather, setWeather] = useState ([]);
    const [timeZone, setTimeZone] = useState ('');
    const [currentHourWeather, setCurrentHourWeather] = useState ({});
    const [City, setCity] = useState ('');      

    useEffect (() => {
        async function getData () {
            const { data: weather } = await axios.get (`https://api.open-meteo.com/v1/forecast?latitude=${altitudes.latitude}&longitude=${altitudes.longitude}&hourly=temperature_2m,precipitation,weathercode,relativehumidity_2m&timezone=auto`);

            setTimeZone (weather.timezone);

            const currentTime  = getCurrentTime (weather.timezone);
            let hours = parseInt (currentTime.split(',')[1].split(':')[0]);

            const todayWeather = [];

            for (let i = hours; i <= (hours + 24); i++) {
                todayWeather.push({
                    time: weather.hourly.time[i],
                    temperature: weather.hourly.temperature_2m[i],
                    humidity: weather.hourly.relativehumidity_2m[i],
                    precipitation: weather.hourly.precipitation[i],
                    weatherCode: weather.hourly.weathercode[i]
                });
            }

            todayWeather[0].time = currentTime;

            if (todayWeather.length) setCurrentHourWeather (todayWeather[0]);

            setCity (city);
            setWeather (todayWeather);
        }
        getData ();

    }, [altitudes]);

    function formatTo12HourUI(timeStr) {
        const date = new Date(timeStr);
        if (isNaN(date.getTime())) return "Invalid Date";
    
        const hasSeconds = timeStr.includes(':') && timeStr.split(':').length === 3;
    
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            second: hasSeconds ? '2-digit' : undefined,
            hour12: true
        });
    }
    

    function isRainPredicted(code) {
        return (
            (code >= 51 && code <= 67) ||  
            (code >= 80 && code <= 82) ||
            (code >= 95 && code <= 99)    
        );
    }

    function getWeatherMessage(weather) {
        if (!weather || weather.weatherCode === undefined) return "";
    
        const isRaining = isRainPredicted(weather.weatherCode);
        if (isRaining) return "🌧️ Raining. Carry an umbrella.";
    
        const temp = weather.temperature;
    
        if (temp >= 33) return "🥵 Hot day. Stay hydrated.";
        if (temp <= 16) return "🧥 Cold weather. Wear warm clothes.";
    
        return "☀️ Pleasant day. Enjoy safely.";
    }    
    
    function getExpectedRainTime () {
        for (let i = 1; i < weather.length; i++) {
            if (isRainPredicted(weather[i].weatherCode)) return 'Expected Rain at ' + formatTo12HourUI (weather[i].time) + '!';
        }
        return 'No Chance of Rain in next 24 Hours!';
    }

    function getCurrentTime (timeZone) {
        const now = new Date().toLocaleString("en-US", {
            timeZone,
            hour12: false
        });

        return now;
    }

    return (
        <>
        <div className='text-center m-10 font-bold underline text-2xl md:text-3xl'>
            {City}
        </div>
        {
            <div className='mb-20 text-center'>
                <h1 className='text-xl md:text-3xl font-bold mb-5'>{timeZone}</h1>
                <h1 className='text-xl md:text-3xl font-bold mb-5'>Current Time Weather</h1>
                <h2 className="md:text-2xl font-bold mb-2">
                    {formatTo12HourUI(currentHourWeather.time)} {isRainPredicted(currentHourWeather.weatherCode) ? "🌧️" : "☀️"}
                </h2>
                <div className="mb-4 text-xl md:text-3xl font-extrabold text-center text-sky-900 animate-pulse">
                    {getWeatherMessage(currentHourWeather)}
                </div>
                <p className='md:text-xl font-medium'>🌡️ Temperature: {currentHourWeather.temperature}°C</p>
                <p className='md:text-xl font-medium'>💧 Humidity: {currentHourWeather.humidity}%</p>
                <p className='md:text-xl font-medium'>🌦️ Precipitation: {currentHourWeather.precipitation} mm</p>
                <div className="mt-10 text-xl md:text-3xl font-extrabold text-center text-sky-900 animate-bounce">
                    {getExpectedRainTime()}
                </div>
            </div>
        }
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
            {weather.slice(1).map((hour, index) => (
                <div
                    key={index}
                    className="bg-sky-200 shadow-md rounded-xl p-4 border border-sky-300"
                >
                    <h2 className="text-lg font-semibold mb-2">
                        {formatTo12HourUI(hour.time)} {isRainPredicted(hour.weatherCode) ? "🌧️" : "☀️"}
                    </h2>
                    <p>🌡️ Temperature: {hour.temperature}°C</p>
                    <p>💧 Humidity: {hour.humidity}%</p>
                    <p>🌦️ Precipitation: {hour.precipitation} mm</p>
                </div>
            ))}
        </div>
        </>
    );
}
 
export default WeatherComponent;