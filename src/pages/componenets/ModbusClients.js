import React, {useEffect, useState} from 'react';
import axios from "axios";
import {DELETE_MODBUS_CLIENT, GET_ALL_MODBUS_CLIENT, SAVE_MODBUS_CLIENT} from "../../utils/API_PATH";
import {BiEdit} from "react-icons/bi";
import {RiDeleteBin6Fill} from "react-icons/ri";
import Modal from 'react-modal';


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

    const [modbusC,setModbusC] = useState({});
    const sendData=()=>{
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
            })
            .catch(error=>{
                console.log(error.message)
                setIsOpen(false)
            })
    }

    const deleteModC=(id)=>{
        axios.delete(DELETE_MODBUS_CLIENT+id)
            .then(res=>{
                getMClients()
            })

    }

    useEffect(()=>{
       getMClients()
    },[])
        return (
            <div>
                <h1>Modbus Clients</h1>
                <button className="btn btn-success py-2 my-2" onClick={openModal}>Add</button>
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
                                <td><input type="checkbox" checked={mClient.enable}/></td>
                                <td><button className="btn btn-primary"><BiEdit/></button></td>
                                <td><button className="btn btn-danger" onClick={()=>deleteModC(mClient.id)}><RiDeleteBin6Fill/></button></td>
                            </tr>
                        )}
                        </tbody>
                    </table>
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
                </div>
            </div>
        );
}

export default ModbusClients;