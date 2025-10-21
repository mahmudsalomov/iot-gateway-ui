import React, {useEffect, useState} from 'react';
import {BiEdit} from "react-icons/bi";
import {RiDeleteBin6Fill} from "react-icons/ri";
import axios from "axios";
import {
    DELETE_MODBUS_ITEM, EDIT_MODBUS_ITEM,
    GET_ALL_MODBUS_CLIENT,
    GET_ALL_MODBUS_ITEM, GET_ALL_REGISTER_TYPE, GET_ALL_REGISTER_VAR_TYPE,
    GET_BY_MC_ID_MODBUS_ITEM,
    GET_ID_MODBUS_CLIENT, SAVE_MODBUS_ITEM
} from "../../utils/API_PATH";
import Modal from "react-modal";
import {type} from "@testing-library/user-event/dist/type";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Select} from "antd";

const ModbusItems =()=> {

    const [modbusItems,setModbusItems] = useState([]);
    const getModItems=()=>{
        axios.get(GET_ALL_MODBUS_ITEM)
            .then(response=>{
                setModbusItems(response.data.content)
                console.log(response.data.content)
            })
    }

    const [modbusClients,setModbusClients] = useState([]);
    const getMClients=()=>{
        axios.get(GET_ALL_MODBUS_CLIENT)
            .then(response=>{
                setModbusClients(response.data)
            })
    }

    const [modbus,setModbus] = useState({})
    const getItemByMCId=(id)=>{
        console.log("id : ",id)
        if (id!==undefined){
            axios.get(GET_BY_MC_ID_MODBUS_ITEM+id)
                .then(res=>{
                    console.log(res.data.content)
                    setModbusItems(res.data.content)
                    getModCById(id)
                })
                .catch(error=>{
                    console.log(error.message)
                })
        }else {
            getModItems();
        }

    }

    const getModCById=(id)=>{
        axios.get(GET_ID_MODBUS_CLIENT+id)
            .then(res=>{
                setModbus(res.data)
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
        },
    };
    function openModal() {
        setIsOpen(true);
    }
    function closeModal() {
        setIsOpen(false);
    }

    const [modalEditIsOpen, setEditIsOpen] = React.useState(false);

    function openEditModal() {
        setEditIsOpen(true);
    }
    function closeEditModal() {
        setEditIsOpen(false);
    }

    const sendData=()=>{
        if (document.getElementById('tagName').value!=="" && document.getElementById('register').value!=="" && document.getElementById('type').value!=="" && document.getElementById('address').value!==''){
            axios.post(SAVE_MODBUS_ITEM,{
                tagName:document.getElementById('tagName').value,
                register:document.getElementById('register').value,
                type:document.getElementById('type').value,
                address:document.getElementById('address').value,
                modbusC:modbus
            })
                .then(res=>{
                    console.log(res)
                    getModItems()
                    setIsOpen(false)
                    toast.success("Saved");
                })
                .catch(error=>{
                    toast.error("No Saved");
                })
        }else {
            toast.error("Object null! No Saved");
        }

    }
    //   ****Register Types*********
    const [types,setTypes] = useState([]);
    const getAllRegisterType=()=>{
        axios.get(GET_ALL_REGISTER_TYPE)
            .then(res=>{
                setTypes(res.data)
            })
    }

    //   ****Register Var Types*********
    const [varTypes,setVarTypes] = useState([]);
    const getAllRegisterVarType=()=>{
        axios.get(GET_ALL_REGISTER_VAR_TYPE)
            .then(res=>{
                setVarTypes(res.data)
            })
    }

    const removeItem=(id)=>{
        axios.delete(DELETE_MODBUS_ITEM+id)
            .then(res=>{
                getModItems()
                toast.success("Deleted");
            })
            .catch(error=>{
                toast.error("No Deleted");
            })
    }


    const [mItem,setMItem] = useState({});
    const [tagname,setTagname] = useState("");
    const [register,setRegister] = useState("");
    const [registerType,setRegisterType] = useState("");
    const [address,setAddress] = useState(0);
    const [mClient,setMClient] = useState({});

    const editItem=(item)=>{
        setMClient(item?.modbusC)
        setMItem(item);
        openEditModal();
    }

    const sendEditData=()=>{
        axios.put(EDIT_MODBUS_ITEM,{
            id:mItem?.id,
            tagName:tagname!==""?tagname:mItem.tagName,
            register:register!==""?register:mItem.register,
            type:registerType!==""?registerType:mItem.type,
            address:address!==0?address:mItem.address,
            modbusC:mClient
        })
            .then(res=>{
                closeEditModal();
                getModItems();
                toast.success("Edited");
            })
            .catch(error=>{
                toast.error("No Edited");
            })
    }

    useEffect(()=>{
        // setInterval(()=>{getModItems()},5000)
        getMClients();
        getAllRegisterType();
        getAllRegisterVarType();
        getModItems()

    },[])

        return (
                <div>
                    <h1>Modbus Items</h1>
                    <div className="d-flex">
                        <button className="btn btn-success  my-2" onClick={openModal}>Add</button>
                        <Select showSearch optionFilterProp="children" onChange={(e)=>getItemByMCId(e)} className="form-select-sm mx-2" id="modbusC">
                            <option value="">Select Modbus Clients</option>
                            {modbusClients?.map((mClient,key)=>
                                    <option  value={mClient.id}>{key+1+" - "+mClient.name}</option>
                            )}
                        </Select>
                    </div>
                    <div className="mt-2">
                        <table className="table table-striped table-bordered">
                            <thead>
                            <tr>
                                <th>T/R</th>
                                <th>ID</th>
                                <th>ADDRESS</th>
                                <th>TAG NAME</th>
                                <th>REGISTER</th>
                                <th>TYPE</th>
                                <th>VALUE</th>
                                <th>Edit</th>
                                <th>Delete</th>
                            </tr>
                            </thead>
                            <tbody>
                            {modbusItems?.map((mItem,key)=>
                                <tr>
                                    <td>{key+1}</td>
                                    <td>{mItem.id}</td>
                                    <td>{mItem.address}</td>
                                    <td>{mItem.tagName}</td>
                                    <td>{mItem.register}</td>
                                    <td>{mItem.type}</td>
                                    <td>{mItem?.value==="ERROR"?"No Segnal":mItem?.value}</td>
                                    <td><button className="btn btn-primary" onClick={()=>editItem(mItem)}><BiEdit/></button></td>

                                    <td><button className="btn btn-danger" onClick={()=>removeItem(mItem.id)}><RiDeleteBin6Fill/></button></td>
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
                            <div>
                                <input id="tagName" className="form-control my-2" required={true} type="text" placeholder="Enter TagName"/>
                                {/*<input id="register" className="form-control my-2" required={true} type="text" placeholder="Enter Register"/>*/}
                                <div className="d-flex justify-content-between align-items-center my-2 p-2 border">
                                    <p className="my-0">Register : </p>
                                    <Select showSearch optionFilterProp="children" name="" id="register" className="form-select-sm">
                                        {
                                            types?.map(type=>
                                                <option value={type}>{type}</option>
                                            )
                                        }
                                    </Select>
                                </div>
                                <div className="d-flex justify-content-between align-items-center my-2 p-2 border">
                                    <p className="my-0">Register Type : </p>
                                    <Select showSearch optionFilterProp="children" name="" id="type" className="form-select-sm">
                                        {
                                            varTypes?.map(type=>
                                                <option value={type}>{type}</option>
                                            )
                                        }
                                    </Select>
                                </div>

                                <input id="address" className="form-control my-2" required={true} type="number" placeholder="Enter Address"/>
                                <div className="d-flex justify-content-between align-items-center p-2 border">
                                    <p className="my-0">Modbus Client : </p>
                                    <Select showSearch optionFilterProp="children" id="modbusC" className="form-select-sm my-1">
                                        <option>{modbus.name}</option>
                                    </Select>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between my-2">
                                <button onClick={closeModal} className="btn btn-danger">close</button>
                                <button onClick={()=>sendData()} className="btn btn-success">Save</button>
                            </div>
                        </Modal>

                        <Modal
                            style={customStyles}
                            isOpen={modalEditIsOpen}
                            contentLabel="Example Modal"
                        >
                            <div>
                                <input id="tagName" className="form-control my-2" defaultValue={mItem.tagName} onChange={(e)=>setTagname(e.target.value)} required={true} type="text" placeholder="Enter TagName"/>
                                {/*<input id="register" className="form-control my-2" required={true} type="text" placeholder="Enter Register"/>*/}
                                <div className="d-flex justify-content-between align-items-center my-2 p-2 border">
                                    <p className="my-0">Register : </p>
                                    <Select showSearch optionFilterProp="children" defaultValue={mItem.register} name="" id="register" onChange={(e)=>setRegister(e.target.value)} className="form-select-sm">
                                        {
                                            types?.map(type=>
                                                <option value={type}>{type}</option>
                                            )
                                        }
                                    </Select>
                                </div>
                                <div className="d-flex justify-content-between align-items-center my-2 p-2 border">
                                    <p className="my-0">Register Type : </p>
                                    <Select showSearch optionFilterProp="children" name="" defaultValue={mItem.type} onChange={(e)=>setRegisterType(e.target.value)} id="type" className="form-select-sm">
                                        {
                                            varTypes?.map(type=>
                                                <option value={type}>{type}</option>
                                            )
                                        }
                                    </Select>
                                </div>

                                <input id="address" defaultValue={mItem.address} onChange={(e)=>setAddress(e.target.value)} className="form-control my-2" required={true} type="number" placeholder="Enter Address"/>
                                <div className="d-flex justify-content-between align-items-center p-2 border">
                                    <p className="my-0">Modbus Client : </p>
                                    <Select showSearch optionFilterProp="children" value={mClient?.name} id="modbusC" className="form-select-sm my-1">
                                        <option>{mClient?.name}</option>
                                    </Select>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between my-2">
                                <button onClick={closeEditModal} className="btn btn-danger">close</button>
                                <button onClick={()=>sendEditData()} className="btn btn-success">Edit</button>
                            </div>
                        </Modal>

                    </div>
                </div>
        );
}

export default ModbusItems;