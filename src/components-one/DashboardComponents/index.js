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

const { Header, Content, Footer, Sider } = Layout;

const DashboardComponent= () => {
    const navigate = useNavigate()
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

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
                            label: "Клиенты Modbus",
                            icon: <BsDeviceSsd style={{fontSize:"20px"}}/>,
                            key: "/"
                        },
                        {

                            label: "Пункт Modbus",
                            key: "/item",
                            icon: <GiMovementSensor style={{fontSize:"20px"}}/>
                        },

                        {
                            label: "Выход",
                            icon: <RiLogoutBoxLine style={{fontSize:"20px"}}/>,
                            key: '/login',
                        },
                        // {
                        //     label: "Устройство",
                        //     icon: <GiOilPump/>,
                        //     children: (
                        //         deviceType?.map(item => {
                        //             return {
                        //                 label: item.nameRu,
                        //                 icon: <MdAreaChart style={{fontSize:"20px"}}/>,
                        //                 key: item.id,
                        //             }
                        //         })
                        //     )
                        // },
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