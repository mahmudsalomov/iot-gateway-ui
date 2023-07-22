import {Route, Routes} from "react-router-dom";
import ModbusItem from "../../pages-one/Modbus/ModbusItem";
import Login from "../auth/Login";
import ModbusClient from "../../pages-one/Modbus/ModbusClient";
import Simulation from "../../pages-one/SimulationPage/Simulation";
import SimulationValue from "../../pages-one/SimulationPage/SimulationValue";
import HttpRest from "../../pages-one/HttpRestTemplate/HttpRest";
import HttpRestItem from "../../pages-one/HttpRestTemplate/HttpRestItem";
import Broker from "../../pages-one/Broker";
import Topic from "../../pages-one/Topic";
import Websocket from "../../pages-one/Websocket/Websocket";
import WebsocketItem from "../../pages-one/Websocket/WebsocketItem";
import Jdbc from "../../pages-one/Jdbc/Jdbc";
import JdbcItem from "../../pages-one/Jdbc/JdbcItem";

function AppRoutes() {
    return(
        <div>
            <Routes>
                <Route path="/" element={<ModbusClient />}></Route>
                <Route path="/item" element={<ModbusItem />}></Route>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/simulation" element={<Simulation />}></Route>
                <Route path="/simValue" element={<SimulationValue />}></Route>
                <Route path="/httpRest" element={<HttpRest />}></Route>
                <Route path="/httpRestItem" element={<HttpRestItem />}></Route>
                <Route path="/broker" element={<Broker />}></Route>
                <Route path="/topic" element={<Topic />}></Route>
                <Route path="/websocket" element={<Websocket />}></Route>
                <Route path="/websocketItem" element={<WebsocketItem />}></Route>
                <Route path="/jdbc" element={<Jdbc />}></Route>
                <Route path="/jdbcItem" element={<JdbcItem />}></Route>
            </Routes>
        </div>
    );
}
export default AppRoutes