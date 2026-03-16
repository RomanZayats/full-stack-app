import {useEffect, useState} from 'react'
import axios from "axios";

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL;
console.log("API base:", API_URL);

function App() {
  const [message, setMessage] = useState("")

    useEffect(()=>{
        axios.defaults.withCredentials = true;
        axios.get("/api/home").then(res => setMessage(res.data.message)).catch(() => setMessage("Error fetching API"))
    },[])

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <p>
            {message}
        </p>
      </div>
    </>
  )
}

export default App
