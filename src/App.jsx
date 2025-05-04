import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import EndpointsList from "./components/EndpointsList.jsx";

function App() {
  const [count, setCount] = useState(0)

  return (
      <div>
          <h1>Dashboard Asterisk</h1>
          <EndpointsList />
      </div>
  )
}

export default App
