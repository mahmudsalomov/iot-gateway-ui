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
    Select,
    Spin,
    Tooltip
} from "antd";
import {MdAddCircle} from "react-icons/md";
import {FaEdit} from "react-icons/fa";
import {DeleteOutlined} from "@ant-design/icons";
import {toast, ToastContainer} from "react-toastify";
import React, {useState} from "react";
import {useGetAllData} from "../../../custom_hooks/useGetAllData";
import instance from "../../../utils/axios_config";

const {Option} = Select
function WebsocketItem() {

    const [form] = Form.useForm();
    const [loader, setLoader] = useState(false);
    const [reload, setReload] = useState(false);
    const [open, setOpen] = useState({open: false, item: undefined});
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [websocketId, setWebsocketId] = useState(null);

    const _websockets = useGetAllData({
        url: "/protocol/websocket/all",
        params: {},
        reFetch: []
    })

    const _items = useGetAllData({
        url: "/protocol/websocket/item/all",
        params: {page: currentPage, size: pageSize, httpRestId: websocketId},
        reFetch: [currentPage, pageSize, websocketId]
    })

    const removeItem = async (id) => {
        try {
            let resp = await instance({
                method: "delete",
                url: `/protocol/websocket/item/delete/${id}`
            })
            _items.fetch()
        } catch (e) {
            message.error("Error")
        }
    }

    const sendData = async (values) => {
        if (open.item) {
            values = {...values, id: open?.item}
        }
        setLoader(true)
        try {
            let resp = await instance({
                method: open.item ? 'put' : 'post',
                url: "/protocol/websocket/item",
                data: values
            })
            setLoader(false)
            message.success(resp.data.message)
            setOpen({open: false, item: undefined});
            form.resetFields()
            setReload(!reload)
            _items.fetch()
        } catch (e) {
            message.error("Error")
            setLoader(false)
        }
    }


    return(
        <div>
            <Spin spinning={_items.loading} size={20} direction="vertical">
                <Row gutter={24} className="mb-4">

                    <Col span={4}>
                        <Select allowClear
                                className="w-100"
                                placeholder="Websocket"
                                onChange={(e) => {
                                    setWebsocketId(e)
                                }}
                        >
                            {_websockets.data?.map((item) =>
                                <Option key={item?.id} value={item?.id}>{item?.name}</Option>
                            )}
                        </Select>
                    </Col>

                    <Col span={4} offset={16}>
                        <div style={{float: "right"}}>
                            <Tooltip title="Добавление нового пункта" className="me-1">
                                <Button type="primary"
                                        onClick={() => setOpen({open: true, item: undefined})}>
                                    <MdAddCircle style={{color: "white", fontSize: "20px"}}/>
                                </Button>
                            </Tooltip>
                        </div>
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col span={24}>
                        <table style={{verticalAlign: "middle", overflowY: "scroll", maxHeight: "90%"}}
                               className="table table-bordered table-striped table-hover responsiveTable w-100">
                            <thead className="d-md-table-header-group">
                            <tr>
                                <th className="d-sm-none d-md-table-cell text-center">ИД</th>
                                <th className="d-sm-none d-md-table-cell text-center">Название тега</th>
                                <th className="d-sm-none d-md-table-cell text-center">HttpRest</th>
                                <th className="d-sm-none d-md-table-cell text-center">Value</th>
                                <th className="d-sm-none d-md-table-cell text-center">Действия</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                _items.data?.map((item, key) =>
                                    <tr>
                                        <td className="text-center">{item?.id}</td>
                                        <td className="text-center">{item?.tagName}</td>
                                        <td className="text-center">{item?.websocketDto?.name}</td>
                                        <td className="text-center">{item?.value}</td>
                                        <td className="text-center">
                                            <div className="d-flex justify-content-center p-2">
                                                <Tooltip title="Изменить" color="green">
                                                    <FaEdit
                                                        style={{color: 'green', fontSize: 24}}
                                                        onClick={() => {
                                                            setOpen({open: true, item: item?.id})
                                                            form.setFieldsValue(item)
                                                        }}/>
                                                </Tooltip>

                                                <Tooltip title="Удалить" color="red">
                                                    <Popconfirm
                                                        onConfirm={() => removeItem(item?.id)}
                                                        okText="Да" cancelText="Отменить"
                                                        title={"Вы действительно хотите выполнить это действие?"}>
                                                        <DeleteOutlined style={{color: 'red', fontSize: 24}}/>
                                                    </Popconfirm>
                                                </Tooltip>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            }
                            </tbody>
                        </table>

                        <ToastContainer/>

                        <Pagination
                            style={{float: "right"}}
                            showQuickJumper
                            current={currentPage}
                            pageSize={pageSize}
                            total={_items?._meta.totalElements}
                            onChange={(page) => setCurrentPage(page)}
                            onShowSizeChange={(page, size) => setPageSize(size)}
                            showSizeChanger={true}/>

                        <Modal
                            footer={false}
                            open={open.open}
                            onCancel={() => {
                                setOpen({open: false, item: undefined})
                                form.resetFields()
                            }}
                            title={open?.item ? "Изменить" : "Добавить"}
                            width={500}
                            centered
                        >
                            <Form form={form} layout="vertical" onFinish={sendData}>
                                <Row gutter={24}>
                                    <Col span={24}>
                                        <Form.Item rules={[{required: true, message: "Обязательное поле"}]}
                                                   name="tagName"
                                                   label="Название тега">
                                            <Input placeholder="Название тега"/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item rules={[{required: true, message: "Обязательное поле"}]}
                                                   name="websocketId"
                                                   label="Websocket">
                                            <Select allowClear placeholder="Websocket">
                                                {_websockets.data?.map((item) =>
                                                    <Option key={item?.id} value={item?.id}>{item?.name}</Option>
                                                )}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={24} className="d-flex justify-content-end">
                                        <Button onClick={() => {
                                            setOpen({open: false, item: undefined})
                                            form.resetFields()
                                        }} type="primary" danger htmlType="button">Отменить</Button>
                                        <Button type="default" className="mx-1" htmlType="reset">Сброс</Button>
                                        <Button loading={loader} type="primary" htmlType="submit">Отправить</Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Modal>
                    </Col>
                </Row>

            </Spin>
        </div>
    )
}
export default WebsocketItem;