import Login from "../auth/Login";
import ModbusClient from "../../pages-one/Modbus/ModbusClient";
import ModbusItem from "../../pages-one/Modbus/ModbusItem";
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

export const routes = [
    {
        name: "Login",
        path: "/login",
        requireAuth: false,
        permission: "*",
        component: Login
    },
    {
        name: "ModbusClient",
        path: "/",
        requireAuth: true,
        permission: "per",
        component: ModbusClient
    },
    {
        name: "ModbusItem",
        path: "/item",
        requireAuth: true,
        permission: "per",
        component: ModbusItem
    },
    {
        name: "Simulation",
        path: "/simulation",
        requireAuth: true,
        permission: "per",
        component: Simulation
    },
    {
        name: "SimulationValue",
        path: "/simValue",
        requireAuth: true,
        permission: "per",
        component: SimulationValue
    },
    {
        name: "HttpRest",
        path: "/httpRest",
        requireAuth: true,
        permission: "per",
        component: HttpRest
    },
    {
        name: "HttpRestItem",
        path: "/httpRestItem",
        requireAuth: true,
        permission: "per",
        component: HttpRestItem
    },
    {
        name: "Broker",
        path: "/broker",
        requireAuth: true,
        permission: "per",
        component: Broker
    },
    {
        name: "Topic",
        path: "/topic",
        requireAuth: true,
        permission: "per",
        component: Topic
    },
    {
        name: "Websocket",
        path: "/websocket",
        requireAuth: true,
        permission: "per",
        component: Websocket
    },
    {
        name: "WebsocketItem",
        path: "/websocketItem",
        requireAuth: true,
        permission: "per",
        component: WebsocketItem
    },
    {
        name: "Jdbc",
        path: "/jdbc",
        requireAuth: true,
        permission: "per",
        component: Jdbc
    },
    {
        name: "JdbcItem",
        path: "/jdbcItem",
        requireAuth: true,
        permission: "per",
        component: JdbcItem
    },

]