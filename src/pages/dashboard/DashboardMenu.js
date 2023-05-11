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

        return (
                <div className=" position-fixed p-3 box" style={props.open?{width:"5%"}:{width:"20%"}} >
                    <ul className=" list-unstyled p-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <h3 className="text-white"><MdOutlineAdminPanelSettings style={{fontSize:"32px"}} /> {props.open?"":"IOT Gateway Admin"}</h3>
                        </div>
                        <div className="my-2" style={{backgroundColor:"white",width:"100%",height:"2px"}}></div>
                       <NavLink style={styleNavLink} className="text-white dx d-block" to="/"><RiFileList2Fill/>{props.open?"":"Modbus Clients"}</NavLink>
                       <NavLink style={styleNavLink} className="text-white dx d-block" to="/items"><RiFileList3Fill/>{props.open?"":"Modbus Items"}</NavLink>
                       <NavLink style={styleNavLink} className="text-white dx d-block" to="/"><ImExit/>{props.open?"":"Exit"}</NavLink>
                    </ul>
                </div>
        );
}

export default DashboardMenu;