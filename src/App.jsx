import { Routes, Route } from "react-router-dom";

import FrontPage from "./components/mainComponent";
import SplashScreen from "./components/splashScreen";

function App () {
  return (
      <Routes>
        <Route path = '/' element = {<SplashScreen />} />
        <Route path = '/front-screen' element = {<FrontPage />} />
      </Routes>
  );
}

export default App
