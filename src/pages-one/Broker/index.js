import {
    Spin,
    Button,
    message,
    Popconfirm,
    Pagination,
    Form,
    Row,
    Col,
    Tooltip,
    Modal,
    Input
} from "antd";
import {useState} from "react";
import instance from "../../utils/axios_config";
import {FaEdit} from "react-icons/fa";
import {DeleteOutlined} from "@ant-design/icons";
import {useGetAllData} from "../../custom_hooks/useGetAllData";
import {MdAddCircle} from "react-icons/md";


function Broker() {
    const [form] = Form.useForm()
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [open, setOpen] = useState({open: false, item: undefined});
    const [loader, setLoader] = useState(false);


    const _brokers = useGetAllData({
        url: "/broker",
        params: {
            page: currentPage,
            size: pageSize
        },
        reFetch: [currentPage, pageSize]
    })


    const remove = async (id) => {
        try {
            let resp = await instance({
                method: "delete",
                url: `/broker/${id}`
            })
            await _brokers.fetch();
            message.success(resp.data.message)
        } catch (e) {
            message.error("Error")
        }
    }

    const sendData = async (values) => {
        if (open?.item) {
            values = {...values, id: open?.item}
        }
        setLoader(true)
        try {
            let resp = await instance({
                method: open?.item ? "put" : "post",
                url: "/broker",
                data: values
            })
            if (resp?.data?.success) {
                await _brokers.fetch();
                setLoader(false)
                message.success(resp.data.message)
                setOpen({open: false, item: undefined});
                form.resetFields()
            } else {
                message.error("Error")
                setLoader(false)
            }
        } catch (e) {
            console.log(e)
            message.error("Error")
            setLoader(false)
        }
    }


    return (
        <div>
            <Spin spinning={_brokers.loading} size={20} direction="vertical">
                <Row gutter={24} style={{alignItems: "center"}} className="mb-4 justify-content-end">
                    <Col span={4}>
                        <div style={{float: "right"}}>
                            <Tooltip title="Добавление нового брокера" className="me-1">
                                <Button type="primary" className=""
                                        onClick={() => setOpen({open: true, item: undefined})}>
                                    <MdAddCircle style={{color: "white", fontSize: "20px"}}/>
                                </Button>
                            </Tooltip>
                        </div>
                    </Col>
                </Row>
                <table style={{verticalAlign: "middle"}}
                       className="table table-bordered table-striped table-hover responsiveTable w-100">
                    <thead className="d-md-table-header-group text-center">
                    <tr>
                        <th className="d-sm-none d-md-table-cell" style={{width: "50px"}}>ИД</th>
                        <th className="d-sm-none d-md-table-cell">ИП адрес</th>
                        <th className="d-sm-none d-md-table-cell">Порт</th>
                        <th className="d-sm-none d-md-table-cell" style={{width: "180px"}}>Действия</th>
                    </tr>
                    </thead>
                    <tbody className="text-center">
                    {_brokers.data?.map((item, key) =>
                        <tr key={key}>
                            <td>{item.id}</td>
                            <td>{item.ipAddress}</td>
                            <td>{item.port}</td>
                            <td>
                                <div className="d-flex justify-content-evenly p-2">
                                    <Tooltip title="Изменить" color="green">
                                        <FaEdit
                                            style={{cursor: 'pointer', color: 'green', marginLeft: 20, fontSize: 22}}
                                            onClick={() => {
                                                setOpen({open: true, item: item.id})
                                                form.setFieldsValue(item)
                                            }}/>
                                    </Tooltip>

                                    <Tooltip title="Удалить" color="red">
                                        <Popconfirm okText="Да" cancelText="Отменить"
                                                    title={"Вы действительно хотите выполнить это действие?"}
                                                    onConfirm={() => remove(item.id)}>
                                            <DeleteOutlined
                                                style={{color: 'red', marginLeft: 40, fontSize: 22}}/>
                                        </Popconfirm>
                                    </Tooltip>

                                </div>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
                <div className="d-flex justify-content-end">
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={_brokers._meta.totalElements}
                        onChange={(page) => setCurrentPage(page)}
                        onShowSizeChange={(page, size) => setPageSize(size)}
                        showSizeChanger={true}
                    />
                </div>

                <Modal
                    footer={false}
                    open={open.open}
                    onCancel={() => {
                        setOpen({open: false, item: undefined})
                        form.resetFields()
                    }}
                    title={open?.item ? "Изменить" : "Добавить"}
                    width={700}
                    centered
                >
                    <Form form={form} layout="vertical" onFinish={sendData}>
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item rules={[{required: true, message: "Обязательное поле"}]} name="ipAddress"
                                           label="ИП адрес">
                                    <Input placeholder="ИП адрес"/>
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item rules={[{required: true, message: "Обязательное поле"}]} name="port"
                                           label="Порт">
                                    <Input placeholder="Порт"/>
                                </Form.Item>
                            </Col>

                            <Col span={24} className="d-flex justify-content-end">
                                <Button onClick={() => {
                                    setOpen(false);
                                    form.resetFields()
                                }} type="primary" danger htmlType="button">Отменить</Button>
                                <Button type="default" className="mx-1" htmlType="reset">Сброс</Button>
                                <Button loading={loader} type="primary" htmlType="submit">Отправить</Button>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </Spin>
        </div>
    );
}

export default Broker