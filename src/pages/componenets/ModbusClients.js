import React, {useEffect, useState} from 'react';
import axios from "axios";
import {
    DELETE_MODBUS_CLIENT,
    EDIT_MODBUS_CLIENT,
    GET_ALL_MODBUS_CLIENT, IS_CONNECT_ID_MODBUS_CLIENT,
    SAVE_MODBUS_CLIENT, SEARCH_BY_NAME_MODBUS_CLIENT
} from "../../utils/API_PATH";
import {BiEdit} from "react-icons/bi";
import {RiDeleteBin6Fill} from "react-icons/ri";
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const ModbusClients =()=> {
    const [modbusClients,setModbusClients] = useState([]);
    const getMClients=()=>{
        axios.get(GET_ALL_MODBUS_CLIENT)
            .then(response=>{
                setModbusClients(response.data)
            })
            .catch(error=>{
                console.log(error.message)
            })
    }

    const [modalIsOpen, setIsOpen] = React.useState(false);

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            border:'1px solid #052036'
        },
    };

    function openModal() {
        setIsOpen(true);
    }
    function closeModal() {
        setIsOpen(false);
    }


    const [eModalIsOpen, setEditIsOpen] = React.useState(false);
    function openEditModal() {
        setEditIsOpen(true);
    }
    function closeEditModal() {
        setEditIsOpen(false);
    }

    const sendData=()=>{
        if (document.getElementById('name').value!=="" && document.getElementById('ip').value!=="" && document.getElementById('port').value!=='' && document.getElementById('polling').value!=='' && document.getElementById('slaveId').value!==''){
            axios.post(SAVE_MODBUS_CLIENT,{
                id:null,
                name:document.getElementById('name')?.value,
                ip:document.getElementById('ip')?.value,
                port:document.getElementById('port')?.value,
                polling:document.getElementById('polling')?.value,
                slaveId:document.getElementById('slaveId')?.value,
                enable:document.getElementById('enable')?.checked
            })

                .then(res=>{
                    console.log(res)
                    setIsOpen(false)
                    getMClients()
                    toast.success("Saved");
                })
                .catch(error=>{
                    toast.error("Error");
                    setIsOpen(false)
                })
        }else {
            toast.error("Object null! No saved")
        }
    }
    const deleteModC=(id)=>{
        axios.delete(DELETE_MODBUS_CLIENT+id)
            .then(res=>{
                getMClients()
                toast.success("Deleted");
            })
            .catch(Error=>{
                toast.error("Error");
            })

    }

    const [editModC,setEditModC] = useState({});
    const [name,setName] = useState("");
    const [ip,setIp] = useState("");
    const [port,setPort] = useState(0);
    const [polling,setPolling] = useState(0);
    const [slaveId,setSlaveId] = useState(0);
    const [enable,setEnable] = useState(false);
    const editModbusC=(modC)=>{
        openEditModal();
        setEditModC(modC);
    }

    const sendEditData=()=>{
        axios.put(EDIT_MODBUS_CLIENT,{
            id:editModC.id,
            name:name!==""?name:editModC.name,
            ip:ip!==""?ip:editModC.ip,
            port:port!==0?port:editModC.port,
            polling:polling!==0?polling:editModC.polling,
            slaveId:slaveId!==0?slaveId:editModC.slaveId,
            enable:enable
        })
            .then(res=>{
                getMClients()
                console.log(res);
                closeEditModal();
                toast.success("Edited");


            })
            .catch(error=>{
                toast.error("Error");
            })
    }

    const changeIsConnected=(id,checked)=>{
        axios.get(IS_CONNECT_ID_MODBUS_CLIENT+id)
            .then(res=>{
                getMClients();
                checked?toast.success("Connected"):toast.error("Disconnected");
            })
            .catch(error=>{
                toast.error("Error");
            })
    }

    const search=(name)=>{
        if (name!==""){
            axios.get(SEARCH_BY_NAME_MODBUS_CLIENT+name)
                .then(res=>{
                    console.log("dsdsd : ",res)
                    setModbusClients(res.data)
                })
                .catch(error=>{
                    console.log(error.message)
                })
        }else {
            getMClients()
        }
    }

    useEffect(()=>{
       getMClients()
    },[])
        return (
            <div>
                <h1>Modbus Clients</h1>
                <div className="d-flex align-items-center">
                    <button className="btn btn-success py-2 my-2" onClick={openModal}>Add</button>
                    <input type="text" className="form-control-sm mx-2" onChange={(e)=>search(e.target.value)} placeholder="search"/>
                </div>
                <div>
                    <table className="table table-striped table-bordered">
                        <thead>
                        <tr>
                            <th>T/R</th>
                            <th>ID</th>
                            <th>Ip</th>
                            <th>Name</th>
                            <th>Port</th>
                            <th>Enable</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                        </thead>
                        <tbody>
                        {modbusClients?.map((mClient,key)=>
                            <tr>
                                <td>{key+1}</td>
                                <td>{mClient.id}</td>
                                <td>{mClient.ip}</td>
                                <td>{mClient.name}</td>
                                <td>{mClient.port}</td>
                                <td><input type="checkbox" className="form-check-input my-2" checked={mClient.enable} style={{fontSize:"24px"}} onChange={(e)=>changeIsConnected(mClient.id,e.target.checked)} /></td>
                                <td><button className="btn btn-primary" onClick={()=>editModbusC(mClient)}><BiEdit/></button></td>
                                <td><button className="btn btn-danger" onClick={()=>deleteModC(mClient.id)}><RiDeleteBin6Fill/></button></td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                    <ToastContainer />
                    <Modal
                        style={customStyles}
                        isOpen={modalIsOpen}
                        contentLabel="Example Modal"
                    >
                        <h4 className="text-center">Add Modbus Client</h4>
                        <div>
                            <input id="name" className="form-control my-2" required={true} type="text" placeholder="Enter Name"/>
                            <input id="ip" className="form-control my-2" required={true} type="text" placeholder="Enter Ip address"/>
                            <input id="port" className="form-control my-2" required={true} type="number" placeholder="Enter Port"/>
                            <input id="polling" className="form-control my-2" required={true} type="number" placeholder="Enter Polling"/>
                            <input id="slaveId" className="form-control my-2" required={true} type="number" placeholder="Enter Slave ID"/>
                            <div className="d-flex justify-content-between align-items-center p-2 my-2 border">
                                <p className="m-0">Check isEnabled</p>
                                <input id="enable" style={{fontSize:"24px"}} className="form-check-input my-2" type="checkbox" />
                            </div>
                        </div>
                        <div className="d-flex justify-content-between">
                            <button onClick={closeModal} className="btn btn-danger">close</button>
                            <button onClick={()=>sendData()} className="btn btn-success">Save</button>
                        </div>
                    </Modal>

                    <Modal
                        style={customStyles}
                        isOpen={eModalIsOpen}
                        contentLabel="Example Modal"
                    >
                        <h4 className="text-center">Edit Modbus Client</h4>
                        <div>
                            <input id="name" className="form-control my-2" defaultValue={editModC?.name} onChange={(e)=>setName(e.target.value)}  required={true} type="text" placeholder="Enter Name"/>
                            <input id="ip" className="form-control my-2"  defaultValue={editModC?.ip} onChange={(e)=>setIp(e.target.value)} required={true} type="text" placeholder="Enter Ip address"/>
                            <input id="port" className="form-control my-2" defaultValue={editModC?.port} onChange={(e)=>setPort(e.target.value)} required={true} type="number" placeholder="Enter Port"/>
                            <input id="polling" className="form-control my-2" defaultValue={editModC?.polling} onChange={(e)=>setPolling(e.target.value)} required={true} type="number" placeholder="Enter Polling"/>
                            <input id="slaveId" className="form-control my-2" defaultValue={editModC?.slaveId} onChange={(e)=>setSlaveId(e.target.value)} required={true} type="number" placeholder="Enter Slave ID"/>
                            <div className="d-flex justify-content-between align-items-center p-2 my-2 border">
                                <p className="m-0">Check isEnabled</p>
                                <input id="enable" defaultChecked={editModC?.enable} style={{fontSize:"24px"}} onChange={(e) => setEnable(e.target.checked)} className="form-check-input my-2" type="checkbox" />
                            </div>
                        </div>
                        <div className="d-flex justify-content-between">
                            <button onClick={closeEditModal} className="btn btn-danger">close</button>
                            <button onClick={()=>sendEditData()} className="btn btn-success">Edit</button>
                        </div>
                    </Modal>

                </div>
            </div>
        );
}

export default ModbusClients;