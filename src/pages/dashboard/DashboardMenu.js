import React from 'react';
import {NavLink} from "react-router-dom";
import { MdOutlineAdminPanelSettings} from "react-icons/md";
import {RiFileList2Fill,RiFileList3Fill} from "react-icons/ri";
import {ImExit} from "react-icons/im";
import './style.css'

const DashboardMenu =()=> {
    const styleNavLink = {
        fontSize:"22px",
        textDecoration:"none"
    };
    const styleLi = {
        padding:"3px 0"
    };

        return (
                <div className="w-20 position-fixed p-3 box" >
                    <h2 className="text-white"><MdOutlineAdminPanelSettings /> Modbus Admin</h2>
                    <div style={{backgroundColor:"white",width:"100%",height:"2px"}}></div>
                    <ul className="list-unstyled p-3">
                       <li style={styleLi}><NavLink style={styleNavLink} className="text-white" to="/"><RiFileList2Fill/> Modbus Clients</NavLink></li>
                       <li style={styleLi}><NavLink style={styleNavLink} className="text-white" to="/items"><RiFileList3Fill/> Modbus Items</NavLink></li>
                       <li style={styleLi}><NavLink style={styleNavLink} className="text-white" to="/"><ImExit/> Exit</NavLink></li>
                    </ul>
                </div>
        );
}

export default DashboardMenu;