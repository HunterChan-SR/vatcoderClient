// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const serverHost = "";
export const api_url = serverHost + ":2080";
export const proxy_url = serverHost + ":2090";

ReactDOM.createRoot(document.getElementById('root')!).render(
    // <React.StrictMode>
        <App/>
    // </React.StrictMode>,
)
