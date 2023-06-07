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
    Row,
    Spin,
    Tooltip,
    Typography
} from "antd";
import {BiAddToQueue} from "react-icons/bi";
import {useEffect, useState} from "react";
import {useGetAllData} from "../../../custom_hooks/useGetAllData";
import {FaEdit} from "react-icons/fa";
import {DeleteOutlined} from "@ant-design/icons";
import {toast, ToastContainer} from "react-toastify";
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import 'react-toastify/dist/ReactToastify.css';
import instance from "../../../utils/axios_config";

function Rest() {
    const [form] = Form.useForm()
    const [loader, setLoader] = useState(false)
    const [reload, setReload] = useState(false)
    const [open, setOpen] = useState({open: false, item: undefined});
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const  _httpRests = useGetAllData({
        url: "/protocol/httpRest/getHttpPages",
        params: {page: currentPage, size: pageSize},
        reFetch: [currentPage, pageSize]
    })

    const changeIsConnected = async () =>{

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
            message.error("Error")
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
                        <Typography.Title level={4}>
                            HttpRest
                        </Typography.Title>
                        <Tooltip title="Добавление нового HttpRest" className="me-1">
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
                                        <td className="text-center"><Checkbox defaultChecked={httRest?.enable}
                                                                              onChange={(e) => changeIsConnected(httRest, e.target.checked)}></Checkbox>
                                        </td>
                                        <td className="text-center">
                                            <div className="d-flex justify-content-lg-center p-2">
                                                <FaEdit
                                                    style={{color: 'green', cursor: "pointer", fontSize: 24}}
                                                    onClick={() => {
                                                        console.log("click")
                                                        setOpen({open: true, item:httRest ?.id})
                                                        form.setFieldsValue(httRest)
                                                    }}/>

                                                <Popconfirm
                                                    onConfirm={() => removeHttpRest(httRest)}
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
                                    {/*<Col span={24}>*/}
                                    {/*    <Form.Item rules={[{required: true, message: "Fill the field!"}]} name="slaveId"*/}
                                    {/*               label="SlaveId">*/}
                                    {/*        <Input type="number" placeholder="Enter slaveId"/>*/}
                                    {/*    </Form.Item>*/}
                                    {/*</Col>*/}
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
export default Rest