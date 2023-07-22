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
import {useState} from "react";
import {useGetAllData} from "../../../custom_hooks/useGetAllData";
import instance from "../../../utils/axios_config";

const {Option} = Select
function Jdbc() {
    const [form] = Form.useForm()
    const [loader, setLoader] = useState(false)
    const [open, setOpen] = useState({open: false, item: undefined});
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [brokerId, setBrokerId] = useState(null)
    const [topicId, setTopicId] = useState(null)
    //"org.postgresql.Driver","com.microsoft.sqlserver.jdbc.SQLServerDriver"
    const [jdbcClassNames, setJdbcClassNames] = useState([
        {
            class:"org.postgresql.Driver",
            name:"Postgresql"
        },
        {
            class:"com.microsoft.sqlserver.jdbc.SQLServerDriver",
            name:"Microsoft SQL Server"
        }
    ])
    const _brokers = useGetAllData({
        url: "/broker/all",
        params: {},
        reFetch: []
    })

    const [formTopics, setFormTopics] = useState([])
    const [topics, setTopics] = useState([])

    const _jdbc = useGetAllData({
        url: "/protocol/jdbc/client/all",
        params: {page:currentPage,size:pageSize,topicId:topicId,brokerId:brokerId},
        reFetch: [currentPage,pageSize,topicId,brokerId]
    })

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

    const connect = async (web, value) => {
        try {
            console.log("webbbbbbbbbbbbbbbbbbbbb",web)
            let res = await instance({
                method: "get",
                url: `/protocol/websocket/isConnect/${web?.id}`
            })
            console.log("fefefe",res)
            if (res?.data?.object) {
                toast.success(res?.data.message)
            } else {
                toast.warning(res?.data.message)
            }
            if (res.status!==200){
                toast.error(res?.data.message)
            }
            _jdbc.fetch()
        } catch (e) {
            toast.error("Error")
        }
    }

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

    const removeWebsocket = async (websocket) => {
        try {
            let resp = await instance({
                method: "delete",
                url: `/protocol/websocket/delete/${websocket?.id}`
            })
            toast.success("Delete - " + websocket?.url)
            _jdbc.fetch()
        } catch (e) {
            message.error("Error")
            toast.error("No connect server")
        }
    }

    const sendData = async (values) => {
        try {
            if (open?.item) {
                values = {...values, id: open?.item}
            }
            let response = await instance({
                method: open.item ? 'put' : 'post',
                url: '/protocol/websocket',
                data: values
            })
            message.success(response.data.message)
            setOpen({open: false, item: undefined});
            form.resetFields();
            _jdbc.fetch();
        } catch (e) {
            message.error("Error")
        }
    }


    return (
        <div>
            <Spin spinning={_jdbc.loading} size={20} direction="vertical">
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
                                <th className="d-sm-none d-md-table-cell text-center">URL-адрес</th>
                                <th className="d-sm-none d-md-table-cell text-center">Database</th>
                                <th className="d-sm-none d-md-table-cell text-center">username</th>
                                <th className="d-sm-none d-md-table-cell text-center">password</th>
                                <th className="d-sm-none d-md-table-cell text-center">Поллинг</th>
                                <th className="d-sm-none d-md-table-cell text-center">Топик</th>
                                <th className="d-sm-none d-md-table-cell text-center">Брокер</th>
                                <th className="d-sm-none d-md-table-cell text-center">Статус</th>
                                <th className="d-sm-none d-md-table-cell text-center">Действия</th>
                            </tr>
                            </thead>
                            <tbody>
                            {_jdbc.data?.map((web, key) =>
                                <tr>
                                    <td className="text-center">{web?.id}</td>
                                    <td className="text-center">{web?.name}</td>
                                    <td className="text-center">{web?.url}</td>
                                    <td className="text-center">{web?.jdbcClassName}</td>
                                    <td className="text-center">{web?.username}</td>
                                    <td className="text-center">{web?.password}</td>
                                    <td className="text-center">{web?.polling}</td>
                                    <td className="text-center">{web?.topic?.name}</td>
                                    <td className="text-center">{web?.topic?.broker?.ipAddress + ':' + web?.topic?.broker?.port}</td>
                                    <td className="text-center"><Checkbox defaultChecked={web?.enable}
                                                                          onChange={(e) => connect(web, e.target.checked)}></Checkbox>
                                    </td>
                                    <td className="text-center">
                                        <div className="d-flex justify-content-center p-2">
                                            <Tooltip title="Изменить" color="green">
                                                <FaEdit
                                                    style={{color: 'green', cursor: "pointer", fontSize: 24}}
                                                    onClick={() => {
                                                        setOpen({open: true, item: web?.id})
                                                        form.setFieldsValue(web)
                                                        form.setFieldValue(['brokerId'], web.topic?.broker?.id)
                                                        form.setFieldValue(['topicId'], web.topic?.id)
                                                        getFormTopics(web.topic?.broker?.id)
                                                        form.setFieldsValue(web)
                                                    }}/>
                                            </Tooltip>

                                            <Tooltip title="Удалить" color="red">
                                                <Popconfirm
                                                    onConfirm={() => removeWebsocket(web)}
                                                    okText="Да" cancelText="Отменить"
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
                            showQuickJumper
                            style={{float: "right"}}
                            current={currentPage}
                            pageSize={pageSize}
                            total={_jdbc?._meta.totalElements}
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
                            title={open?.item ? "Изменить" : "Добавить"}
                            centered
                            width={600}
                        >
                            <Form form={form} layout="vertical" onFinish={sendData}>
                                <Row gutter={24}>
                                    <Col span={12}>
                                        <Form.Item rules={[{required: true, message: "Обязательное поле"}]} name="name"
                                                   label="Название">
                                            <Input placeholder="Название"/>
                                        </Form.Item>
                                    </Col>

                                    <Col span={12}>
                                        <Form.Item rules={[{required: true, message: "Обязательное поле"}]} name="polling"
                                                   label="Поллинг">
                                            <Input type="number" placeholder="Поллинг"/>
                                        </Form.Item>
                                    </Col>

                                    <Col span={12}>
                                        <Form.Item rules={[{required: true, message: "Обязательное поле"}]} name="url"
                                                   label="URL-адрес">
                                            <Input placeholder="URL-адрес"/>
                                        </Form.Item>
                                    </Col>

                                    <Col span={12}>
                                        <Form.Item rules={[{required: true, message: "Обязательное поле"}]}
                                                   name="jdbcClassName"
                                                   label="Database">
                                            <Select style={{width: "100%"}} allowClear placeholder="Database"
                                                    onChange={(e) => {
                                                        // getFormTopics(e)
                                                        // form.resetFields(['topicId']);
                                                    }}>

                                                {jdbcClassNames?.map(d=>
                                                    <Option key={d.class}
                                                            value={d.class}>{d.name}</Option>
                                                )}
                                            </Select>
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
    )
}

export default Jdbc;