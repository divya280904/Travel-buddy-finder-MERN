import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import ProposeTrip from './ProposeTrip';
import Interests from './Interests';
import MyTrips from './MyTrips';
//awodndiadxandanoan
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<Home/>}/>
          <Route path="proposetrip" element={<ProposeTrip/>}/>
          <Route path="interests" element={<Interests/>}/>
          <Route path="mytrips" element={<MyTrips/>}/>
        </Route>
        <Route path="register" element={<Register/>}/>
        <Route path="login" element={<Login/>}/>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    
  </React.StrictMode>
);
