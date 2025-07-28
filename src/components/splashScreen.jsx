import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashScreen = () => {
    const [loadingSplash, setLoadingSplash] = useState (true);
    const Navigate = useNavigate();

    useEffect (() => {
        setTimeout(() => {
            setLoadingSplash (false);
        }, 3000);
    }, []);

    if (loadingSplash) {
        return (
            <div className="h-screen flex flex-col justify-center items-center bg-sky-500 text-white">
              <div className="text-5xl font-bold mb-4 animate-bounce">☁️ Sky Cast</div>
              <div className="text-lg animate-pulse">Loading your real time weather app...</div>
            </div>
        );
    }
    else Navigate ('/front-screen');
}
 
export default SplashScreen;