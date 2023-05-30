import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import {Button, Image, Layout, Menu, Space, theme, Typography} from 'antd';
import {FaBurn} from "react-icons/fa";
import {VscTypeHierarchy} from "react-icons/vsc";
import {HiOutlineStatusOnline} from "react-icons/hi";
import {AiOutlineGateway} from "react-icons/ai";
import {BsDeviceSsd} from "react-icons/bs";
import {GiMovementSensor} from "react-icons/gi";
import {RiLogoutBoxLine} from "react-icons/ri";
import AppRoutes from "../AppRoutes";
import {SiMumble, SiMusicbrainz} from "react-icons/si";
import {MdSensorWindow} from "react-icons/md";
import {RxValue} from "react-icons/rx";

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
                    <Typography.Text style={{color:"white",fontSize:"20px"}}>{collapsed?"":"IOT Gateway"}</Typography.Text>
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