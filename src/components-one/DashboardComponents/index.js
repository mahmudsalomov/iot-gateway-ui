import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import {Button, Image, Layout, Menu, Space, theme, Typography} from 'antd';
import {FaBurn, FaDatabase} from "react-icons/fa";
import {VscTypeHierarchy} from "react-icons/vsc";
import {HiOutlineStatusOnline, HiOutlineTable, HiOutlineTicket} from "react-icons/hi";
import {AiFillDatabase, AiOutlineGateway} from "react-icons/ai";
import {BsDatabaseFillGear, BsDeviceSsd} from "react-icons/bs";
import {GiElectricalSocket, GiMovementSensor} from "react-icons/gi";
import {RiLogoutBoxLine} from "react-icons/ri";
import AppRoutes from "../AppRoutes";
import {SiHttpie, SiMumble, SiMusicbrainz, SiRsocket} from "react-icons/si";
import {MdOutlineHttp, MdSensorWindow} from "react-icons/md";
import {RxValue} from "react-icons/rx";
import {BiSitemap} from "react-icons/bi";
import {TbBrandSocketIo} from "react-icons/tb";

const { Header, Content, Footer, Sider } = Layout;

const DashboardComponent= () => {
    const navigate = useNavigate()
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    let dataModbus= [
        {label:"Клиенты Modbus",icon:<BsDeviceSsd style={{fontSize:"20px"}}/>,key:"/"},
        {label:"Пункт Modbus",icon:<GiMovementSensor style={{fontSize:"20px"}}/>,key:"/item"}
    ];

    let dataSimulation= [
        {label:"Симуляция",icon:<SiMusicbrainz style={{fontSize:"20px"}}/>,key:"/simulation"},
        {label:"Значение симуляция",icon:<RxValue style={{fontSize:"20px"}}/>,key:"/simValue"}
    ];

    let dataHttpRest= [
        {label:"HttpRest",icon:<MdOutlineHttp style={{fontSize:"20px"}}/>,key:"/httpRest"},
        {label:"Пункт HttpRest",icon:<BiSitemap style={{fontSize:"20px"}}/>,key:"/httpRestItem"}
    ];

    let dataWebsocket= [
        {label:"Websocket",icon:<SiRsocket style={{fontSize:"20px"}}/>,key:"/websocket"},
        {label:"Пункт Websocket",icon:<TbBrandSocketIo style={{fontSize:"20px"}}/>,key:"/websocketItem"}
    ];

    let dataJdbc= [
        {label:"Jdbc",icon:<FaDatabase style={{fontSize:"20px"}}/>,key:"/jdbc"},
        {label:"Пункт Jdbc",icon:<AiFillDatabase style={{fontSize:"20px"}}/>,key:"/jdbcItem"}
    ];

    return (
        <Layout className="d-flex">
            <Sider
                style={{height:"100vh"}}
                breakpoint="lg"
                collapsedWidth="45"
                width={260}
                onBreakpoint={(broken) => {
                    console.log(broken);
                }}
                onCollapse={(collapsed, type) => {
                    console.log(collapsed, type);
                }}
                trigger={null} collapsible collapsed={collapsed}
            >
                <Space className="d-flex justify-content-evenly align-items-center p-2">
                    <AiOutlineGateway style={{fontSize:"40px",color:"white"}}/>
                    <Typography.Text style={{color:"white",fontSize:"20px"}}>{collapsed?"":"Uzliti IOT Gateway"}</Typography.Text>
                </Space>
                <div className="demo-logo-vertical" />
                <Menu
                    style={{backgroundColor:"#001529",color:"white",fontSize:"16px",width:"100%"}}
                    theme="dark"
                    mode="inline"
                    onClick={(item) => {
                        console.log(item.key)
                        navigate(item.key)

                    }}
                    defaultSelectedKeys={['1']}
                    items={[
                        {
                            label: "Modbus",
                            icon: <MdSensorWindow style={{fontSize:"20px"}}/>,
                            children: (
                                dataModbus?.map(value => {
                                    return {
                                        label:value?.label,
                                        icon:value?.icon,
                                        key:value?.key
                                    }
                                })
                            )
                        },

                        {
                            label: "Симуляция",
                            icon: <SiMumble style={{fontSize:"20px"}}/>,
                            children: (
                                dataSimulation?.map(value => {
                                    return {
                                        label:value?.label,
                                        icon:value?.icon,
                                        key:value?.key
                                    }
                                })
                            )
                        },

                        {
                            label: "HttpRest",
                            icon: <SiHttpie  style={{fontSize:"20px"}} />,
                            children: (
                                dataHttpRest?.map(value => {
                                    return {
                                        label:value?.label,
                                        icon:value?.icon,
                                        key:value?.key
                                    }
                                })
                            )
                        },
                        {
                            label: "Websocket",
                            icon: <GiElectricalSocket  style={{fontSize:"20px"}} />,
                            children: (
                                dataWebsocket?.map(value => {
                                    return {
                                        label:value?.label,
                                        icon: value?.icon,
                                        key: value?.key
                                    }
                                })
                            )
                        },
                        {
                            label: "Jdbc",
                            icon: <BsDatabaseFillGear  style={{fontSize:"20px"}} />,
                            children: (
                                dataJdbc?.map(value => {
                                    return {
                                        label:value?.label,
                                        icon: value?.icon,
                                        key: value?.key
                                    }
                                })
                            )
                        },
                        {
                            label: "Брокер",
                            icon: <HiOutlineTable style={{fontSize:"20px"}}/>,
                            key: '/broker',
                        },
                        {
                            label: "Топик",
                            icon: <HiOutlineTicket style={{fontSize:"20px"}}/>,
                            key: '/topic',
                        },
                        {
                            label: "Выход",
                            icon: <RiLogoutBoxLine style={{fontSize:"20px"}}/>,
                            key: '/login',
                        },
                    ]}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background:colorBgContainer}} >
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                </Header>
                <Content style={{ margin: '24px 16px 0', height:'100%',overflowY:"scroll" }}>
                    <div style={{ padding: 24,background:colorBgContainer}}><AppRoutes /></div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default DashboardComponent;