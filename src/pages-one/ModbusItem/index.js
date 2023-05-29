import {Button, Col, Form, Input, message, Modal, Pagination, Popconfirm, Row, Select, Typography} from "antd";
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import React, {useEffect, useState} from "react";
import instance from "../../utils/axios_config";
import {FaEdit} from "react-icons/fa";
import {DeleteOutlined} from "@ant-design/icons";
import {BiAddToQueue} from "react-icons/bi";

const {Option} = Select
const {TextArea} = Input

function ModbusItem() {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [registers, setRegisters] = useState([]);
    const [modClients, setModClients] = useState([]);
    const [changeModClient, setChangeModClient] = useState({})
    const [registerVarTypes, setRegisterVarTypes] = useState([]);
    const [loader, setLoader] = useState(false)
    const [reload, setReload] = useState(false)
    const [open, setOpen] = useState({open: false, item: undefined});
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(10);
    const [statusSelect, setStatusSelect] = useState({
        statusSelection: "",
        departmentId: undefined,
        gasPlantId: undefined,
        parentTypeId: undefined,
        parentId: undefined,
    });

    const getItems = async () => {
        try {
            setLoading(true);
            let resp = await instance({
                method: "get",
                url: "/modbus/item"
            })
            console.log(resp?.data?.content)
            setItems(resp?.data?.content)
        } catch (e) {
            message.error("Error")
            setLoading(false)
        }
    }
    const getIRegisters = async () => {
        try {
            setLoading(true);
            let resp = await instance({
                method: "get",
                url: "/modbus/register-type/all"
            })
            console.log("reg  : ", resp?.data)
            setRegisters(resp?.data)
        } catch (e) {
            message.error("Error")
            setLoading(false)
        }
    }
    const getIRegisterVarTypes = async () => {
        try {
            setLoading(true);
            let resp = await instance({
                method: "get",
                url: "/modbus/registerVar-type/all"
            })
            console.log("reg  : ", resp?.data)
            setRegisterVarTypes(resp?.data)
        } catch (e) {
            message.error("Error")
            setLoading(false)
        }
    }

    const getAllMClient = async () => {
        try {
            setLoading(true);
            let resp = await instance({
                method: "get",
                url: "/modbus/client"
            })
            console.log("RESSSSSSSSSSS : ", resp)
            console.log("total : ", resp?.data?.totalElements)
            setLoading(false)
            setTotal(resp?.data?.totalElements)
            setPage(resp?.data?.totalPages)
            setModClients(resp?.data?.content)
        } catch (e) {
            message.error("Error")
            setLoading(false)
        }
    }
    const sendData = async (values) => {
        if (open.item) {
            values["id"] = open?.item
        }
       values["modbusC"] = changeModClient;

        let methodType = "";
        if (values?.id!==null){
            methodType+="put"
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
                url: "/modbus/item",
                data: values
            })
            // if (resp?.data?.success) {
            setLoader(false)
            message.success(resp.data.message)
            setOpen({open: false, item: undefined});
            getItems()
            form.resetFields()
            setReload(!reload)
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
        modClients.map(mClient => {
            if (mClient?.id == id) {
                setChangeModClient(mClient);
            }
        })
    }

    useEffect(() => {
        getItems();
        getIRegisters();
        getAllMClient();
        getIRegisterVarTypes();
    }, []);

    const removeModbusItem = async (id) => {
        try {
            let resp = await instance({
                method: "delete",
                url: `/modbus/item/${id}`
            })
            getItems();
            message.success(resp.data.message)
        } catch (e) {
            message.error("Error")
        }
    }

    return (
        <div>
            <Row gutter={24}>
                <Col span={24}>
                    <Typography.Title level={4}>
                        Пункт Modbus
                    </Typography.Title>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={24} className="d-flex align-items-center">
                    <Button type={"primary"} onClick={() => setOpen({open: true, item: undefined})}
                            className="my-1 bg-success"><BiAddToQueue style={{fontSize: "26px"}}/></Button>
                    <Select allowClear
                            className="mx-2"
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
                        {modClients?.map((modC, key) =>
                            <Option key={modC?.id}>{modC?.name}</Option>
                        )}
                    </Select>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={24}>
                    <table style={{verticalAlign: "middle"}}
                           className="table table-bordered table-striped table-hover responsiveTable w-100">
                        <thead className="d-md-table-header-group">
                        <tr>
                            <th className="d-sm-none d-md-table-cell text-center">T/R</th>
                            <th className="d-sm-none d-md-table-cell text-center">ID</th>
                            <th className="d-sm-none d-md-table-cell text-center">Tag name</th>
                            <th className="d-sm-none d-md-table-cell text-center">Register</th>
                            <th className="d-sm-none d-md-table-cell text-center">Value</th>
                            <th className="d-sm-none d-md-table-cell text-center">Изменить / Удалить</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            items?.map((item, key) =>
                                <tr>
                                    <td className="text-center">{key + 1}</td>
                                    <td className="text-center">{item?.id}</td>
                                    <td className="text-center">{item?.tagName}</td>
                                    <td className="text-center">{item?.register}</td>
                                    <td className="text-center">{item?.value}</td>
                                    <td className="text-center">
                                        <div className="d-flex justify-content-lg-center p-2">
                                            <FaEdit
                                                style={{color: 'green', fontSize: 24}}
                                                onClick={() => {
                                                    console.log("click")
                                                    setOpen({open: true, item: item?.id})
                                                    form.setFieldsValue(item)
                                                }}/>

                                            <Popconfirm
                                                onConfirm={() => removeModbusItem(item?.id)}
                                                title={"Are sure?"}>
                                                <DeleteOutlined style={{color: 'red', fontSize: 24}}/>
                                            </Popconfirm>
                                        </div>
                                    </td>
                                </tr>
                            )
                        }
                        </tbody>
                    </table>

                    <Pagination
                        showQuickJumper
                        defaultCurrent={1}
                        total={total}
                    />

                    {/*    ************************Modal***************************/}
                    <Modal
                        footer={false}
                        open={open.open}
                        onCancel={() => setOpen({open: false, item: undefined})}
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
                                        {modClients?.map((modC, key) =>
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
        </div>
    );
}

export default ModbusItem