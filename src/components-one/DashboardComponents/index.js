import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import {Button, Image, Layout, Menu, message, Space, theme, Typography} from 'antd';
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
import imageLogo from "../../assets/cloud.png";
import {TbBrandSocketIo} from "react-icons/tb";
import {ACCESS_TOKEN, BASE_URL_WEBSOCKET, REFRESH_TOKEN} from "../../utils/API_PATH";
import {over} from 'stompjs';
import SockJS from 'sockjs-client';
import instance from "../../utils/axios_config";
import Login from "../auth/Login";
import useAuthStore from "../../store/store";

const { Header, Content, Footer, Sider } = Layout;

const DashboardComponent= () => {
    const navigate = useNavigate()
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const [sock, setSock] = useState(new SockJS(BASE_URL_WEBSOCKET));
    const [stompClient, setStompClient] = useState(over(sock));
    const isValid=useAuthStore((state)=>state.isValid);

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


    //FOR WEBSOCKET
    const connect = () => {
        console.log("Connect")
        // let Sock = new SockJS('http://192.168.0.100:8888/our-websocket');
        // setSock(new SockJS(BASE_URL_WEBSOCKET));
        // setStompClient(over(sock));
        stompClient.debug = null
        setStompClient(stompClient);
        stompClient.connect({}, onConnected, onError);
    }

    const onError = (err) => {
        console.log(err);
    }

    const logOut = () => {
        localStorage.clear();
        window.location.reload()
    };
    const onConnected = () => {
        console.log("onConnected")
        if (stompClient.connected) {
            stompClient.subscribe('/topic/exception', function (data) {
            // stompClient.subscribe('/topic/well/12', function (data) {
                console.log("SUBSSSSSSSSSSSSSSSSSSSSS")
                console.log(data)
                message.success(data.body)
                // setPressureApi(JSON.parse(message.body))
                // console.log(message.body)
                // console.log(message)
                // console.log("WITHOUT JSON")
                // console.log(message.body)
                // let data=JSON.parse(message.body);
                // console.log("JSON")
                // console.log(data)
                // console.log(data[0])
            });

        }
    }

    const check = () => {
        return localStorage.getItem(ACCESS_TOKEN)&&localStorage.getItem(REFRESH_TOKEN);
    }
    // useEffect(() => {
    //     // connect()
    //     // if (check()) navigate("/login")
    // }, []);

    return ( check()?
        <Layout className="d-flex" >
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
                    {/*<Image style={{backgroundColor:"white",color:"white"}} src={imageLogo} />*/}
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
                        // {
                        //     label: "Выход",
                        //     icon: <RiLogoutBoxLine style={{fontSize:"20px"}}/>,
                        //     key: '/login',
                        // },
                    ]}
                />
            </Sider>
            <Layout>
                <Header className={"d-flex justify-content-between"} style={{ padding: 0, background:colorBgContainer}} >
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
                    <Button
                        type="text"
                        icon={<LogoutOutlined/>}
                        onClick={()=>logOut()}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                </Header>
                <Content style={{ margin: '24px 16px 0', height:'80vh'}}>
                    <div style={{ padding: 24,background:colorBgContainer}}><AppRoutes /></div>
                </Content>
            </Layout>
        </Layout>:<Login/>
    );
};

export default DashboardComponent;