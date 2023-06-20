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
function WebsocketItem() {

    const [websocketId, setWebsocketId] = useState(null);

    const _websockets = useGetAllData({
        url: "/protocol/websocket/item/all",
        params: {},
        reFetch: []
    })

    return(
        <div>

        </div>
    )
}
export default WebsocketItem;