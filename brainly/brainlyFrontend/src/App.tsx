import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { Signin } from './pages/Signin'
import Dashboard from './pages/Dashboard'
import { Signup } from './pages/Signup'

function App() {

  return <BrowserRouter>
  <Routes>
    <Route path='signin' element = {<Signin/>}/>
    <Route path='signup' element = {<Signup/>}/>
    <Route path='dashboard' element = {<Dashboard/>}/>
  </Routes>
  </BrowserRouter>
}

export default App
