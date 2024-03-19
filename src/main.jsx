import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Router from './Router'
import { BrowserRouter, useLocation } from 'react-router-dom'
import ReactGA from "react-ga4";
import config from './config'

ReactGA.initialize("G-ZNEV4WGVGJ");

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
)