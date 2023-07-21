import {io} from "socket.io-client";
import {SOCKET_URL} from "../API_PATH";
import { createContext } from "react";

export const socket = io.connect(SOCKET_URL);
export const SocketContext = createContext();