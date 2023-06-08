import {
    Button,
    Checkbox,
    Col,
    Form,
    Input,
    Modal,
    Pagination,
    Popconfirm,
    Row,
    Select,
    Tooltip,
    Typography
} from "antd";
import {BiAddToQueue} from "react-icons/bi";
import React, {useEffect, useState} from "react";
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import {toast, ToastContainer} from "react-toastify";
import instance from "../../../utils/axios_config";
import {FaEdit} from "react-icons/fa";
import {DeleteOutlined} from "@ant-design/icons";
import {useGetAllData} from "../../../custom_hooks/useGetAllData";

const {Option} = Select
const {TextArea} = Input
function SimulationValue() {
    const [form] = Form.useForm()
    const [open, setOpen] = useState({open: false, item: undefined});
    const [simulation,setSimulation] = useState({});
    const [editState,setEditState] = useState({isEdit:false,simulation:{}});
    const [loader, setLoader] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [statusSelect, setStatusSelect] = useState({
        statusSelection: ""
    });

    const  _simValues = useGetAllData({
        url: "/protocol/simulation/value/pages",
        params: {page: currentPage, size: pageSize},
        reFetch: [currentPage, pageSize]
    })

    const  _simulations = useGetAllData({
        url: "/protocol/simulation/pages",
        params: {page: currentPage, size: pageSize},
        reFetch: [currentPage, pageSize]
    })

    const sendData = async (values) =>{
        console.log("simm : ",simulation)
        let methodType = "";
        let url = "";
        values["simulation"]=simulation;
        if (open?.item){
            values["id"] = open?.item
            methodType = "put";
            url = `/protocol/simulation/value/${values?.id}`
        }else {
            methodType = "post";
            url = "/protocol/simulation/value"
        }
        try {
            let res = await instance({
                method:methodType,
                url:url,
                data:values
            })
            setOpen({open: false, item: undefined});
            form.resetFields()
            if (methodType==="put"){
                toast.success(values?.tagName+" - updated")
            }else {
                toast.success(values?.tagName+" - saved")
            }
            _simValues.fetch()
        }catch (e){
            toast.error("No connect server")
        }
    }

    const setSimulationChange = async (id) =>{
        try {
            _simulations.data?.map(value => {
                if (value?.id==id){
                    setSimulation(value);
                }
                _simValues.fetch()
            })
        }catch (e){
            console.log("error")
        }
    }

    const isConnect = async (simVal,checked) =>{
        try {
            let res = await instance({
                method:"get",
                url:`/protocol/simulation/value/isConnect/${simVal?.id}`
            })
            if (checked){
                toast.success(simVal?.tagName+" - Connected")
            }else {
                toast.warning(simVal?.tagName+" - Disconnected")
            }
            _simValues.fetch()
        }catch (e){
            toast.error("No connect server")
        }
    }
    const removeSimVal = async (value) =>{
        try {
            let res = await instance({
                method:"delete",
                url:`/protocol/simulation/value/${value?.id}`
            })
            _simValues.fetch()
        }catch (e){
            toast.error("No deleted")
        }
    }

    return(
        <div>
            <Row gutter={24} className="align-items-center">
                <Col sm={24} xs={24} md={12} lg={2}>
                    <Tooltip title="Добавление нового элемента" className="me-1">
                        <Button onClick={()=>setOpen({open: true, item: undefined})} type={"primary"} className="my-1 bg-success"><BiAddToQueue style={{fontSize:"26px"}}  /></Button>
                    </Tooltip>
                </Col>
                <Col sm={24} xs={24} md={12} lg={4} >
                    <Select allowClear
                            className="mx-2 w-100"
                            onSelect={(value) => {
                                setStatusSelect({
                                    modbusC: value,
                                    statusSelection: "simulation"
                                })
                                form.setFieldValue("simulation", value)
                            }}
                            onClear={() => {
                                form.setFieldsValue({
                                    modbusC: undefined,
                                })
                            }}
                            onChange={(e) => setSimulationChange(e)}
                    >
                        {_simulations.data?.map((sim, key) =>
                            <Option key={sim?.id}>{sim?.name}</Option>
                        )}
                    </Select>

                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={24}>
                    <table style={{verticalAlign: "middle"}} className="table table-bordered table-striped table-hover responsiveTable w-100">
                        <thead className="d-md-table-header-group">
                            <tr>
                                <th className="d-sm-none d-md-table-cell text-center">T/R</th>
                                <th className="d-sm-none d-md-table-cell text-center">Tag Name</th>
                                <th className="d-sm-none d-md-table-cell text-center">Simulation</th>
                                <th className="d-sm-none d-md-table-cell text-center">Min</th>
                                <th className="d-sm-none d-md-table-cell text-center">Max</th>
                                <th className="d-sm-none d-md-table-cell text-center">Limit Min</th>
                                <th className="d-sm-none d-md-table-cell text-center">Limit Max</th>
                                <th className="d-sm-none d-md-table-cell text-center">Value</th>
                                <th className="d-sm-none d-md-table-cell text-center">Enable</th>
                                <th className="d-sm-none d-md-table-cell text-center">Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {_simValues.data?.map((value,key) =>
                                <tr>
                                    <td className="text-center">{((currentPage-1) * pageSize) + (key + 1)}</td>
                                    <td className="text-center">{value?.tagName}</td>
                                    <td className="text-center">{value?.simulation?.name}</td>
                                    <td className="text-center">{value?.min}</td>
                                    <td className="text-center">{value?.max}</td>
                                    <td className="text-center">{value?.limitMin}</td>
                                    <td className="text-center">{value?.limitMax}</td>
                                    <td className="text-center">{value?.value}</td>
                                    <td className="text-center"><Checkbox onChange={(e)=>isConnect(value,e.target.checked)} defaultChecked={value?.enable}></Checkbox></td>
                                    <td className="text-center">
                                        <div className="d-flex justify-content-lg-center p-2">
                                            <Tooltip title="Изменить" className="me-1" color={"green"}>
                                                <FaEdit
                                                        style={{color: 'green',fontSize: 24}}
                                                        onClick={() => {
                                                        console.log("click")
                                                        setOpen({open: true, item: value?.id})
                                                        form.setFieldsValue(value)
                                                        }}
                                                        />
                                            </Tooltip>
                                            <Tooltip title="Удалить" className="me-1" color={"red"}>
                                                <Popconfirm
                                                            okText={"Да"}
                                                            cancelText={"Отменить"}
                                                            onConfirm={()=>removeSimVal(value)}
                                                            title={"Вы уверены, что хотите удалить элемент?"}>
                                                            <DeleteOutlined style={{color: 'red' ,fontSize: 24}}/>
                                                </Popconfirm>
                                            </Tooltip>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <ToastContainer />

                    <Pagination
                        style={{float:"right"}}
                        showQuickJumper
                        current={currentPage}
                        pageSize={pageSize}
                        total={_simValues?._meta.totalElements}
                        onChange={(page) => setCurrentPage(page)}
                        onShowSizeChange={(page, size) => setPageSize(size)}
                        showSizeChanger={true} />


                {/*    ******************** MODAL **************************/}

                    <Modal
                        footer={false}
                        open={open.open}
                        onCancel={
                            () => {setOpen({open: false, item: undefined})
                                form.resetFields()
                            }}
                        title="Добавить окно значение симуляция"
                    >
                        <Form form={form} layout="vertical" onFinish={sendData}>
                            <Row gutter={24}>
                                <Col span={24}>
                                    <Form.Item rules={[{required: true, message: "Fill the field!"}]} name="tagName"
                                               label="Tag name">
                                        <Input placeholder="Enter Tag name"/>
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item rules={[{required: true, message: "Fill the field!"}]} name="simulation"
                                               label="Simulation">
                                        <Select allowClear
                                                onSelect={(value) => {
                                                    setStatusSelect({
                                                        simulation: value,
                                                        statusSelection: "simulation"
                                                    })
                                                }}
                                                onClear={() => {
                                                    form.setFieldsValue({
                                                        simulation: {},
                                                    })
                                                }}
                                        >
                                            {_simulations.data?.map(value =>
                                                <Option key={value?.id}>{value?.name}</Option>
                                            )}
                                        </Select>
                                    </Form.Item>
                                    {/*<span>Simulation</span>*/}
                                    {/*<span className="d-block" style={{fontWeight:"bold"}}>{simulation?.id?simulation?.name:"Вы не выбрали симуляция"}</span>*/}
                                </Col>
                                <Col span={24}>
                                    <Form.Item rules={[{required: true, message: "Fill the field!"}]} name="min"
                                               label="Min">
                                        <Input type="number" placeholder="Enter Min"/>
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item rules={[{required: true, message: "Fill the field!"}]} name="max"
                                               label="Max">
                                        <Input type="number" placeholder="Enter Max"/>
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item rules={[{required: true, message: "Fill the field!"}]} name="limitMin"
                                               label="Limit Min">
                                        <Input type="number" placeholder="Enter LimitMin"/>
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item rules={[{required: true, message: "Fill the field!"}]} name="limitMax"
                                               label="Limit Max">
                                        <Input type="number" placeholder="Enter LimitMax"/>
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
export default SimulationValue