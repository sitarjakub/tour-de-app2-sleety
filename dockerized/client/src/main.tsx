import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom'

import './css/index.css'
import App from './components/App'
import Login from './components/Login'
import Add from './components/Add'
import AddPerson from './components/AddPerson'
import AddCateg from './components/AddPerson'
import AddCategory from './components/AddCategory'
import Profile from './components/Profile'

function RequireAuth({children}:{children: JSX.Element}){
  const nav = useNavigate();

  function logout(){
    sessionStorage.getItem("adminkey") && sessionStorage.removeItem("adminkey");
    sessionStorage.removeItem("key");
    nav('/login')
  }

  return sessionStorage.getItem("key")
    ? <>
        <header>
          <div className="header-nav">
            <Link to='/'>Home</Link>
            <Link to='/add'>Add post</Link>
            {sessionStorage.getItem("adminkey") && <Link to='/add-person'>Add programmer</Link>}
            <Link to='/add-category'>Add category</Link>
            <Link to='/profile'>Profile</Link>
          </div>
          <button className='logout' onClick={logout}>Logout</button>
        </header>
        {children}
      </>
    : <Navigate to={'/login'} />
}

function RequireAdmin({children}:{children: JSX.Element}){
  return sessionStorage.getItem("key") && sessionStorage.getItem("adminkey")
    ? children : <Navigate to={'/login'} />
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<RequireAuth><App /></RequireAuth>} />
        <Route path='/add' element={<RequireAuth><Add /></RequireAuth>} />
        <Route path='/add-person' element={<RequireAdmin><RequireAuth><AddPerson /></RequireAuth></RequireAdmin>} />
        <Route path='/add-category' element={<RequireAuth><AddCategory /></RequireAuth>} />
        <Route path='/profile' element={<RequireAuth><Profile /></RequireAuth>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
