import logo from './logo.svg';
import {useEffect, useState} from 'react'
import './App.css';
import OtpPage from './components/OtpPage';
import OtpPage2 from './components/OtpPage2';

function App() {
   
  return (
    <div>
    <OtpPage2 number={5}/>
    <OtpPage/>
  </div>
  );
}

export default App;
