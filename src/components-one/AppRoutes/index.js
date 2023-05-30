import {Route, Routes} from "react-router-dom";
import ModbusItem from "../../pages-one/Modbus/ModbusItem";
import Login from "../auth/Login";
import ModbusClient from "../../pages-one/Modbus/ModbusClient";
import Simulation from "../../pages-one/SimulationPage/Simulation";
import SimulationValue from "../../pages-one/SimulationPage/SimulationValue";

function AppRoutes() {
    return(
        <div>
            <Routes>
                <Route path="/" element={<ModbusClient />}></Route>
                <Route path="/item" element={<ModbusItem />}></Route>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/simulation" element={<Simulation />}></Route>
                <Route path="/simValue" element={<SimulationValue />}></Route>
            </Routes>
        </div>
    );
}
export default AppRoutes