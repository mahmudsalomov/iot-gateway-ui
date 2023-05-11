import React from 'react';
import {NavLink} from "react-router-dom";
import { MdOutlineAdminPanelSettings} from "react-icons/md";
import {RiFileList2Fill,RiFileList3Fill} from "react-icons/ri";
import {ImExit} from "react-icons/im";
import './style.css'

const DashboardMenu =(props)=> {
    const styleNavLink = {
        fontSize:"22px",
        textDecoration:"none"
    };
    const styleLi = {
        padding:"3px 0"
    };

        return (
                <div className=" position-fixed p-3 box" style={props.open?{width:"5%"}:{width:"20%"}} >
                    <div className="d-flex justify-content-between align-items-center">
                        <h2 className="text-white"><MdOutlineAdminPanelSettings /> {props.open?"":"IOT Gateway Admin"}</h2>
                    </div>
                    <div style={{backgroundColor:"white",width:"100%",height:"2px"}}></div>
                    <ul className="list-unstyled p-3">
                       <li style={styleLi}><NavLink style={styleNavLink} className="text-white" to="/"><RiFileList2Fill/>{props.open?"":"Modbus Clients"}</NavLink></li>
                       <li style={styleLi}><NavLink style={styleNavLink} className="text-white" to="/items"><RiFileList3Fill/>{props.open?"":"Modbus Items"}</NavLink></li>
                       <li style={styleLi}><NavLink style={styleNavLink} className="text-white" to="/"><ImExit/>{props.open?"":"Exit"}</NavLink></li>
                    </ul>
                </div>
        );
}

export default DashboardMenu;