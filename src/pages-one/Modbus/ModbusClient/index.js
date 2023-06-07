import {
    Button,
    Col,
    Form,
    Input,
    message,
    Modal,
    Pagination,
    Popconfirm,
    Checkbox,
    Typography,
    Row,
    Space,
    Spin
} from "antd";
import {FaEdit} from "react-icons/fa";
import {DeleteOutlined} from "@ant-design/icons";
import { useEffect, useState} from "react";
import instance from "../../../utils/axios_config";
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import 'react-toastify/dist/ReactToastify.css';
import {BiAddToQueue} from "react-icons/bi";
import {GrUpdate} from "react-icons/gr";
import {toast, ToastContainer} from "react-toastify";
import {useGetAllData} from "../../../custom_hooks/useGetAllData";

function ModbusClient() {
    const [form] = Form.useForm()
    const [loader, setLoader] = useState(false)
    const [reload, setReload] = useState(false)
    const [open, setOpen] = useState({open: false, item: undefined});
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);


    const  _clients = useGetAllData({
        url: "/protocol/modbus/client",
        params: {page: currentPage, size: pageSize},
        reFetch: [currentPage, pageSize]
    })

    const sendData = async (values) => {
        let methodType = "";
        let url = "";
        if (open.item) {
            values["id"] = open?.item
            methodType = "put";
            url = `/protocol/modbus/client/${values?.id}`
        }else {
            methodType = "post"
        }
        console.log("open : ", open?.item)
        setLoader(true)
        try {
            let resp = await instance({
                method: methodType,
                url: "/protocol/modbus/client",
                data: values
            })
            // if (resp?.data?.success) {
            setLoader(false)
            message.success(resp.data.message)
            setOpen({open: false, item: undefined});
            _clients.fetch()
            if (methodType === "post") {
                toast.success("saved - " + values?.name)
            } else {
                toast.success("update - " + values?.name)
            }
            form.resetFields()
            setReload(!reload)
            // } else {
            //     message.error("Error")
            //     setLoader(false)
            // }
        } catch (e) {
            message.error("Error")
            if (values["id"] !== null) {
                toast.error("No update")
            } else {
                toast.error("No saved")
            }
            setLoader(false)
        }
    }

    const resetModC = async (client) => {
        try {
            setLoader(true)
            let resp = await instance({
                method: "get",
                url: `/protocol/modbus/client/reset/${client?.id}`
            })
            setLoader(false)
            _clients.fetch()
            toast.success("reset " + client?.name)
            console.log(resp)
        } catch (e) {
            console.log("error")
            setLoader(false)
        }
    }
    const removeModbusClient = async (client) => {
        try {
            let resp = await instance({
                method: "delete",
                url: `/protocol/modbus/client/${client?.id}`
            })
            message.success(resp.data.message)
            _clients.fetch()
            toast.success("Delete - " + client?.name)
        } catch (e) {
            message.error("Error")
        }
    }

    const changeIsConnected = async (client, value) =>  {
        setLoader(true)
        try {
            console.log("connnn : ", value)
            let res = await instance({
                method: "get",
                url: `/protocol/modbus/client/isConnect/${client?.id}`
            })
            console.log(res);

            setLoader(false)
            if (value) {
                toast.success(client?.name + " - Connected")
            } else {
                toast.warning(client?.name + " - Disconnected")
            }
            _clients.fetch();
        } catch (e) {
            setLoader(false)
            console.log("error");
            toast.error("Server no connect")
        }
    }

    useEffect(() => {

    }, []);


    return (
        <div>
            <Spin spinning={_clients.loading} size={20} direction="vertical">
            <Row gutter={24}>
                <Col span={24}>
                    <Typography.Title level={4}>
                        Клиенты Modbus
                    </Typography.Title>
                    <Button type={"primary"} onClick={() => setOpen({open: true, item: undefined})}
                            className="my-1 bg-success"><BiAddToQueue style={{fontSize: "26px"}}/></Button>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={24}>
                    <table style={{verticalAlign: "middle"}}
                           datapagesize={false}
                           className="table table-bordered table-striped table-hover responsiveTable w-100">
                        <thead className="d-md-table-header-group">
                        <tr>
                            <th className="d-sm-none d-md-table-cell text-center">T/R</th>
                            <th className="d-sm-none d-md-table-cell text-center">ID</th>
                            <th className="d-sm-none d-md-table-cell text-center">IP</th>
                            <th className="d-sm-none d-md-table-cell text-center">Name</th>
                            <th className="d-sm-none d-md-table-cell text-center">Port</th>
                            <th className="d-sm-none d-md-table-cell text-center">Polling</th>
                            <th className="d-sm-none d-md-table-cell text-center">Topic</th>
                            <th className="d-sm-none d-md-table-cell text-center">Enable</th>
                            <th className="d-sm-none d-md-table-cell text-center">Обновлять</th>
                            <th className="d-sm-none d-md-table-cell text-center">Изменить / Удалить</th>
                        </tr>
                        </thead>
                        <tbody>
                        {_clients?.data.map((client, key) =>
                            <tr>
                                <td className="text-center">{((currentPage-1) * pageSize) + (key + 1)}</td>
                                <td className="text-center">{client?.id}</td>
                                <td className="text-center">{client?.ip}</td>
                                <td className="text-center">{client?.name}</td>
                                <td className="text-center">{client?.port}</td>
                                <td className="text-center">{client?.polling}</td>
                                <td className="text-center">{client?.topic}</td>
                                <td className="text-center"><Checkbox defaultChecked={client?.enable}
                                                                      onChange={(e) => changeIsConnected(client, e.target.checked)}></Checkbox>
                                </td>
                                <td className="text-center">
                                    <Popconfirm
                                        onConfirm={() => resetModC(client)}
                                        title={"Reset?"}>
                                        <GrUpdate
                                            style={{fontSize: 24, cursor: "pointer", margin: "0 auto", color: "blue"}}/>
                                    </Popconfirm>
                                </td>
                                <td>
                                    <div className="d-flex justify-content-lg-center p-2">
                                        <FaEdit
                                            style={{color: 'green', cursor: "pointer", fontSize: 24}}
                                            onClick={() => {
                                                console.log("click")
                                                setOpen({open: true, item: client?.id})
                                                form.setFieldsValue(client)
                                            }}/>

                                        <Popconfirm
                                            onConfirm={() => removeModbusClient(client)}
                                            title={"Are sure?"}>
                                            <DeleteOutlined style={{color: 'red', fontSize: 24}}/>
                                        </Popconfirm>
                                    </div>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>

                    <ToastContainer/>

                    <Pagination
                        showQuickJumper
                        style={{float:"right"}}
                        current={currentPage}
                        pageSize={pageSize}
                        total={_clients?._meta.totalElements}
                        onChange={(page) => setCurrentPage(page)}
                        onShowSizeChange={(page, size) => setPageSize(size)}
                        showSizeChanger={true}
                    />


                    {/*    ***********************Modal ***********************/}

                    <Modal
                        footer={false}
                        open={open.open}
                        onCancel={() => {
                            setOpen({open: false, item: undefined})
                            form.resetFields()
                        }}
                        title="Окно добавления клиенты modbus"
                    >
                        <Form form={form} layout="vertical" onFinish={sendData}>
                            <Row gutter={24}>
                                <Col span={24}>
                                    <Form.Item rules={[{required: true, message: "Fill the field!"}]} name="name"
                                               label="Name">
                                        <Input placeholder="Enter name"/>
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item rules={[{required: true, message: "Fill the field!"}]} name="ip"
                                               label="Ip address">
                                        <Input placeholder="Enter ip address"/>
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item rules={[{required: true, message: "Fill the field!"}]} name="port"
                                               label="Port">
                                        <Input type="number" placeholder="Enter port"/>
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item rules={[{required: true, message: "Fill the field!"}]} name="polling"
                                               label="Polling">
                                        <Input type="number" placeholder="Enter polling"/>
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item rules={[{required: true, message: "Fill the field!"}]} name="slaveId"
                                               label="SlaveId">
                                        <Input type="number" placeholder="Enter slaveId"/>
                                    </Form.Item>
                                </Col>
                                {/*<Col span={24}>*/}
                                {/*    <Form.Item valuePropName="checked" rules={[{required: false, message: "Fill the field!"}]} name="enable"*/}
                                {/*               label="Is Connected">*/}
                                {/*        <Checkbox  placeholder="Checked enable"/>*/}
                                {/*    </Form.Item>*/}
                                {/*</Col>*/}
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

export default ModbusClient