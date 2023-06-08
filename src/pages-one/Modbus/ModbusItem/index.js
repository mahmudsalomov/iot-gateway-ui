import {
    Button,
    Col,
    Form,
    Input,
    message,
    Modal,
    Pagination,
    Popconfirm,
    Row,
    Select,
    Spin,
    Tooltip,
    Typography
} from "antd";
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import React, {useEffect, useState} from "react";
import instance from "../../../utils/axios_config";
import {FaEdit} from "react-icons/fa";
import {DeleteOutlined} from "@ant-design/icons";
import {BiAddToQueue} from "react-icons/bi";
import {useGetAllData} from "../../../custom_hooks/useGetAllData";

const {Option} = Select
const {TextArea} = Input

function ModbusItem() {
    const [form] = Form.useForm()
    const [registers, setRegisters] = useState([]);
    const [changeModClient, setChangeModClient] = useState({})
    const [registerVarTypes, setRegisterVarTypes] = useState([]);
    const [loader, setLoader] = useState(false)
    const [reload, setReload] = useState(false)
    const [open, setOpen] = useState({open: false, item: undefined});
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [statusSelect, setStatusSelect] = useState({
        statusSelection: ""
    });

    const  _clients = useGetAllData({
        url: "/protocol/modbus/client",
        params: {page: currentPage, size: pageSize},
        reFetch: [currentPage, pageSize]
    })

    const  _items = useGetAllData({
        url: "/protocol/modbus/item",
        params: {page: currentPage, size: pageSize},
        reFetch: [currentPage, pageSize]
    })
    const getIRegisters = async () => {
        try {
            let resp = await instance({
                method: "get",
                url: "/protocol/modbus/register-type/all"
            })
            console.log("reg  : ", resp?.data?.object)
            setRegisters(resp?.data?.object)
        } catch (e) {
            message.error("Error")
        }
    }
    const getIRegisterVarTypes = async () => {
        try {
            let resp = await instance({
                method: "get",
                url: "/protocol/modbus/registerVar-type/all"
            })
            console.log("reg  : ", resp?.data?.object)
            setRegisterVarTypes(resp?.data?.object)
        } catch (e) {
            message.error("Error")
        }
    }
    const sendData = async (values) => {
        let methodType = "";
        values["modbusC"] = changeModClient;
        if (open.item) {
            values["id"] = open?.item
            methodType="put"
        }else {
            methodType+="post"
        }
    // ...modClients?.find(item=>item?.id===Number(values?.modbusC))
    //     console.log(modClients?.find(item=>item?.id===Number(values?.modbusC)))
    //     values = {...values,changeModClient}
        console.log(values)
        setLoader(true)
        try {
            let resp = await instance({
                method: methodType,
                url: "/protocol/modbus/item",
                data: values
            })
            // if (resp?.data?.success) {
            setLoader(false)
            message.success(resp.data.message)
            setOpen({open: false, item: undefined});
            form.resetFields()
            setReload(!reload)
            _items.fetch()
            // } else {
            //     message.error("Error")
            //     setLoader(false)
            // }
        } catch (e) {
            message.error("Error")
            setLoader(false)
        }
    }

    const changeModbusClient = async (id) => {
        _clients.data?.map(mClient => {
            if (mClient?.id == id) {
                setChangeModClient(mClient);
                _items.fetch()
            }
        })
    }

    const removeModbusItem = async (id) => {
        try {
            let resp = await instance({
                method: "delete",
                url: `/protocol/modbus/item/${id}`
            })
            _items.fetch()
        } catch (e) {
            message.error("Error")
        }
    }

    useEffect(() => {
        getIRegisters();
        getIRegisterVarTypes();
    }, []);

    return (
        <div>
           <Spin spinning={_clients.loading} size={20} direction="vertical">
               <Row gutter={24} className="align-items-center">
                   <Col sm={24} xs={12} md={12} lg={2} className="d-flex align-items-center">
                       <Tooltip title="Добавление нового элемента" className="me-1">
                           <Button type={"primary"} onClick={() => setOpen({open: true, item: undefined})}
                                   className="my-1 bg-success"><BiAddToQueue style={{fontSize: "26px"}}/></Button>
                       </Tooltip>
                   </Col>
                   <Col sm={24} xs={12} md={12} lg={4}>
                       <Select allowClear
                               className="mx-2 w-100"
                               onSelect={(value) => {
                                   setStatusSelect({
                                       modbusC: value,
                                       statusSelection: "modbusC"
                                   })
                                   form.setFieldValue("modbusC", value)
                               }}
                               onClear={() => {
                                   form.setFieldsValue({
                                       modbusC: undefined,
                                   })
                               }}
                               onChange={(e) => changeModbusClient(e)}
                       >
                           {_clients.data?.map((modC, key) =>
                               <Option key={modC?.id}>{modC?.name}</Option>
                           )}
                       </Select>
                   </Col>
               </Row>
               <Row gutter={24}>
                   <Col span={24}>
                       <table style={{verticalAlign: "middle",overflowY:"scroll",maxHeight:"90%"}}
                              className="table table-bordered table-striped table-hover responsiveTable w-100">
                           <thead className="d-md-table-header-group">
                           <tr>
                               <th className="d-sm-none d-md-table-cell text-center">T/R</th>
                               <th className="d-sm-none d-md-table-cell text-center">ID</th>
                               <th className="d-sm-none d-md-table-cell text-center">Tag name</th>
                               <th className="d-sm-none d-md-table-cell text-center">Address</th>
                               <th className="d-sm-none d-md-table-cell text-center">Var type</th>
                               <th className="d-sm-none d-md-table-cell text-center">Register</th>
                               <th className="d-sm-none d-md-table-cell text-center">Value</th>
                               <th className="d-sm-none d-md-table-cell text-center">Действия</th>
                           </tr>
                           </thead>
                           <tbody>
                           {
                               _items.data?.map((item, key) =>
                                   <tr>
                                       <td className="text-center">{((currentPage-1) * pageSize) + (key + 1)}</td>
                                       <td className="text-center">{item?.id}</td>
                                       <td className="text-center">{item?.tagName}</td>
                                       <td className="text-center">{item?.address}</td>
                                       <td className="text-center">{item?.type}</td>
                                       <td className="text-center">{item?.register}</td>
                                       <td className="text-center">{item?.value}</td>
                                       <td className="text-center">
                                           <div className="d-flex justify-content-lg-center p-2">
                                               <Tooltip title="Изменить" className="me-1" color={"green"}>
                                                   <FaEdit
                                                            style={{color: 'green', fontSize: 24}}
                                                            onClick={() => {
                                                            console.log("click")
                                                            setOpen({open: true, item: item?.id})
                                                            form.setFieldsValue(item)
                                                   }}/>
                                               </Tooltip>
                                               <Tooltip title="Удалить" className="me-1" color={"red"}>
                                                    <Popconfirm
                                                                okText={"Да"}
                                                                cancelText={"Отменить"}
                                                                onConfirm={() => removeModbusItem(item?.id)}
                                                                title={"Вы уверены, что хотите удалить элемент?"}>
                                                                <DeleteOutlined style={{color: 'red', fontSize: 24}}/>
                                                    </Popconfirm>
                                               </Tooltip>
                                           </div>
                                       </td>
                                   </tr>
                               )
                           }
                           </tbody>
                       </table>

                       <Pagination
                           style={{float:"right"}}
                           showQuickJumper
                           current={currentPage}
                           pageSize={pageSize}
                           total={_items?._meta.totalElements}
                           onChange={(page) => setCurrentPage(page)}
                           onShowSizeChange={(page, size) => setPageSize(size)}
                           showSizeChanger={true} />

                       {/*    ************************Modal***************************/}
                       <Modal
                           footer={false}
                           open={open.open}
                           onCancel={() => {setOpen({open: false, item: undefined})
                               form.resetFields()
                           }}
                           title="Окно добавления пункты modbus"
                       >
                           <Form form={form} layout="vertical" onFinish={sendData}>
                               <Row gutter={24}>
                                   <Col span={24}>
                                       <Form.Item rules={[{required: true, message: "Fill the field!"}]} name="tagName"
                                                  label="Tag name">
                                           <Input placeholder="Enter tag name"/>
                                       </Form.Item>
                                   </Col>
                                   <Col span={24}>
                                       <Form.Item rules={[{required: true, message: "Fill the field!"}]} name="register"
                                                  label="Register">
                                           <Select allowClear
                                                   onSelect={(value) => {
                                                       setStatusSelect({
                                                           register: value,
                                                           statusSelection: "register"
                                                       })
                                                   }}
                                                   onClear={() => {
                                                       form.setFieldsValue({
                                                           register: undefined,
                                                       })
                                                   }}
                                           >
                                               {registers?.map((register, key) =>
                                                   <Option key={register}>{register}</Option>
                                               )}
                                           </Select>
                                       </Form.Item>
                                   </Col>
                                   <Col span={24}>
                                       <Form.Item rules={[{required: true, message: "Fill the field!"}]} name="type"
                                                  label="Enter Register var type">
                                           <Select allowClear
                                                   onSelect={(value) => {
                                                       setStatusSelect({
                                                           type: value,
                                                           statusSelection: "type"
                                                       })
                                                   }}
                                                   onClear={() => {
                                                       form.setFieldsValue({
                                                           type: undefined,
                                                       })
                                                   }}
                                           >
                                               {registerVarTypes?.map((registertype, key) =>
                                                   <Option key={registertype}>{registertype}</Option>
                                               )}
                                           </Select>
                                       </Form.Item>
                                   </Col>
                                   <Col span={24}>
                                       <Form.Item rules={[{required: true, message: "Fill the field!"}]} name="address"
                                                  label="Address">
                                           <Input type="number" placeholder="Enter address"/>
                                       </Form.Item>
                                   </Col>
                                   <Form.Item rules={[{required: true, message: "Fill the field!"}]} name="modbusC"
                                              label="Modbus Client">
                                       <Select allowClear
                                               onSelect={(value) => {
                                                   setStatusSelect({
                                                       modbusC: value,
                                                       statusSelection: "modbusC"
                                                   })
                                               }}
                                               onClear={() => {
                                                   form.setFieldsValue({
                                                       modbusC: {},
                                                   })
                                               }}
                                       >
                                           {_clients.data?.map((modC, key) =>
                                               <Option key={modC?.id}>{modC?.name}</Option>
                                           )}
                                       </Select>
                                   </Form.Item>
                                   <Col span={24} className="d-flex justify-content-end">
                                       <Button onClick={() => {
                                           setOpen({open: false, item: undefined})
                                           form.resetFields()
                                       }} type="primary" danger htmlType="button">Cancel</Button>
                                       <Button type="default" className="mx-1" htmlType="reset">Reset</Button>
                                       <Button loading={loader} type="primary" htmlType="submit">Send</Button>
                                   </Col>
                               </Row>
                           </Form>
                       </Modal>

                   </Col>
               </Row>
           </Spin>
        </div>
    );
}

export default ModbusItem