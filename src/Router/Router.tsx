import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "../Page/Home.tsx";
import Admin from "../Page/Admin.tsx";
import Manager from "../Page/Manager.tsx";

export default function Router() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/admin" element={<Admin/>}/>
                    <Route path="/admin/level/:levelid" element={<Manager/>}/>
                    <Route path="" element={<Home/>}/>
                    <Route path="*" element={<Home/>}/>
                </Routes>
            </BrowserRouter>
        </>
    )
}