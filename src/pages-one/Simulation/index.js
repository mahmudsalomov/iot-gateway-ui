import {Button, Checkbox, Col, Popconfirm, Row, Typography, Modal, Form, Input} from "antd";
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import {useEffect, useState} from "react";
import {toast, ToastContainer} from "react-toastify";
import instance from "../../utils/axios_config";
import {FaEdit} from "react-icons/fa";
import {DeleteOutlined} from "@ant-design/icons";
import {BiAddToQueue} from "react-icons/bi";

function Simulation() {
    const [form] = Form.useForm()
    const [simulations,setSimulations] = useState([]);
    const [loading,setLoading] = useState(false);
    const [loader, setLoader] = useState(false)
    const [total,setTotal] = useState(0);
    const [page,setPage]=useState(10);
    const [open, setOpen] = useState({open: false, item: undefined});

    const getAllSimulation=async ()=>{
        try {
            setLoading(true);
            let resp = await instance({
                method:"get",
                url:"/simulation"
            })
            console.log("RESSSSSSSSSSS : ",resp)
            setLoading(false)
            setSimulations(resp?.data)
        }catch (e){
            console.log("error")
            toast.error("Disconnect server")
        }
    }

    const sendData = async (values) => {

    }

    const changeIsEnabled=async (simulation,value)=>{
        try {
            console.log("connnn : ",value)
            let res = await instance({
                method:"get",
                url: `/simulation/isConnect/${simulation?.id}`
            })
            console.log(res);
            if (value){
                toast.success(simulation?.name+" - Connected")
            }else {
                toast.warning(simulation?.name+" - Disconnected")
            }
        }catch (e){
            console.log("error");
            toast.error("Server no connect")
        }
    }

    useEffect(()=>{
        getAllSimulation()
    },[]);
    return(
        <div>
            <Row gutter={24}>
                <Col span={24}>
                    <Typography.Title level={4}>
                        Симуляция
                    </Typography.Title>
                    <Button type={"primary"} className="my-1 bg-success"><BiAddToQueue style={{fontSize:"26px"}} onClick={()=>setOpen({open: true, item: undefined})} /></Button>
                </Col>
                <Col span={24}>
                    <table style={{verticalAlign: "middle"}} className="table table-bordered table-striped table-hover responsiveTable w-100">
                        <thead className="d-md-table-header-group">
                            <tr>
                                <th className="d-sm-none d-md-table-cell text-center">T/R</th>
                                <th className="d-sm-none d-md-table-cell text-center">ID</th>
                                <th className="d-sm-none d-md-table-cell text-center">Name</th>
                                <th className="d-sm-none d-md-table-cell text-center">Polling</th>
                                <th className="d-sm-none d-md-table-cell text-center">Topic</th>
                                <th className="d-sm-none d-md-table-cell text-center">Enable</th>
                                <th className="d-sm-none d-md-table-cell text-center">Изменить / Удалить</th>
                            </tr>
                        </thead>
                        <tbody>
                            {simulations?.map((simulation,key) =>
                                <tr>
                                    <td className="text-center">{key + 1}</td>
                                    <td className="text-center">{simulation?.id}</td>
                                    <td className="text-center">{simulation?.name}</td>
                                    <td className="text-center">{simulation?.polling}</td>
                                    <td className="text-center">{simulation?.topic}</td>
                                    <td className="text-center"><Checkbox defaultChecked={simulation?.enable} onChange={(e)=>changeIsEnabled(simulation,e.target.checked)} /></td>
                                    <td className="text-center">
                                        <div className="d-flex justify-content-lg-center p-2">
                                            <FaEdit
                                                style={{color: 'green',fontSize: 24}}
                                              />

                                            <Popconfirm
                                                title={"Are sure?"}>
                                                <DeleteOutlined style={{color: 'red' ,fontSize: 24}}/>
                                            </Popconfirm>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <ToastContainer />


                {/*    ***************************** MODAL ************************/}

                    <Modal
                        footer={false}
                        open={open.open}
                        onCancel={() => setOpen({open: false, item: undefined})}
                        title="Добавить окно симуляция"
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
export default Simulation