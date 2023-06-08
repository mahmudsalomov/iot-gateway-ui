import {Button, Col, Form, Input, Modal, Pagination, Popconfirm, Row, Select, Spin, Tooltip, Typography} from "antd";
import {useGetAllData} from "../../../custom_hooks/useGetAllData";
import React, {useState} from "react";
import {BiAddToQueue} from "react-icons/bi";
import {toast, ToastContainer} from "react-toastify";
import {FaEdit} from "react-icons/fa";
import {DeleteOutlined} from "@ant-design/icons";
import instance from "../../../utils/axios_config";
import httpRest from "../HttpRest";

const {Option} = Select
const {TextArea} = Input
function HttpRestItem() {
    const [form] = Form.useForm();
    const [httpRest, setHttpRest] = useState({});
    const [loader, setLoader] = useState(false);
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

    const  _items = useGetAllData({
        url: "/protocol/httpRest/item/all",
        params: {page: currentPage, size: pageSize},
        reFetch: [currentPage, pageSize]
    })

    const removeHttpRestItem = async (value) =>{
        try {
            let res = await instance({
                method:"delete",
                url:`/protocol/httpRest/item/delete/${value.id}`
            })

            toast.success(value.tagName + " - deleted")
            _items.fetch()

        }catch (e){
            console.log(e.message)
        }
    }
    const changeHttpRest = async (id)=>{
        try {
            _httpRests.data?.map(value => {
                if (value?.id==id){
                    setHttpRest(value);
                    console.log(" * * * * * :",value)
                }
                _httpRests.fetch()
            })
        }catch (e){
            console.log("error")
        }
    }

    const sendData = async (values) =>{
        try {
            console.log("********************** : ",httpRest)
            let url = "";
            values["httpRest"] = httpRest;
            if (open.item){
                values["httpRest"] = httpRest;
                values["id"] = open.item;
                url = "/protocol/httpRest/item/update";
            }else {
                url = "/protocol/httpRest/item/save";
            }
            let res = await instance({
                method:open.item ? "put" : "post",
                url:url,
                data:values
            })
            if (open.item) {
                toast.success("update - " + values?.name)
            } else {
                toast.success("save - " + values?.name)
            }
            setLoader(false);
            setOpen({open: false, item: undefined});
            setLoader(false);
            _items.fetch()
            form.resetFields();
        }catch (e){
            console.log(e.message)
        }
    }

    return(
        <div>
            <Spin spinning={_items.loading} size={20} direction="vertical" >
                <Row gutter={24} className="d-flex align-items-center">

                        <Col sm={24} xs={12} md={12} lg={2} >
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
                                            httpRest: value,
                                            statusSelection: "httpRest"
                                        })
                                        form.setFieldValue("httpRest", value)
                                    }}
                                    onClear={() => {
                                        form.setFieldsValue({
                                            modbusC: undefined,
                                        })
                                    }}
                                    onChange={(e) => changeHttpRest(e)}
                            >
                                {_httpRests.data?.map((httpRest, key) =>
                                    <Option key={httpRest?.id}>{httpRest?.name}</Option>
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
                                    <th className="d-sm-none d-md-table-cell text-center">TAGNAME</th>
                                    <th className="d-sm-none d-md-table-cell text-center">PARENT NAME</th>
                                    <th className="d-sm-none d-md-table-cell text-center">PARENT TYPE</th>
                                    <th className="d-sm-none d-md-table-cell text-center">VALUE</th>
                                    <th className="d-sm-none d-md-table-cell text-center">Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                {_items.data?.map((value,key) =>
                                    <tr>
                                        <td className="text-center">{((currentPage-1) * pageSize) + (key + 1)}</td>
                                        <td className="text-center">{value?.id}</td>
                                        <td className="text-center">{value?.tagName}</td>
                                        <td className="text-center">{value?.httpRest?.name}</td>
                                        <td className="text-center">{value?.httpRest?.type}</td>
                                        <td className="text-center">{value?.value}</td>
                                        <td className="text-center">
                                            <div className="d-flex justify-content-lg-center p-2">
                                                <Tooltip title="Изменить" className="me-1" color={"green"}>
                                                    <FaEdit
                                                        style={{color: 'green', cursor: "pointer", fontSize: 24}}
                                                        onClick={() => {
                                                            console.log("click")
                                                            setOpen({open: true, item:value?.id})
                                                            form.setFieldsValue(value)
                                                        }}/>
                                                </Tooltip>
                                                <Tooltip title="Удалить" className="me-1" color={"red"}>
                                                    <Popconfirm
                                                        okText={"Да"}
                                                        cancelText={"Отменить"}
                                                        onConfirm={() => removeHttpRestItem(value)}
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
                            total={_items?._meta.totalElements}
                            onChange={(page) => setCurrentPage(page)}
                            onShowSizeChange={(page, size) => setPageSize(size)}
                            showSizeChanger={true}
                        />

                    {/*    ******************************MODAL********************************/}
                        <Modal
                            footer={false}
                            open={open.open}
                            onCancel={() => {
                                setOpen({open: false, item: undefined})
                                form.resetFields()
                            }}
                            title="Окно добавления HttpRestItem"
                        >
                            <Form form={form} layout="vertical" onFinish={sendData}>
                                <Row gutter={24}>
                                    <Col span={24}>
                                        <Form.Item rules={[{required: true, message: "Fill the field!"}]} name="tagName"
                                                   label="Tag Name">
                                            <Input placeholder="Enter Tag neme"/>
                                        </Form.Item>
                                    </Col>

                                    <Col span={24}>
                                        <Form.Item rules={[{required: true, message: "Fill the field!"}]} name="httpRest"
                                                   label="HttpRest">
                                            <Select allowClear
                                                    onSelect={(value) => {
                                                        setStatusSelect({
                                                            httpRest: value,
                                                            statusSelection: "httpRest"
                                                        })
                                                    }}
                                                    onClear={() => {
                                                        form.setFieldsValue({
                                                            httpRest: {},
                                                        })
                                                    }}
                                                    onChange={(e) => changeHttpRest(e)}
                                            >
                                                {_httpRests.data?.map(value =>
                                                    <Option key={httpRest?.id?httpRest?.id:value?.id}>{httpRest?.id?httpRest?.name:value?.name}</Option>
                                                )}
                                            </Select>
                                        </Form.Item>
                                        {/*<span>Simulation</span>*/}
                                        {/*<span className="d-block" style={{fontWeight:"bold"}}>{simulation?.id?simulation?.name:"Вы не выбрали симуляция"}</span>*/}
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
export default HttpRestItem