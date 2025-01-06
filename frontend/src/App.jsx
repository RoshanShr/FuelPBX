import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './App.css'

import { pages } from "./components/pages";
import { UserContext } from "./contexts/UserContext";
import { useState } from 'react'

function App() {
  
  const router = createBrowserRouter(pages);
  const [loggedUser, setLoggedUser]
  = useState(JSON.parse(localStorage.getItem("hostedpbx")));

  return (
    <UserContext.Provider value={{ loggedUser, setLoggedUser }}>
      <RouterProvider router={router} />
    </UserContext.Provider>
  );}

export default App;
