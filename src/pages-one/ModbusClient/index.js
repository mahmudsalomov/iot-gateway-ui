import {Button, Col, Form, Input, message, Modal, Pagination, Popconfirm, Checkbox, Typography, Row, Space, Spin} from "antd";
import {FaEdit} from "react-icons/fa";
import {DeleteOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import instance from "../../utils/axios_config";
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import {BiAddToQueue} from "react-icons/bi";

function ModbusClient() {
    const [form] = Form.useForm()
    const [clients,setClients] = useState([]);
    const [loader, setLoader] = useState(false)
    const [reload, setReload] = useState(false)
    const [loading,setLoading] = useState(false);
    const [open, setOpen] = useState({open: false, item: undefined});
    const [total,setTotal] = useState(0);
    const [page,setPage]=useState(10);


    const sendData = async (values) => {
        if (open.item) {
            values["id"] = open?.item
        }
        console.log("open : ",open?.item)
        setLoader(true)
        try {
            let resp = await instance({
                method: "post",
                url: "/modbus/client",
                data: values
            })
            // if (resp?.data?.success) {
                setLoader(false)
                message.success(resp.data.message)
                setOpen({open: false, item: undefined});
                getAllMClient()
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
    const removeModbusClient=async (id)=> {
        try {
            let resp = await instance({
                method: "delete",
                url: `/modbus/client/${id}`
            })
            getAllMClient();
            message.success(resp.data.message)
        } catch (e) {
            message.error("Error")
        }
    }

    const getAllMClient = async ()=>{
        try {
            setLoading(true);
            let resp = await instance({
                method:"get",
                url:"/modbus/client"
            })
            console.log("RESSSSSSSSSSS : ",resp)
            console.log("total : ",resp?.data?.totalElements)
            setTotal(resp?.data?.totalElements)
            setPage(resp?.data?.totalPages)
            setClients(resp?.data?.content)
        }catch (e){
            message.error("Error")
            setLoading(false)
        }
    }

    useEffect(()=>{
        getAllMClient();
    },[]);


    return(
        <div>
            <Row gutter={24}>
                <Col span={24}>
                    <Typography.Title level={4}>
                        Клиенты Modbus
                    </Typography.Title>
                    <Button type={"primary"} onClick={()=>setOpen({open: true, item: undefined})} className="my-1 bg-success"><BiAddToQueue style={{fontSize:"26px"}} /></Button>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={24}>
                    <table style={{verticalAlign: "middle"}} className="table table-bordered table-striped table-hover responsiveTable w-100">
                        <thead className="d-md-table-header-group">
                            <tr>
                                <th className="d-sm-none d-md-table-cell text-center">T/R</th>
                                <th className="d-sm-none d-md-table-cell text-center">ID</th>
                                <th className="d-sm-none d-md-table-cell text-center">IP</th>
                                <th className="d-sm-none d-md-table-cell text-center">Name</th>
                                <th className="d-sm-none d-md-table-cell text-center">Port</th>
                                <th className="d-sm-none d-md-table-cell text-center">Enable</th>
                                <th className="d-sm-none d-md-table-cell text-center">Изменить / Удалить</th>
                            </tr>
                        </thead>
                        <tbody>
                        {clients?.map((client,key)=>
                            <tr>
                                <td className="text-center">{key+1}</td>
                                <td className="text-center">{client?.id}</td>
                                <td className="text-center">{client?.ip}</td>
                                <td className="text-center">{client?.name}</td>
                                <td className="text-center">{client?.port}</td>
                                <td className="text-center"><Checkbox ></Checkbox></td>
                                <td>
                                    <div className="d-flex justify-content-lg-center p-2">
                                        <FaEdit
                                            style={{color: 'green',fontSize: 30}}
                                            onClick={() => {
                                                console.log("click")
                                                setOpen({open: true, item: client?.id})
                                                form.setFieldsValue(client)
                                            }}/>
                                        <Popconfirm
                                            onConfirm={()=>removeModbusClient(client?.id)}
                                                    title={"Are sure?"}>
                                            <DeleteOutlined style={{color: 'red' ,fontSize: 30}}/>
                                        </Popconfirm>
                                    </div>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>

                    <Modal
                        footer={false}
                        open={open.open}
                        onCancel={() => setOpen({open: false, item: undefined})}
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
                                        <Input type="number"  placeholder="Enter port"/>
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item rules={[{required: true, message: "Fill the field!"}]} name="polling"
                                               label="Polling">
                                        <Input type="number"  placeholder="Enter polling"/>
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item rules={[{required: true, message: "Fill the field!"}]} name="slaveId"
                                               label="SlaveId">
                                        <Input type="number"  placeholder="Enter slaveId"/>
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
                                        setOpen(false);
                                        form.resetFields()
                                    }} type="primary" danger htmlType="button">Cancel</Button>
                                    <Button type="default" className="mx-1" htmlType="reset">Reset</Button>
                                    <Button loading={loader} type="primary" htmlType="submit">Send</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Modal>

                    <Pagination
                        showQuickJumper
                        defaultCurrent={1}
                        total={total}
                         />
                </Col>
            </Row>
        </div>
    );
}
export default ModbusClient