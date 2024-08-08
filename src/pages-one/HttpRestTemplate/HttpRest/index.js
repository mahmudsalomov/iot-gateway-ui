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
    Spin, Tooltip,
    Radio, Space
} from "antd";
import React, {useState} from "react";
import {useGetAllData} from "../../../custom_hooks/useGetAllData";
import {FaEdit} from "react-icons/fa";
import {DeleteOutlined} from "@ant-design/icons";
import {toast, ToastContainer} from "react-toastify";
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import 'react-toastify/dist/ReactToastify.css';
import instance from "../../../utils/axios_config";
import {MdAddCircle} from "react-icons/md";

import CodeMirror from '@uiw/react-codemirror';
import {javascript} from '@codemirror/lang-javascript';
import {python} from '@codemirror/lang-python';

const {Option} = Select

function Rest() {
    const [form] = Form.useForm()
    const [loader, setLoader] = useState(false)
    const [open, setOpen] = useState({open: false, item: undefined});
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [httpType, setHttpType] = useState("");

    const [brokerId, setBrokerId] = useState(null)
    const [topicId, setTopicId] = useState(null)
    const _brokers = useGetAllData({
        url: "/broker/all",
        params: {},
        reFetch: []
    })

    const [formTopics, setFormTopics] = useState([])
    const [topics, setTopics] = useState([])

    const _types = useGetAllData({
        url: "/protocol/httprest/type/all",
        params: {},
        reFetch: []
    })

    const _httpTypes = useGetAllData({
        url: "/protocol/httprest/http-type/all",
        params: {},
        reFetch: []
    })

    const [checkedBody, setCheckedBody] = useState(false);
    const [checkedParam, setCheckedParam] = useState(false);
    const [checkedPath, setCheckedPath] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [selectedParserType, setSelectedParserType] = useState("");


    const onChangeBody = (e) => {
        console.log('checked = ', e.target.checked);
        setCheckedBody(e.target.checked);
    };
    const onChangeParam = (e) => {
        console.log('checked = ', e.target.checked);
        setCheckedParam(e.target.checked);
    };
    const onChangePath = (e) => {
        console.log('checked = ', e.target.checked);
        setCheckedPath(e.target.checked);
    };

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

    const _httpRests = useGetAllData({
        url: "/protocol/httpRest/getHttpPages",
        params: {page: currentPage, size: pageSize, brokerId: brokerId, topicId: topicId},
        reFetch: [currentPage, pageSize, brokerId, topicId]
    })

    const [value, setValue] = useState(1);
    const checkRadio = (e) => {
        console.log('radio checked', e.target.value);
        setValue(e.target.value);
    };

    const removeHttpRest = async (httpRest) => {
        try {
            let resp = await instance({
                method: "delete",
                url: `/protocol/httpRest/delete/${httpRest?.id}`
            })
            toast.success("Delete - " + httpRest?.url)
            _httpRests.fetch()
        } catch (e) {
            message.error("Error")
            toast.error("No connect server")
        }
    }
    const connect = async (httpRest) => {
        try {
            let res = await instance({
                method: "get",
                url: `/protocol/httpRest/isConnect/${httpRest?.id}`
            })
            if (res?.data?.success){
                if (res?.data?.object) {
                    toast.success(httpRest?.name + " - Connected")
                    _httpRests.fetch()
                } else {
                    toast.warning(httpRest?.name + " - Disconnected")
                    _httpRests.fetch()
                }
            }else {
                console.error(res?.data?.message)
            }
        } catch (e) {
            toast.error("Error")
        }
    }

    console.log("http type : ", httpType)


    const sendData = async (values) => {
        try {
            if (open?.item) {
                values = {...values, id: open?.item}
            }
            values = {...values, isBody: checkedBody}
            values = {...values, isParam: checkedParam}
            values = {...values, isPath: checkedPath}
            let response = await instance({
                method: open.item ? 'put' : 'post',
                url: '/protocol/httpRest',
                data: values
            })
            message.success(response.data.message)
            setOpen({open: false, item: undefined});
            form.resetFields();
            _httpRests.fetch();
        } catch (e) {
            message.error("Error")
        }
    }

    function onSelectParserType(value) {
        console.log(value)
        setSelectedParserType(value);
    }

    return (
        <div>
            <Spin spinning={_httpRests.loading} size={20} direction="vertical">
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
                        <table style={{verticalAlign: "middle",height:'70vh'}}
                               datapagesize={false}
                               className="table table-bordered table-striped table-hover responsiveTable w-100">
                            <thead className="d-md-table-header-group" style={{display:'table',width:'98.9%',tableLayout:'fixed'}}>
                            <tr style={{display:'table',width:'100%',tableLayout:'fixed'}}>
                                <th className="d-sm-none d-md-table-cell text-center">ИД</th>
                                <th className="d-sm-none d-md-table-cell text-center">Название</th>
                                <th className="d-sm-none d-md-table-cell text-center">URL-адрес</th>
                                <th className="d-sm-none d-md-table-cell text-center">Поллинг</th>
                                <th className="d-sm-none d-md-table-cell text-center">Тип</th>
                                <th className="d-sm-none d-md-table-cell text-center">Тип Http</th>
                                <th className="d-sm-none d-md-table-cell text-center">Тело запроса</th>
                                {/*<th className="d-sm-none d-md-table-cell text-center">Script</th>*/}
                                <th className="d-sm-none d-md-table-cell text-center">Топик</th>
                                <th className="d-sm-none d-md-table-cell text-center">Брокер</th>
                                <th className="d-sm-none d-md-table-cell text-center">Статус</th>
                                <th className="d-sm-none d-md-table-cell text-center">Действия</th>
                            </tr>
                            </thead>
                            <tbody style={{display:'block',height:'90%',overflow:'auto',width:'99.6'}}>
                            {_httpRests.data?.map((httRest, key) =>
                                <tr style={{display:'table',width:'100%',tableLayout:'fixed'}}>
                                    <td className="text-center">{httRest?.id}</td>
                                    <td className="text-center">{httRest?.name}</td>
                                    <td className="text-center" style={{overflow:'auto'}}>{httRest?.url}</td>
                                    <td className="text-center">{httRest?.polling}</td>
                                    <td className="text-center">{httRest?.type}</td>
                                    <td className="text-center">{httRest?.httpType}</td>
                                    <div style={{overflow:'auto',maxHeight:'10vh'}}>
                                        <td className="text-center" style={{width:'100%'}}>{httRest?.body}</td>
                                    </div>
                                    {/*<td className="text-center">{httRest?.parser}</td>*/}
                                    <td className="text-center">{httRest?.topic?.name}</td>
                                    <td className="text-center">{httRest?.topic?.broker?.ipAddress + ':' + httRest?.topic?.broker?.port}</td>
                                    <td className="text-center"><Checkbox checked={httRest?.enable}
                                                                          onChange={(e) => connect(httRest)}></Checkbox>
                                    </td>
                                    <td className="text-center">
                                        <div className="d-flex justify-content-center p-2">
                                            <Tooltip title="Изменить" color="green">
                                                <FaEdit
                                                    style={{color: 'green', cursor: "pointer", fontSize: 24}}
                                                    onClick={() => {
                                                        setOpen({open: true, item: httRest?.id})
                                                        form.setFieldsValue(httRest)
                                                        form.setFieldValue(['brokerId'], httRest.topic?.broker?.id)
                                                        form.setFieldValue(['topicId'], httRest.topic?.id)
                                                        getFormTopics(httRest.topic?.broker?.id)
                                                        form.setFieldsValue(httRest)
                                                    }}/>
                                            </Tooltip>

                                            <Tooltip title="Удалить" color="red">
                                                <Popconfirm
                                                    onConfirm={() => removeHttpRest(httRest)}
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
                            total={_httpRests?._meta.totalElements}
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
                                            <Input type="text" placeholder="Название"/>
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
                                        <Form.Item rules={[{required: true, message: "Обязательное поле"}]} name="type"
                                                   label="Тип">
                                            <Select style={{width: "100%"}} allowClear placeholder="Тип">
                                                {_types.data?.map(item => <Option key={item}
                                                                                  value={item}>{item}</Option>)}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item rules={[{required: true, message: "Обязательное поле"}]}
                                                   name="httpType"
                                                   label="Тип http">
                                            <Select style={{width: "100%"}} allowClear placeholder="Тип http"
                                                    onChange={(e) => setHttpType(e)}>
                                                {_httpTypes.data?.map(item => <Option key={item}
                                                                                      value={item}>{item}</Option>)}
                                            </Select>
                                        </Form.Item>
                                    </Col>

                                    <Col span={24} style={{marginBottom: '10px'}}>
                                        <Form.Item name="isBody" value={checkedBody}>
                                            <Checkbox name="isBody" checked={checkedBody} style={{fontSize: '16px'}}
                                                      onChange={onChangeBody}>
                                                {!checkedBody ? "Request Body" : null}
                                            </Checkbox>
                                        </Form.Item>
                                        {checkedBody ?
                                            <Col span={24}>
                                                <Form.Item rules={[{required: true, message: "Обязательное поле"}]}
                                                           name="body"
                                                           label="Название тело">
                                                    <Input.TextArea placeholder="{.....}" rows={10} maxLength={66666}/>
                                                </Form.Item>
                                            </Col> : null
                                        }
                                    </Col>
                                    <Col span={12} style={{marginBottom: '10px'}}>
                                        <Form.Item name="isParam">
                                            <Checkbox checked={checkedParam} disabled={disabled}
                                                      style={{fontSize: '16px'}} onChange={onChangeParam}>
                                                {!checkedParam ? "Request Param" : null}
                                            </Checkbox>
                                        </Form.Item>
                                        {checkedParam ?
                                            <Col span={24}>
                                                <Form.Item rules={[{required: true, message: "Обязательное поле"}]}
                                                           name="paramKey"
                                                           label="Ключ параметра"
                                                >
                                                    <Input type="text" placeholder="Ключ"/>
                                                </Form.Item>
                                                <Form.Item rules={[{required: true, message: "Обязательное поле"}]}
                                                           name="paramValue"
                                                           label="Значение параметра"
                                                >
                                                    <Input type="text" placeholder="Значение"/>
                                                </Form.Item>
                                            </Col> : null
                                        }
                                    </Col>
                                    <Col span={12} style={{marginBottom: '10px'}}>
                                        <Form.Item name="isPath">
                                            <Checkbox checked={checkedPath} style={{fontSize: '16px'}}
                                                      disabled={disabled} onChange={onChangePath}>
                                                {!checkedPath ? "Path Variable" : null}
                                            </Checkbox>
                                        </Form.Item>
                                        {checkedPath ?
                                            <Col span={24}>
                                                <Form.Item rules={[{required: true, message: "Обязательное поле"}]}
                                                           name="pathValue"
                                                           label="Значение переменной пути"
                                                >
                                                    <Input type="text" placeholder="Значение"/>
                                                </Form.Item>
                                            </Col> : null
                                        }
                                    </Col>

                                    <Col span={24}>
                                        <Form.Item rules={[{required: true, message: "Обязательное поле"}]} name="url"
                                                   label="URL-адрес">
                                            <Input type="text" placeholder="URL-адрес"/>
                                        </Form.Item>
                                    </Col>


                                    <Col span={24}>
                                        <Form.Item rules={[{required: false}]} name="parserType"
                                                   label="Тип">
                                            <Select style={{width: "100%"}} allowClear onSelect={onSelectParserType}
                                                    placeholder="Parser type">
                                                <Option selected key="JS" value={"JS"}></Option>
                                                <Option key="PYTHON" value={"PYTHON"}></Option>

                                            </Select>
                                        </Form.Item>
                                    </Col>


                                    {/*{selectedParserType && (*/}
                                    {/*    <Col span={24}>*/}
                                    {/*        <Form.Item rules={[{required: false}]} name="parser" label="Parser">*/}
                                    {/*            <CodeMirror*/}
                                    {/*                value={""}*/}
                                    {/*                height="200px"*/}
                                    {/*                options={{*/}
                                    {/*                    mode: selectedParserType === 'JS' ? 'javascript' : 'python',*/}
                                    {/*                    theme: 'default',*/}
                                    {/*                    lineNumbers: true*/}
                                    {/*                }}*/}
                                    {/*            />*/}
                                    {/*        </Form.Item>*/}
                                    {/*    </Col>*/}
                                    {/*)}*/}

                                    <Col span={24}>
                                        <Form.Item rules={[{required: false}]}
                                                   name="parser"
                                                   label="Parser">
                                            <CodeMirror value={""} height="200px"
                                                        extensions={[javascript(),python()]}/>
                                            {/*<Input.TextArea placeholder="function(){*/}
                                            {/*}" rows={10}  maxLength={66666} />*/}
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
    );
}

export default Rest