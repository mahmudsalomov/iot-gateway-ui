import {
    Button,
    Checkbox,
    Col,
    Form,
    Input,
    Modal,
    Pagination,
    Popconfirm,
    Row,
    Spin,
    Select,
    Tooltip,
    message
} from "antd";
import React, {useEffect, useState} from "react";
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import {toast, ToastContainer} from "react-toastify";
import instance from "../../../utils/axios_config";
import {FaEdit} from "react-icons/fa";
import {DeleteOutlined} from "@ant-design/icons";
import {useGetAllData} from "../../../custom_hooks/useGetAllData";
import {MdAddCircle} from "react-icons/md";

const {Option} = Select

function SimulationValue() {
    const [form] = Form.useForm()
    const [open, setOpen] = useState({open: false, item: undefined});
    const [loader, setLoader] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [simulationId, setSimulationId] = useState(null);

    const _simValues = useGetAllData({
        url: "/protocol/simulation/value/pages",
        params: {page: currentPage, size: pageSize, simulationId: simulationId},
        reFetch: [currentPage, pageSize, simulationId]
    })

    const _simulations = useGetAllData({
        url: "/protocol/simulation",
        params: {},
        reFetch: []
    })

    const sendData = async (values) => {
        if (open?.item) {
            values = {...values, id: open?.item}
        }
        setLoader(true)
        try {
            let res = await instance({
                method: open.item ? 'put' : 'post',
                url: '/protocol/simulation/value',
                data: values
            })
            message.success(res.data.message)
            setOpen({open: false, item: undefined});
            form.resetFields()
            _simValues.fetch()
        } catch (e) {
            message.error("Error")
        }finally {
            setLoader(false)
        }
    }
    const removeSimVal = async (value) => {
        try {
            let res = await instance({
                method: "delete",
                url: `/protocol/simulation/value/${value?.id}`
            })
            _simValues.fetch()
        } catch (e) {
            toast.error("No deleted")
        }
    }

    return (
        <div>
            <Spin spinning={_simValues.loading} size={20} direction="vertical">
                <Row gutter={24} className="mb-4">
                    <Col sm={4}>
                        <Select allowClear
                                className="w-100"
                                placeholder="Симуляция"
                                onChange={(e) => setSimulationId(e)}
                        >
                            {_simulations.data?.map((sim) =>
                                <Option key={sim?.id}>{sim?.name}</Option>
                            )}
                        </Select>
                    </Col>
                    <Col sm={4} offset={16}>
                        <div style={{float: "right"}}>
                            <Tooltip title="Добавление нового пункта" className="me-1">
                                <Button
                                    onClick={() => setOpen({open: true, item: undefined})}
                                    type="primary">
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
                                <th className="d-sm-none d-md-table-cell text-center">Название тега</th>
                                <th className="d-sm-none d-md-table-cell text-center">Min</th>
                                <th className="d-sm-none d-md-table-cell text-center">Max</th>
                                <th className="d-sm-none d-md-table-cell text-center">Limit Min</th>
                                <th className="d-sm-none d-md-table-cell text-center">Limit Max</th>
                                <th className="d-sm-none d-md-table-cell text-center">Value</th>
                                <th className="d-sm-none d-md-table-cell text-center">Симуляция</th>
                                <th className="d-sm-none d-md-table-cell text-center">Действия</th>
                            </tr>
                            </thead>
                            <tbody>
                            {_simValues.data?.map((value, key) =>
                                <tr>
                                    <td className="text-center">{value?.id}</td>
                                    <td className="text-center">{value?.tagName}</td>
                                    <td className="text-center">{value?.min}</td>
                                    <td className="text-center">{value?.max}</td>
                                    <td className="text-center">{value?.limitMin}</td>
                                    <td className="text-center">{value?.limitMax}</td>
                                    <td className="text-center">{value?.value}</td>
                                    <td className="text-center">{value?.simulation?.name}</td>
                                    <td className="text-center">
                                        <div className="d-flex justify-content-center p-2">
                                            <Tooltip title="Изменить" color="green">
                                                <FaEdit
                                                    style={{color: 'green', fontSize: 24}}
                                                    onClick={() => {
                                                        setOpen({open: true, item: value?.id})
                                                        form.setFieldsValue(value)
                                                    }}
                                                />
                                            </Tooltip>

                                            <Tooltip title="Удалить" color="red">
                                                <Popconfirm
                                                    onConfirm={() => removeSimVal(value)}
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
                            style={{float: "right"}}
                            showQuickJumper
                            current={currentPage}
                            pageSize={pageSize}
                            total={_simValues?._meta.totalElements}
                            onChange={(page) => setCurrentPage(page)}
                            onShowSizeChange={(page, size) => setPageSize(size)}
                            showSizeChanger={true}/>


                        {/*    ******************** MODAL **************************/}

                        <Modal
                            footer={false}
                            open={open.open}
                            onCancel={
                                () => {
                                    setOpen({open: false, item: undefined})
                                    form.resetFields()
                                }}
                            title={open?.item ? "Изменить" : "Добавить"}
                            width={600}
                            centered
                        >
                            <Form form={form} layout="vertical" onFinish={sendData}>
                                <Row gutter={24}>
                                    <Col span={12}>
                                        <Form.Item rules={[{required: true, message: "Обязательное поле"}]} name="tagName"
                                                   label="Название тега">
                                            <Input placeholder="Название тега"/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item rules={[{required: true, message: "Обязательное поле"}]}
                                                   name="simulationId"
                                                   label="Симуляция">
                                            <Select allowClear placeholder="Симуляция"
                                            >
                                                {_simulations.data?.map(value =>
                                                    <Option key={value?.id} value={value?.id}>{value?.name}</Option>
                                                )}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item rules={[{required: true, message: "Обязательное поле"}]} name="min"
                                                   label="Min">
                                            <Input type="number" placeholder="Min"/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item rules={[{required: true, message: "Обязательное поле"}]} name="max"
                                                   label="Max">
                                            <Input type="number" placeholder="Max"/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item rules={[{required: true, message: "Обязательное поле"}]}
                                                   name="limitMin"
                                                   label="Limit Min">
                                            <Input type="number" placeholder="Limit Min"/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item rules={[{required: true, message: "Обязательное поле"}]}
                                                   name="limitMax"
                                                   label="Limit Max">
                                            <Input type="number" placeholder="Limit Max"/>
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

export default SimulationValue