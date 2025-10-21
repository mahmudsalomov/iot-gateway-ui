import {
    Button,
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
    Tooltip,
} from "antd";
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import React, {useEffect, useState} from "react";
import instance from "../../../utils/axios_config";
import {FaEdit} from "react-icons/fa";
import {DeleteOutlined} from "@ant-design/icons";
import {useGetAllData} from "../../../custom_hooks/useGetAllData";
import {MdAddCircle} from "react-icons/md";

const {Option} = Select

function ModbusItem() {
    const [form] = Form.useForm()
    const [registers, setRegisters] = useState([]);
    const [registerVarTypes, setRegisterVarTypes] = useState([]);
    const [loader, setLoader] = useState(false)
    const [reload, setReload] = useState(false)
    const [open, setOpen] = useState({open: false, item: undefined});
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [modbusCId, setModbusCId] = useState(null);

    const _clients = useGetAllData({
        url: "/protocol/modbus/client/all",
        params: {},
        reFetch: []
    })

    const _items = useGetAllData({
        url: "/protocol/modbus/item",
        params: {page: currentPage, size: pageSize, modbusCId: modbusCId},
        reFetch: [currentPage, pageSize, modbusCId]
    })
    const getIRegisters = async () => {
        try {
            let resp = await instance({
                method: "get",
                url: "/protocol/modbus/register-type/all"
            })
            setRegisters(resp?.data?.object)
        } catch (e) {
            message.error("Error")
        }
    }
    const getIRegisterVarTypes = async () => {
        try {
            let resp = await instance({
                method: "get",
                url: "/protocol/modbus/registerVar-type/all"
            })
            console.log("reg  : ", resp?.data?.object)
            setRegisterVarTypes(resp?.data?.object)
        } catch (e) {
            message.error("Error")
        }
    }
    const sendData = async (values) => {
        if (open.item) {
            values = {...values, id: open?.item?.id}
        }
        setLoader(true)
        try {
            let resp = await instance({
                method: open.item ? 'put' : 'post',
                url: "/protocol/modbus/item",
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

    const removeModbusItem = async (id) => {
        try {
            let resp = await instance({
                method: "delete",
                url: `/protocol/modbus/item/${id}`
            })
            _items.fetch()
        } catch (e) {
            message.error("Error")
        }
    }

    useEffect(() => {
        getIRegisters();
        getIRegisterVarTypes();
    }, []);

    return (
        <div>
            <Spin spinning={_clients.loading} size={20} direction="vertical">
                <Row gutter={24} className="mb-4">
                    <Col span={4}>
                        <Select allowClear
                                className="w-100"
                                placeholder="Клиенты Modbus"
                                showSearch
                                optionFilterProp="children"
                                onChange={(e) => {
                                    setModbusCId(e)
                                }}
                        >
                            {_clients.data?.map((modC, key) =>
                                <Option key={modC?.id} value={modC?.id}>{modC?.name}</Option>
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
                        <table style={{verticalAlign: "middle", height:'70vh'}}
                               className="table table-bordered table-striped table-hover responsiveTable w-100">
                            <thead className="d-md-table-header-group" style={{display:'table',width:'100%',tableLayout:'fixed'}}>
                            <tr style={{display:'table',width:'100%',tableLayout:'fixed'}}>
                                <th className="d-sm-none d-md-table-cell text-center">ИД</th>
                                <th className="d-sm-none d-md-table-cell text-center">Название тега</th>
                                <th className="d-sm-none d-md-table-cell text-center">Аддресс</th>
                                <th className="d-sm-none d-md-table-cell text-center">Var type</th>
                                <th className="d-sm-none d-md-table-cell text-center">Регистр</th>
                                <th className="d-sm-none d-md-table-cell text-center">Value</th>
                                <th className="d-sm-none d-md-table-cell text-center">Клиенты Modbus</th>
                                <th className="d-sm-none d-md-table-cell text-center">Действия</th>
                            </tr>
                            </thead>
                            <tbody style={{display:'block',height:'90%',overflow:'auto'}}>
                            {
                                _items.data?.map((item, key) =>
                                    <tr style={{display:'table',width:'100%',tableLayout:'fixed'}}>
                                        <td className="text-center">{item?.id}</td>
                                        <td className="text-center">{item?.tagName}</td>
                                        <td className="text-center">{item?.address}</td>
                                        <td className="text-center">{item?.type}</td>
                                        <td className="text-center">{item?.register}</td>
                                        <td className="text-center">{item?.value}</td>
                                        <td className="text-center">{item?.modbusC?.name}</td>
                                        <td className="text-center">
                                            <div className="d-flex justify-content-center p-2">
                                                <Tooltip title="Изменить" color="green">
                                                    <FaEdit
                                                        style={{color: 'green', fontSize: 24}}
                                                        onClick={() => {
                                                            setOpen({ open: true, item: item });
                                                            form.setFieldsValue({
                                                                ...item,
                                                                modbusCId: item?.modbusC?.id // <--- aynan shu MUHIM
                                                            });
                                                        }}/>
                                                </Tooltip>

                                                <Tooltip title="Удалить" color="red">
                                                    <Popconfirm
                                                        onConfirm={() => removeModbusItem(item?.id)}
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

                        <Pagination
                            style={{float: "right"}}
                            showQuickJumper
                            current={currentPage}
                            pageSize={pageSize}
                            total={_items?._meta.totalElements}
                            onChange={(page) => setCurrentPage(page)}
                            onShowSizeChange={(page, size) => setPageSize(size)}
                            showSizeChanger={true}/>

                        {/*    ************************Modal***************************/}
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
                                    <Col span={12}>
                                        <Form.Item rules={[{required: true, message: "Обязательное поле"}]}
                                                   name="tagName"
                                                   label="Название тега">
                                            <Input placeholder="Название тега"/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item rules={[{required: true, message: "Обязательное поле"}]}
                                                   name="address"
                                                   label="Аддресс">
                                            <Input type="number" placeholder="Аддресс"/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item rules={[{required: true, message: "Обязательное поле"}]}
                                                   name="register"
                                                   label="Регистр">
                                            <Select showSearch optionFilterProp="children" allowClear placeholder="Регистр">
                                                {registers?.map((register, key) =>
                                                    <Option key={register}>{register}</Option>
                                                )}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item rules={[{required: true, message: "Обязательное поле"}]} name="type"
                                                   label="Var type">
                                            <Select showSearch optionFilterProp="children" allowClear placeholder="Var type">
                                                {registerVarTypes?.map((registertype, key) =>
                                                    <Option key={registertype}>{registertype}</Option>
                                                )}
                                            </Select>
                                        </Form.Item>
                                    </Col>

                                    <Col span={24}>
                                        <Form.Item
                                            rules={[{ required: true, message: "Обязательное поле" }]}
                                            name="modbusCId"
                                            label="Клиенты Modbus"
                                        >
                                            <Select
                                                allowClear
                                                placeholder="Клиенты Modbus"
                                                showSearch
                                                optionFilterProp="children"
                                            >
                                                {_clients.data?.map((modC) => (
                                                    <Option key={modC?.id} value={modC?.id}>
                                                        {modC?.name}
                                                    </Option>
                                                ))}
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

export default ModbusItem