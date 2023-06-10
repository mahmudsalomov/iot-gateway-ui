import {
    Button,
    Col,
    Form,
    Input,
    message,
    Modal,
    Pagination,
    Popconfirm,
    Checkbox,
    Row,
    Spin, Select, Tooltip
} from "antd";
import {FaEdit} from "react-icons/fa";
import {DeleteOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import instance from "../../../utils/axios_config";
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import 'react-toastify/dist/ReactToastify.css';
import {GrUpdate} from "react-icons/gr";
import {toast, ToastContainer} from "react-toastify";
import {useGetAllData} from "../../../custom_hooks/useGetAllData";
import {MdAddCircle} from "react-icons/md";

const {Option} = Select

function ModbusClient() {
    const [form] = Form.useForm()
    const [loader, setLoader] = useState(false)
    const [open, setOpen] = useState({open: false, item: undefined});
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [brokerId, setBrokerId] = useState(null)
    const [topicId, setTopicId] = useState(null)
    const _brokers = useGetAllData({
        url: "/broker/all",
        params: {},
        reFetch: []
    })

    const [formTopics, setFormTopics] = useState([])
    const [topics, setTopics] = useState([])


    const getTopics = async (e) => {
        try {
            let resp = await instance({
                method: "get",
                url: `/topic/filter?brokerId=${e}`
            })
            if (resp?.data?.success)
                setTopics(resp?.data?.object)
            else {
                setTopics([])
                setTopicId(null);
            }
        } catch (e) {
            console.log(e.message)
        }
    };
    const getFormTopics = async (e) => {
        try {
            let resp = await instance({
                method: "get",
                url: `/topic/filter?brokerId=${e}`
            })
            if (resp?.data?.success)
                setFormTopics(resp?.data?.object)
            else {
                setFormTopics([])
                form.resetFields(['topicId']);
            }
        } catch (e) {
            console.log(e.message)
        }
    };


    const _clients = useGetAllData({
        url: "/protocol/modbus/client",
        params: {page: currentPage, size: pageSize, brokerId: brokerId, topicId: topicId},
        reFetch: [currentPage, pageSize, brokerId, topicId]
    })

    const sendData = async (values) => {
        if (open.item) {
            values = {...values, id: open?.item}
        }
        setLoader(true)
        try {
            let resp = await instance({
                method: open.item ? 'put' : 'post',
                url: "/protocol/modbus/client",
                data: values
            })
            message.success(resp.data.message)
            setOpen({open: false, item: undefined});
            _clients.fetch()
            form.resetFields()
        } catch (e) {
            message.error("Error")
        }finally {
            setLoader(false)
        }
    }

    const resetModC = async (client) => {
        try {
            setLoader(true)
            let resp = await instance({
                method: "get",
                url: `/protocol/modbus/client/reset/${client?.id}`
            })
            setLoader(false)
            _clients.fetch()
            toast.success("reset " + client?.name)
            console.log(resp)
        } catch (e) {
            console.log("error")
            setLoader(false)
        }
    }
    const removeModbusClient = async (client) => {
        try {
            let resp = await instance({
                method: "delete",
                url: `/protocol/modbus/client/${client?.id}`
            })
            message.success(resp.data.message)
            _clients.fetch()
            toast.success("Delete - " + client?.name)
        } catch (e) {
            message.error("Error")
        }
    }

    const changeIsConnected = async (client, value) => {
        setLoader(true)
        try {
            console.log("connnn : ", value)
            let res = await instance({
                method: "get",
                url: `/protocol/modbus/client/isConnect/${client?.id}`
            })
            console.log(res);

            setLoader(false)
            if (value) {
                toast.success(client?.name + " - Connected")
            } else {
                toast.warning(client?.name + " - Disconnected")
            }
            _clients.fetch();
        } catch (e) {
            setLoader(false)
            console.log("error");
            toast.error("Server no connect")
        }
    }

    useEffect(() => {

    }, []);


    return (
        <div>
            <Spin spinning={_clients.loading} size={20} direction="vertical">
                <Row gutter={24} className="mb-4">
                    <Col span={4}>
                        <Select style={{width: "100%"}} value={brokerId} allowClear onChange={(e) => {
                            setTopicId(null)
                            setTopics([])
                            setBrokerId(e)
                            getTopics(e)
                        }} placeholder="Брокер">
                            {_brokers.data?.map(item => <Option key={item?.id}
                                                                value={item?.id}>{item?.ipAddress + ':' + item?.port}</Option>)}
                        </Select>
                    </Col>
                    <Col span={4}>
                        <Select style={{width: "100%"}} value={topicId} allowClear onChange={(e) => {
                            setTopicId(e)
                        }} placeholder="Тип протокола">
                            {topics?.map(item => <Option key={item?.id}
                                                         value={item?.id}>{item?.name}</Option>)}
                        </Select>
                    </Col>
                    <Col span={4} offset={12}>
                        <div style={{float: "right"}}>
                            <Tooltip title="Добавление нового протокола" className="me-1">
                                <Button type="primary" className=""
                                        onClick={() => setOpen({open: true, item: undefined})}>
                                    <MdAddCircle style={{color: "white", fontSize: "20px"}}/>
                                </Button>
                            </Tooltip>
                        </div>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={24}>
                        <table style={{verticalAlign: "middle"}}
                               datapagesize={false}
                               className="table table-bordered table-striped table-hover responsiveTable w-100">
                            <thead className="d-md-table-header-group">
                            <tr>
                                <th className="d-sm-none d-md-table-cell text-center">ИД</th>
                                <th className="d-sm-none d-md-table-cell text-center">Название</th>
                                <th className="d-sm-none d-md-table-cell text-center">Поллинг</th>
                                <th className="d-sm-none d-md-table-cell text-center">Слейв ИД</th>
                                <th className="d-sm-none d-md-table-cell text-center">Топик</th>
                                <th className="d-sm-none d-md-table-cell text-center">Брокер</th>
                                <th className="d-sm-none d-md-table-cell text-center">Статус</th>
                                <th className="d-sm-none d-md-table-cell text-center">Обновлять</th>
                                <th className="d-sm-none d-md-table-cell text-center">Действия</th>
                            </tr>
                            </thead>
                            <tbody>
                            {_clients?.data.map((client) =>
                                <tr>
                                    <td className="text-center">{client?.id}</td>
                                    <td className="text-center">{client?.name}</td>
                                    <td className="text-center">{client?.polling}</td>
                                    <td className="text-center">{client?.slaveId}</td>
                                    <td className="text-center">{client?.topic?.name}</td>
                                    <td className="text-center">{client?.topic?.broker?.ipAddress + ':' + client?.topic?.broker?.port}</td>
                                    <td className="text-center"><Checkbox defaultChecked={client?.enable}
                                                                          onChange={(e) => changeIsConnected(client, e.target.checked)}></Checkbox>
                                    </td>
                                    <td className="text-center">
                                        <Popconfirm
                                            onConfirm={() => resetModC(client)}
                                            okText="Да" cancelText="Отменить"
                                            title={"Вы действительно хотите выполнить это действие?"}>
                                            <GrUpdate
                                                style={{
                                                    fontSize: 24,
                                                    cursor: "pointer",
                                                    margin: "0 auto",
                                                    color: "blue"
                                                }}/>
                                        </Popconfirm>
                                    </td>
                                    <td>
                                        <div className="d-flex justify-content-center p-2">
                                            <Tooltip title="Изменить" color="green">
                                                <FaEdit
                                                    style={{color: 'green', cursor: "pointer", fontSize: 24}}
                                                    onClick={() => {
                                                        setOpen({open: true, item: client?.id})
                                                        form.setFieldValue(['brokerId'], client.topic?.broker?.id)
                                                        form.setFieldValue(['topicId'], client.topic?.id)
                                                        getFormTopics(client.topic?.broker?.id)
                                                        form.setFieldsValue(client)
                                                    }}/>
                                            </Tooltip>

                                            <Tooltip title="Удалить" color="red">
                                                <Popconfirm okText="Да" cancelText="Отменить"
                                                            title={"Вы действительно хотите выполнить это действие?"}
                                                            onConfirm={() => removeModbusClient(client)}>
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

                        <ToastContainer/>

                        <Pagination
                            showQuickJumper
                            style={{float: "right"}}
                            current={currentPage}
                            pageSize={pageSize}
                            total={_clients?._meta.totalElements}
                            onChange={(page) => setCurrentPage(page)}
                            onShowSizeChange={(page, size) => setPageSize(size)}
                            showSizeChanger={true}
                        />


                        {/*    ***********************Modal ***********************/}

                        <Modal
                            footer={false}
                            open={open.open}
                            onCancel={() => {
                                setOpen({open: false, item: undefined})
                                form.resetFields()
                            }}
                            title={open?.item ? "Изменить" : "Добавить"}
                            centered
                            width={600}
                        >
                            <Form form={form} layout="vertical" onFinish={sendData}>
                                <Row gutter={24}>
                                    <Col span={24}>
                                        <Form.Item rules={[{required: true, message: "Обязательное поле"}]} name="name"
                                                   label="Название">
                                            <Input placeholder="Название"/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item rules={[{required: true, message: "Обязательное поле"}]}
                                                   name="polling"
                                                   label="Поллинг">
                                            <Input type="number" placeholder="Поллинг"/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item rules={[{required: true, message: "Обязательное поле"}]}
                                                   name="slaveId"
                                                   label="Слейв ИД">
                                            <Input type="number" placeholder="Слейв ИД"/>
                                        </Form.Item>
                                    </Col>

                                    <Col span={12}>
                                        <Form.Item rules={[{required: true, message: "Обязательное поле"}]}
                                                   name="brokerId"
                                                   label="Брокер">
                                            <Select style={{width: "100%"}} allowClear placeholder="Брокер"
                                                    onChange={(e) => {
                                                        getFormTopics(e)
                                                        form.resetFields(['topicId']);
                                                    }}>
                                                {_brokers.data?.map(item => <Option key={item?.id}
                                                                                    value={item?.id}>{item?.ipAddress + ':' + item?.port}</Option>)}
                                            </Select>
                                        </Form.Item>
                                    </Col>

                                    <Col span={12}>
                                        <Form.Item rules={[{required: true, message: "Обязательное поле"}]}
                                                   name="topicId"
                                                   label="Топик">
                                            <Select style={{width: "100%"}} allowClear placeholder="Топик">
                                                {formTopics?.map(item => <Option key={item.id}
                                                                                 value={item.id}>{item.name}</Option>)}
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
    );
}

export default ModbusClient