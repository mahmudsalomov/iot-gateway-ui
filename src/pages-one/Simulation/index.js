import {Checkbox, Col, Popconfirm, Row, Typography} from "antd";
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import instance from "../../utils/axios_config";
import {FaEdit} from "react-icons/fa";
import {DeleteOutlined} from "@ant-design/icons";

function Simulation() {
    const [simulations,setSimulations] = useState([]);
    const [loading,setLoading] = useState(false);
    const [loader, setLoader] = useState(false)
    const [total,setTotal] = useState(0);
    const [page,setPage]=useState(10);

    const getAllSimulation=async ()=>{
        try {
            setLoading(true);
            let resp = await instance({
                method:"get",
                url:"/simulation"
            })
            console.log("RESSSSSSSSSSS : ",resp)
            setLoading(false)
            setSimulations(resp?.data)
        }catch (e){
            console.log("error")
            toast.error("Disconnect server")
        }
    }
    useEffect(()=>{
        getAllSimulation()
    },[]);
    return(
        <div>
            <Row gutter={24}>
                <Col span={24}>
                    <Typography.Title level={4}>
                        Симуляция
                    </Typography.Title>
                </Col>
                <Col span={24}>
                    <table style={{verticalAlign: "middle"}} className="table table-bordered table-striped table-hover responsiveTable w-100">
                        <thead className="d-md-table-header-group">
                            <tr>
                                <th className="d-sm-none d-md-table-cell text-center">T/R</th>
                                <th className="d-sm-none d-md-table-cell text-center">ID</th>
                                <th className="d-sm-none d-md-table-cell text-center">Name</th>
                                <th className="d-sm-none d-md-table-cell text-center">Polling</th>
                                <th className="d-sm-none d-md-table-cell text-center">Topic</th>
                                <th className="d-sm-none d-md-table-cell text-center">Enable</th>
                                <th className="d-sm-none d-md-table-cell text-center">Изменить / Удалить</th>
                            </tr>
                        </thead>
                        <tbody>
                            {simulations?.map((simulation,key) =>
                                <tr>
                                    <td className="text-center">{key + 1}</td>
                                    <td className="text-center">{simulation?.id}</td>
                                    <td className="text-center">{simulation?.name}</td>
                                    <td className="text-center">{simulation?.polling}</td>
                                    <td className="text-center">{simulation?.topic}</td>
                                    <td className="text-center"><Checkbox defaultChecked={simulation?.enable} /></td>
                                    <td className="text-center">
                                        <div className="d-flex justify-content-lg-center p-2">
                                            <FaEdit
                                                style={{color: 'green',fontSize: 24}}
                                              />

                                            <Popconfirm
                                                title={"Are sure?"}>
                                                <DeleteOutlined style={{color: 'red' ,fontSize: 24}}/>
                                            </Popconfirm>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </Col>
            </Row>
        </div>
    );
}
export default Simulation