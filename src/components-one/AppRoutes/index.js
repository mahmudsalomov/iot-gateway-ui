import {Route, Routes} from "react-router-dom";
import ModbusItem from "../../pages-one/ModbusItem";
import Login from "../auth/Login";
import ModbusClient from "../../pages-one/ModbusClient";
import Simulation from "../../pages-one/Simulation";

function AppRoutes() {
    return(
        <div>
            <Routes>
                <Route path="/" element={<ModbusClient />}></Route>
                <Route path="/item" element={<ModbusItem />}></Route>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/simulation" element={<Simulation />}></Route>
            </Routes>
        </div>
    );
}
export default AppRoutes