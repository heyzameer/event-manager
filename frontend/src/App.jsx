import { useState } from 'react'
import './App.css'
import { Toaster } from 'react-hot-toast';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Toaster position="top-right" />
      <h1>Event Manager</h1>
      <button onClick={() => toast.success('Success!')}>Success</button>
      <button onClick={() => toast.error('Error!')}>Error</button>
      <button onClick={() => toast.loading('Loading...')}>Loading</button>
    </>
  )
}

export default App
