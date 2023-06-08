import {
    Button,
    Checkbox,
    Col,
    Form,
    Input,
    message,
    Modal,
    Pagination,
    Popconfirm,
    Row, Select,
    Spin,
    Tooltip,
    Typography
} from "antd";
import {BiAddToQueue} from "react-icons/bi";
import React, {useEffect, useState} from "react";
import {useGetAllData} from "../../../custom_hooks/useGetAllData";
import {FaEdit} from "react-icons/fa";
import {DeleteOutlined} from "@ant-design/icons";
import {toast, ToastContainer} from "react-toastify";
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import 'react-toastify/dist/ReactToastify.css';
import instance from "../../../utils/axios_config";


const {Option} = Select
const {TextArea} = Input
function Rest() {
    const [form] = Form.useForm()
    const [loader, setLoader] = useState(false)
    const [reload, setReload] = useState(false)
    const [open, setOpen] = useState({open: false, item: undefined});
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [statusSelect, setStatusSelect] = useState({
        statusSelection: ""
    });

    const  _httpRests = useGetAllData({
        url: "/protocol/httpRest/getHttpPages",
        params: {page: currentPage, size: pageSize},
        reFetch: [currentPage, pageSize]
    })

    const changeIsConnected = async (id) =>{
        try {
            let res = await instance({
                method:"get",
                url:`/protocol/httpRest/isConnect/${id}`
            })
            console.log("ssssssssssss ** * : ",res);
            if (res.data?.object){
                toast.success(res.data?.message)
            }else {
                toast.warning(res.data?.message)
            }
            _httpRests.fetch()
        }catch (e){
            console.log("No connect server")
        }
    }

    const removeHttpRest = async (httpRest) =>{
        try {
            let resp = await instance({
                method: "delete",
                url: `/protocol/httpRest/delete/${httpRest?.id}`
            })
            toast.success("Delete - " + httpRest?.url)
            _httpRests.fetch()
        } catch (e) {
            toast.error("No connect server")
        }
    }

    const sendData = async (values) =>{
        try {
            let methodType = "";
            let url = "";
            if (open?.item){
                values["id"] = open?.item
                methodType = "put";
                url = `/protocol/httpRest/update/${values.id}`;
            }else {
                methodType = "post";
                url = "/protocol/httpRest/save"
            }
            let response = await instance({
                method:methodType,
                url:url,
                data:values
            })
            if (methodType==="put"){
                toast.success(values.name + " - updated")
            }else {
                toast.success(values.name + " - saved")
            }
            setOpen({open: false, item: undefined});
            form.resetFields();
            _httpRests.fetch();
        }catch (e){
            message.error("Error")
            toast.error("No connect server")
        }
    }

    return(
        <div>
            <Spin spinning={_httpRests.loading} size={20} direction="vertical">
                <Row gutter={24}>
                    <Col span={24}>
                        <Tooltip title="Добавление нового элемента" className="me-1">
                            <Button type={"primary"} onClick={() => setOpen({open: true, item: undefined})}
                                    className="my-1 bg-success"><BiAddToQueue style={{fontSize: "26px"}}/></Button>
                        </Tooltip>

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
                                    <th className="d-sm-none d-md-table-cell text-center">URL</th>
                                    <th className="d-sm-none d-md-table-cell text-center">POLLING</th>
                                    <th className="d-sm-none d-md-table-cell text-center">TYPE</th>
                                    <th className="d-sm-none d-md-table-cell text-center">ENABLE</th>
                                    <th className="d-sm-none d-md-table-cell text-center">Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                {_httpRests.data?.map((httRest,key)=>
                                    <tr>
                                        <td className="text-center">{((currentPage-1) * pageSize) + (key + 1)}</td>
                                        <td className="text-center">{httRest?.id}</td>
                                        <td className="text-center">{httRest?.url}</td>
                                        <td className="text-center">{httRest?.polling}</td>
                                        <td className="text-center">{httRest?.type}</td>
                                        <td className="text-center"><Checkbox defaultChecked={httRest?.enable}
                                                                              onChange={() => changeIsConnected(httRest?.id)}></Checkbox>
                                        </td>
                                        <td className="text-center">
                                            <div className="d-flex justify-content-lg-center p-2">
                                                <Tooltip title="Изменить" className="me-1" color={"green"}>
                                                    <FaEdit
                                                            style={{color: 'green', cursor: "pointer", fontSize: 24}}
                                                            onClick={() => {
                                                            console.log("click")
                                                            setOpen({open: true, item:httRest ?.id})
                                                            form.setFieldsValue(httRest)
                                                            }}/>
                                                </Tooltip>
                                                <Tooltip title="Удалить" className="me-1" color={"red"}>
                                                    <Popconfirm
                                                                okText={"Да"}
                                                                cancelText={"Отменить"}
                                                                onConfirm={() => removeHttpRest(httRest)}
                                                                title={"Вы уверены, что хотите удалить элемент?"}>
                                                                <DeleteOutlined style={{color: 'red', fontSize: 24}}/>
                                                    </Popconfirm>
                                                </Tooltip>
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
                            total={_httpRests?._meta.totalElements}
                            onChange={(page) => setCurrentPage(page)}
                            onShowSizeChange={(page, size) => setPageSize(size)}
                            showSizeChanger={true}
                        />

                        <Modal
                            footer={false}
                            open={open.open}
                            onCancel={() => {
                                setOpen({open: false, item: undefined})
                                form.resetFields()
                            }}
                            title="Окно добавления HttpRest"
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
                                        <Form.Item rules={[{required: true, message: "Fill the field!"}]} name="url"
                                                   label="URL">
                                            <Input placeholder="Enter url"/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item rules={[{required: true, message: "Fill the field!"}]} name="polling"
                                                   label="Polling">
                                            <Input type="number" placeholder="Enter polling"/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item rules={[{required: true, message: "Fill the field!"}]} name="type"
                                                   label="Type">
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
                                                <Option key={"OTHER"}>OTHER</Option>
                                                <Option key={"OGMA"}>OGMA</Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item valuePropName="checked" rules={[{required: false, message: "Fill the field!"}]} name="enable"
                                                   label="Is Connected">
                                            <Checkbox   placeholder="Checked enable"/>
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
            </Spin>
        </div>
    );
}
export default Rest