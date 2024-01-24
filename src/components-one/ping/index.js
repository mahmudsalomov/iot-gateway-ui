import { PoweroffOutlined } from '@ant-design/icons';
import {Button, message, Space} from 'antd';
import { useState } from 'react';
import instance from "../../utils/axios_config";
const Ping = (props) => {
    const [loading, setLoading] = useState(false);


    const ping = async () => {
        console.log(props.host)
        setLoading(true)
        try {
            let resp = await instance({
                method: 'post',
                url: "/check/ping",
                params:{host:props.host}
            })
            if (resp.data.object==false){
                message.error("Ping: " + false)
            } else {
                message.success("Ping: "+resp.data.object)
            }
        } catch (e) {
            message.error("Hostname "+props.host+" is invalid!")
        }finally {
            setLoading(false)
        }
    }
    return (
            <Space wrap style={{marginLeft:'10px'}}>
                <Button type="primary" loading={loading}  onClick={() => ping()}>
                    Ping
                </Button>
            </Space>
    );
};
export default Ping;