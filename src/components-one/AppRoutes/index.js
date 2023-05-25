import {Route, Routes} from "react-router-dom";
import ModbusItem from "../../pages-one/ModbusItem";
import Login from "../auth/Login";
import ModbusClient from "../../pages-one/ModbusClient";

function AppRoutes() {
    return(
        <div>
            <Routes>
                <Route path="/" element={<ModbusClient />}></Route>
                <Route path="/item" element={<ModbusItem />}></Route>
                <Route path="/login" element={<Login />}></Route>
            </Routes>
        </div>
    );
}
export default AppRoutes