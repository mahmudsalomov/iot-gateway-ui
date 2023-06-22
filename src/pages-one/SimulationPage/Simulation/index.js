import {
    Button,
    Checkbox,
    Col,
    Popconfirm,
    Row,
    Spin,
    Modal,
    Form,
    Input,
    Pagination,
    message,
    Select, Tooltip
} from "antd";
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import React, {useEffect, useState} from "react";
import {toast, ToastContainer} from "react-toastify";
import instance from "../../../utils/axios_config";
import {FaEdit} from "react-icons/fa";
import {DeleteOutlined} from "@ant-design/icons";
import {useGetAllData} from "../../../custom_hooks/useGetAllData";
import {MdAddCircle} from "react-icons/md";

const {Option} = Select

function Simulation() {
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

    const _simulations = useGetAllData({
        url: "/protocol/simulation/pages",
        params: {page: currentPage, size: pageSize, brokerId: brokerId, topicId: topicId},
        reFetch: [currentPage, pageSize, brokerId, topicId]
    })

    const removeSimulation = async (simulation) => {
        try {
            let res = await instance({
                method: "delete",
                url: `/protocol/simulation/${simulation?.id}`
            })
            toast.success(simulation?.name + " - deleted")
            setOpen({open: false, item: undefined})
            _simulations.fetch()
        } catch (e) {
            toast.error("No deleted")
        }
    }

    const sendData = async (values) => {
        if (open?.item) {
            values = {...values, id: open?.item}
        }
        setLoader(true)
        try {
            let res = await instance({
                method: open.item ? 'put' : 'post',
                url: '/protocol/simulation',
                data: values
            })
            message.success(res.data.message)
            setOpen({open: false, item: undefined})
            form.resetFields()
            _simulations.fetch()
        } catch (e) {
            message.error("Error")
        } finally {
            setLoader(false)
        }
    }

    const changeIsEnabled = async (simulation, value) => {
        try {
            console.log("connnn : ", value)
            let res = await instance({
                method: "get",
                url: `/protocol/simulation/isConnect/${simulation?.id}`
            })
            console.log(res);
            if (value) {
                toast.success(simulation?.name + " - Connected")
            } else {
                toast.warning(simulation?.name + " - Disconnected")
            }
            _simulations.fetch()
        } catch (e) {
            console.log("error");
            toast.error("Server no connect")
        }
    }

    useEffect(() => {
    }, []);
    return (
        <div>
            <Spin spinning={_simulations.loading} size={20} direction="vertical">
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
                               className="table table-bordered table-striped table-hover responsiveTable w-100">
                            <thead className="d-md-table-header-group">
                            <tr>
                                <th className="d-sm-none d-md-table-cell text-center">ИД</th>
                                <th className="d-sm-none d-md-table-cell text-center">Название</th>
                                <th className="d-sm-none d-md-table-cell text-center">Поллинг</th>
                                <th className="d-sm-none d-md-table-cell text-center">Топик</th>
                                <th className="d-sm-none d-md-table-cell text-center">Брокер</th>
                                <th className="d-sm-none d-md-table-cell text-center">Статус</th>
                                <th className="d-sm-none d-md-table-cell text-center">Действия</th>
                            </tr>
                            </thead>
                            <tbody>
                            {_simulations.data?.map((simulation) =>
                                <tr>
                                    <td className="text-center">{simulation?.id}</td>
                                    <td className="text-center">{simulation?.name}</td>
                                    <td className="text-center">{simulation?.polling}</td>
                                    <td className="text-center">{simulation?.topic?.name}</td>
                                    <td className="text-center">{simulation?.topic?.broker?.ipAddress + ':' + simulation?.topic?.broker?.port}</td>
                                    <td className="text-center"><Checkbox defaultChecked={simulation?.enable}
                                                                          onChange={(e) => changeIsEnabled(simulation, e.target.checked)}/>
                                    </td>
                                    <td className="text-center">
                                        <div className="d-flex justify-content-center p-2">
                                            <Tooltip title="Изменить" color="green">
                                                <FaEdit
                                                    style={{color: 'green', fontSize: 24}}
                                                    onClick={() => {
                                                        setOpen({open: true, item: simulation?.id})
                                                        form.setFieldsValue(simulation)
                                                        form.setFieldValue(['brokerId'], simulation.topic?.broker?.id)
                                                        form.setFieldValue(['topicId'], simulation.topic?.id)
                                                        getFormTopics(simulation.topic?.broker?.id)
                                                        form.setFieldsValue(simulation)
                                                    }}
                                                />
                                            </Tooltip>

                                            <Tooltip title="Удалить" color="red">
                                                <Popconfirm
                                                    okText="Да" cancelText="Отменить"
                                                    onConfirm={() => removeSimulation(simulation)}
                                                    title={"Вы действительно хотите выполнить это действие?"}>
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
                            style={{float: "right"}}
                            showQuickJumper
                            current={currentPage}
                            pageSize={pageSize}
                            total={_simulations?._meta.totalElements}
                            onChange={(page) => setCurrentPage(page)}
                            onShowSizeChange={(page, size) => setPageSize(size)}
                            showSizeChanger={true}/>

                        <Modal
                            footer={false}
                            open={open.open}
                            onCancel={
                                () => {
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
                                    <Col span={24}>
                                        <Form.Item rules={[{required: true, message: "Обязательное поле"}]} name="polling"
                                                   label="Поллинг">
                                            <Input type="number" placeholder="Поллинг"/>
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

export default Simulation