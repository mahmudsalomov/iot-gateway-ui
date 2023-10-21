import React, {useState} from 'react';
import {isImageUrl} from "antd/es/upload/utils";
import {AiFillLock} from "react-icons/ai";
import './style.css';
import {Button, Checkbox, Col, Divider, Form, Input, message, Row, Select, Space, Tabs, theme} from "antd";
import {useNavigate} from "react-router-dom"
import instance from "../../utils/axios_config";
import {ACCESS_TOKEN, REFRESH_TOKEN} from "../../utils/API_PATH";
import {LoginFormPage, ProFormCaptcha, ProFormCheckbox, ProFormText} from "@ant-design/pro-components";
import {
    AlipayOutlined,
    LockOutlined,
    MobileOutlined,
    TaobaoOutlined,
    UserOutlined,
    WeiboOutlined
} from "@ant-design/icons";
import {iconStyles} from "@ant-design/icons/es/utils";
import {CSSProperties} from "react";
import useAuthStore from "../../store/store";


function Login() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const {token} = theme.useToken();
    const [loginType, setLoginType] = useState('account');
    const iconStyles: CSSProperties = {
        color: 'rgba(0, 0, 0, 0.2)',
        fontSize: '18px',
        verticalAlign: 'middle',
        cursor: 'pointer',
    };
    const navigate=useNavigate();

    const setValid = useAuthStore((state) => state.setValid);
    const isValid=useAuthStore((state)=>state.isValid)
    const onFinish = async (vals) => {
        console.log("vals")
        console.log(vals)
        setLoading(true)
        try {
            let resp = await instance({
                notRequireAuth: true,
                method: "post",
                url: '/auth/login',
                data: vals
            })
            let data = resp?.data?.object
            localStorage.setItem(ACCESS_TOKEN, data?.token);
            console.log(data)
            localStorage.setItem(REFRESH_TOKEN, data?.refreshToken);
            setValid(true)
            setLoading(false)
            data?.token?navigate("/"):navigate("/login")
        } catch (e) {
            console.log(e)
            message.error("Имя пользователя или пароль неверны")
            setLoading(false)
        }


    }

    const onFinishFailed = () => {
        console.log("onFinishFailed")
    }


    return (
        <div
            style={{
                backgroundColor: 'white',
                height: '100vh',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {/*<Row type="flex" justify="center" align="middle" style={{minHeight: '100vh'}}></Row>*/}

            <LoginFormPage
                onFinish={onFinish}
                submitter={{searchConfig: {submitText: "Login"}}}
                // backgroundImageUrl="https://mdn.alipayobjects.com/huamei_gcee1x/afts/img/A*y0ZTS6WLwvgAAAAAAAAAAAAADml6AQ/fmt.webp"
                // logo="https://github.githubassets.com/images/modules/logos_page/Octocat.png"
                backgroundVideoUrl="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr"
                title="IoT gateway"
                containerStyle={{
                    // backgroundColor: 'rgba(0, 0, 0,0.65)',
                    backdropFilter: 'blur(0px)',
                    alignContent: "center",
                    justifyContent: "center",
                }}
                subTitle="All in one!"

                actions={
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                        }}
                    >


                    </div>
                }
            >

                <Divider></Divider>
                <>
                    <ProFormText
                        name="username"
                        fieldProps={{
                            size: 'large',
                            prefix: (
                                <UserOutlined
                                    style={{
                                        color: token.colorText,
                                    }}
                                    className={'prefixIcon'}
                                />
                            ),
                        }}
                        placeholder={'Username'}
                        rules={[
                            {
                                required: true,
                                message: 'Please enter username!',
                            },
                        ]}
                    />
                    <ProFormText.Password
                        name="password"
                        fieldProps={{
                            size: 'large',
                            prefix: (
                                <LockOutlined
                                    style={{
                                        color: token.colorText,
                                    }}
                                    className={'prefixIcon'}
                                />
                            ),
                        }}
                        placeholder={'Password'}
                        rules={[
                            {
                                required: true,
                                message: 'Please enter your password!',
                            },
                        ]}
                    />
                </>


                <div
                    style={{
                        marginBlockEnd: 24,
                    }}
                >
                    <ProFormCheckbox noStyle name="autoLogin">
                        Save password
                    </ProFormCheckbox>
                </div>
            </LoginFormPage>
        </div>
        // <Form
        //     className={"align-content-center align-items-center justify-content-center"}
        //     name="basic"
        //     labelCol={{
        //         span: 8,
        //     }}
        //     wrapperCol={{
        //         span: 16,
        //     }}
        //     style={{
        //         maxWidth: 600,
        //     }}
        //     initialValues={{
        //         remember: true,
        //     }}
        //     onFinish={onFinish}
        //     onFinishFailed={onFinishFailed}
        //     autoComplete="off"
        // >
        //     <Form.Item
        //         label="Username"
        //         name="username"
        //         rules={[
        //             {
        //                 required: true,
        //                 message: 'Please input your username!',
        //             },
        //         ]}
        //     >
        //         <Input/>
        //     </Form.Item>
        //
        //     <Form.Item
        //         label="Password"
        //         name="password"
        //         rules={[
        //             {
        //                 required: true,
        //                 message: 'Please input your password!',
        //             },
        //         ]}
        //     >
        //         <Input.Password/>
        //     </Form.Item>
        //
        //     <Form.Item
        //         name="remember"
        //         valuePropName="checked"
        //         wrapperCol={{
        //             offset: 8,
        //             span: 16,
        //         }}
        //     >
        //         <Checkbox>Remember me</Checkbox>
        //     </Form.Item>
        //
        //     <Form.Item
        //         wrapperCol={{
        //             offset: 8,
        //             span: 16,
        //         }}
        //     >
        //         <Button type="primary" htmlType="submit">
        //             Login
        //         </Button>
        //     </Form.Item>
        // </Form>
    );
}

export default Login;