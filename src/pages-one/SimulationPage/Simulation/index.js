import {Button, Checkbox, Col, Popconfirm, Row, Typography, Modal, Form, Input, Pagination} from "antd";
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import {useEffect, useState} from "react";
import {toast, ToastContainer} from "react-toastify";
import instance from "../../../utils/axios_config";
import {FaEdit} from "react-icons/fa";
import {DeleteOutlined} from "@ant-design/icons";
import {BiAddToQueue} from "react-icons/bi";
import {useGetAllData} from "../../../custom_hooks/useGetAllData";

function Simulation() {
    const [form] = Form.useForm()
    const [loader, setLoader] = useState(false)
    const [open, setOpen] = useState({open: false, item: undefined});
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const  _simulations = useGetAllData({
        url: "/protocol/simulation/pages",
        params: {page: currentPage, size: pageSize},
        reFetch: [currentPage, pageSize]
    })

    const removeSimulation = async (simulation) => {
        try {
            let res = await instance({
                method:"delete",
                url:`/protocol/simulation/${simulation?.id}`
            })
            toast.success(simulation?.name+" - deleted")
            setOpen({open: false, item: undefined})
            _simulations.fetch()
        }catch (e){
            toast.error("No deleted")
        }
    }

    const sendData = async (values,id) => {
        let methodType = "";
        let url = "";
        if (open?.item){
            values["id"] = open?.item
            methodType="put"
            url=`/protocol/simulation/${values?.id}`
        }else {
            methodType="post"
            url="/protocol/simulation"
        }
        try {
            let res = await instance({
                method:methodType,
                url:url,
                data:values
            })
            setOpen({open: false, item: undefined})
            if (methodType==="put"){
                toast.success(values?.name+" - updated")
            }else {
                toast.success(values?.name+" - saved")
            }
            _simulations.fetch()
        }catch (e){
            console.log("No post")
            toast.error("No saved");
        }
    }

    const changeIsEnabled=async (simulation,value)=>{
        try {
            console.log("connnn : ",value)
            let res = await instance({
                method:"get",
                url: `/protocol/simulation/isConnect/${simulation?.id}`
            })
            console.log(res);
            if (value){
                toast.success(simulation?.name+" - Connected")
            }else {
                toast.warning(simulation?.name+" - Disconnected")
            }
            _simulations.fetch()
        }catch (e){
            console.log("error");
            toast.error("Server no connect")
        }
    }

    useEffect(()=>{
    },[]);
    return(
        <div>
            <Row gutter={24}>
                <Col span={24}>
                    <Typography.Title level={4}>
                        Симуляция
                    </Typography.Title>
                    <Button onClick={()=>setOpen({open: true, item: undefined})} type={"primary"} className="my-1 bg-success"><BiAddToQueue style={{fontSize:"26px"}}  /></Button>
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
                            {_simulations.data?.map((simulation,key) =>
                                <tr>
                                    <td className="text-center">{((currentPage-1) * pageSize) + (key + 1)}</td>
                                    <td className="text-center">{simulation?.id}</td>
                                    <td className="text-center">{simulation?.name}</td>
                                    <td className="text-center">{simulation?.polling}</td>
                                    <td className="text-center">{simulation?.topic}</td>
                                    <td className="text-center"><Checkbox defaultChecked={simulation?.enable} onChange={(e)=>changeIsEnabled(simulation,e.target.checked)} /></td>
                                    <td className="text-center">
                                        <div className="d-flex justify-content-lg-center p-2">
                                            <FaEdit
                                                style={{color: 'green',fontSize: 24}}
                                                onClick={() => {
                                                    console.log("click")
                                                    setOpen({open: true, item: simulation?.id})
                                                    form.setFieldsValue(simulation)
                                                }}
                                              />

                                            <Popconfirm
                                                onConfirm={()=>removeSimulation(simulation)}
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


                    <Pagination
                        showQuickJumper
                        style={{float:"right"}}
                        current={currentPage}
                        pageSize={pageSize}
                        total={_simulations._meta.totalElements}
                        onChange={(page) => setCurrentPage(page)}
                        onShowSizeChange={(page, size) => setPageSize(size)}
                        showSizeChanger={true}
                    />

                {/*    ***************************** MODAL ************************/}

                    <Modal
                        footer={false}
                        open={open.open}
                        onCancel={
                        () => {setOpen({open: false, item: undefined})
                            form.resetFields()
                    }}
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
                                    <Form.Item rules={[{required: true, message: "Fill the field!"}]} name="polling"
                                               label="Polling">
                                        <Input type="number" placeholder="Enter polling"/>
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item name="enable"
                                               label="Enable">
                                        <Checkbox defaultChecked={false}  placeholder="isEnable"/>
                                    </Form.Item>
                                </Col>
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