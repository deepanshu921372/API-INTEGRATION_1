import React from 'react';
import Weather from './component/Weather';
import './App.css';

const App = () => {
    return (
        <div className="App">
            <h1>Global Weather Dashboard</h1>
            <Weather />
        </div>
    );
};

export default App;