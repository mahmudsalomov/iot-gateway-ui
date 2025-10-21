import {
    Spin,
    Button,
    message,
    Popconfirm,
    Pagination,
    Select,
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

const {Option} = Select

function Topic() {
    const [brokerId, setBrokerId] = useState(null)
    const [protocolType, setProtocolType] = useState(null)
    const [targets, setTargets] = useState(null)
    const [form] = Form.useForm()
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [open, setOpen] = useState({open: false, item: undefined});
    const [loader, setLoader] = useState(false);

    const brokers = useGetAllData({
        url: "/broker/all",
        params: {},
        reFetch: []
    })

    const _topics = useGetAllData({
        url: "/topic/all",
        params: {
            page: currentPage,
            size: pageSize,
            brokerId: brokerId
        },
        reFetch: [currentPage, pageSize, brokerId]
    })

    const _protocol_types = useGetAllData({
        url: "/protocol/type/all",
        params: {},
        reFetch: []
    })

    const getTargets = async (e) => {
        if (!e) {
            form.resetFields(['targetId']);
            setTargets([]);
        }
        try {
            let resp = await instance({
                method: "get",
                url: getTargetUrlByType(e)
            })
            if (resp?.data?.success)
                setTargets(resp?.data?.object)
            else {
                form.resetFields(['targetId']);
                setTargets([])
            }
        } catch (e) {
            console.log(e.message)
        }
    };

    const remove = async (id) => {
        try {
            let resp = await instance({
                method: "delete",
                url: `/topic/${id}`
            })
            await _topics.fetch()
            message.success(resp.data.message)
        } catch (e) {
            message.error("Error")
        }
    }

    const getTargetUrlByType = (e) => {
        switch (e) {
            case 'HTTP':
                return '/protocol/httpRest';
            case 'MODBUS_TCP':
                return '/protocol/modbus/client/all';
            case 'SIMULATION':
                return '/protocol/simulation';
            default :
                return '';
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
                url: "/topic",
                data: values
            })
            if (resp?.data?.success) {
                await _topics.fetch()
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
            <Spin spinning={_topics.loading} size={20} direction="vertical">

                <Row gutter={24} style={{alignItems: "center"}} className="mb-4">
                    <Col span={4}>
                        <Select style={{width: "100%"}} showSearch optionFilterProp="children" value={brokerId} allowClear onChange={(e) => {
                            setBrokerId(e)
                        }} placeholder="Брокер">
                            {brokers.data?.map(item => <Option key={item?.id}
                                                               value={item?.id}>{item?.ipAddress + ':' + item?.port}</Option>)}
                        </Select>
                    </Col>
                    <Col span={4}>
                        <Select style={{width: "100%"}} value={protocolType} showSearch optionFilterProp="children" allowClear onChange={(e) => {
                            setProtocolType(e)
                        }} placeholder="Тип протокола">
                            {_protocol_types.data?.map(item => <Option key={item}
                                                                       value={item}>{item}</Option>)}
                        </Select>
                    </Col>

                    <Col span={4} offset={12}>
                        <div style={{float: "right"}}>
                            <Tooltip title="Добавление нового топика" className="me-1">
                                <Button type="primary" className=""
                                        onClick={() => setOpen({open: true, item: undefined})}>
                                    <MdAddCircle style={{color: "white", fontSize: "20px"}}/>
                                </Button>
                            </Tooltip>
                        </div>
                    </Col>
                </Row>

                <table style={{verticalAlign: "middle", height:'70vh'}}
                       className="table table-bordered table-striped table-hover responsiveTable w-100">
                    <thead className="d-md-table-header-group text-center" style={{display:'table',width:'100%',tableLayout:'fixed'}}>
                    <tr style={{display:'table',width:'100%',tableLayout:'fixed'}}>
                        <th className="d-sm-none d-md-table-cell" style={{width: "50px"}}>ИД</th>
                        <th className="d-sm-none d-md-table-cell">Топик</th>
                        <th className="d-sm-none d-md-table-cell">Брокер</th>
                        <th className="d-sm-none d-md-table-cell">Username</th>
                        <th className="d-sm-none d-md-table-cell">Password</th>
                        <th className="d-sm-none d-md-table-cell" style={{width: "180px"}}>Действия</th>
                    </tr>
                    </thead>
                    <tbody className="text-center" style={{display:'block',height:'90%',overflow:'auto'}}>
                    {_topics.data?.map((item, key) =>
                        <tr key={key} style={{display:'table',width:'100%',tableLayout:'fixed'}}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.broker?.ipAddress + ':' + item.broker?.port}</td>
                            <td>{item.username}</td>
                            <td>{item.password}</td>
                            <td>
                                <div className="d-flex justify-content-center p-2">
                                    <Tooltip title="Изменить" color="green">
                                        <FaEdit
                                            style={{cursor: 'pointer', color: 'green', marginLeft: 20, fontSize: 22}}
                                            onClick={() => {
                                                setOpen({open: true, item: item.id})
                                                getTargets(item.type)
                                                form.setFieldsValue(item)
                                            }}/>
                                    </Tooltip>

                                    <Tooltip title="Удалить" color="red">
                                        <Popconfirm okText="Да" cancelText="Отменить"
                                                    title={"Вы действительно хотите выполнить это действие?"}
                                                    onConfirm={() => remove(item.id)}>
                                            <DeleteOutlined
                                                style={{color: 'red', fontSize: 22}}/>
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
                        total={_topics._meta.totalElements}
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
                                <Form.Item rules={[{required: true, message: "Обязательное поле"}]} name="brokerId"
                                           label="Брокер">
                                    <Select style={{width: "100%"}} showSearch optionFilterProp="children" allowClear placeholder="Брокер">
                                        {brokers.data?.map(item => <Option key={item?.id}
                                                                           value={item?.id}>{item?.ipAddress + ':' + item?.port}</Option>)}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item rules={[{required: true, message: "Обязательное поле"}]} name="name"
                                           label="Название тега">
                                    <Input placeholder="Название тега"/>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item rules={[{required: true, message: "Обязательное поле"}]} name="username"
                                           label="Username">
                                    <Input placeholder="Username"/>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item rules={[{required: true, message: "Обязательное поле"}]} name="password"
                                           label="Password">
                                    <Input placeholder="Password"/>
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

export default Topic