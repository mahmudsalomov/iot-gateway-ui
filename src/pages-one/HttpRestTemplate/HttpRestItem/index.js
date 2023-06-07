import {Button, Col, Form, Input, Pagination, Popconfirm, Row, Select, Spin, Tooltip, Typography} from "antd";
import {useGetAllData} from "../../../custom_hooks/useGetAllData";
import React, {useState} from "react";
import {BiAddToQueue} from "react-icons/bi";
import {ToastContainer} from "react-toastify";
import {FaEdit} from "react-icons/fa";
import {DeleteOutlined} from "@ant-design/icons";

const {Option} = Select
const {TextArea} = Input
function HttpRestItem() {
    const [form] = Form.useForm();
    const [registers, setRegisters] = useState([]);
    const [changeModClient, setChangeModClient] = useState({});
    const [registerVarTypes, setRegisterVarTypes] = useState([]);
    const [loader, setLoader] = useState(false);
    const [reload, setReload] = useState(false);
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

    const removeHttpRestItem = async () =>{

    }
    const changeHttpRest = async ()=>{

    }

    return(
        <div>
            <Spin spinning={_items.loading} size={20} direction="vertical" >
                <Row gutter={24}>
                    <Col span={24}>
                        <Typography.Title level={4}>
                            HttpRest Item
                        </Typography.Title>
                    </Col>
                </Row>
                <Row gutter={24} className="d-flex align-items-center">

                        <Col sm={24} xs={12} md={12} lg={2} >
                            <Tooltip title="Добавление нового HttpRestItem" className="me-1">
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
                                        <td className="text-center">{value?.value}</td>
                                        <td className="text-center">
                                            <div className="d-flex justify-content-lg-center p-2">
                                                <FaEdit
                                                    style={{color: 'green', cursor: "pointer", fontSize: 24}}
                                                    onClick={() => {
                                                        console.log("click")
                                                        setOpen({open: true, item:value?.id})
                                                        form.setFieldsValue(value)
                                                    }}/>

                                                <Popconfirm
                                                    onConfirm={() => removeHttpRestItem(value)}
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
                            total={_items?._meta.totalElements}
                            onChange={(page) => setCurrentPage(page)}
                            onShowSizeChange={(page, size) => setPageSize(size)}
                            showSizeChanger={true}
                        />

                    </Col>
                </Row>


            </Spin>
        </div>
    );
}
export default HttpRestItem