import React from 'react';
import Landingpage from "./Components/Landingpage.jsx";
import Footer from "./Components/Footer.jsx";
import Registrationpage from "./Components/Registrationpage.jsx";

const App = () => {
    return (
        <div>
            <Landingpage/>
            <Registrationpage/>
            <Footer/>
        </div>
    );
};

export default App;