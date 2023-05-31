import {useEffect, useState} from "react";
import {message} from "antd";
import instance from "../utils/axios_config";




export const useGetAllData = ({url, isCall = "auto", params, reFetch = []}) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false)
    const [reload, setReload] = useState(false)
    const [_meta, setMeta] = useState({
        totalElements: 0,
        page: 0,
        totalPages: 0
    })

    const fetch = async () => {
        try {
            setLoading(true)
            let resp = await instance({
                method: "get",
                url,
                params
            })
            if (resp.data?.body?.success) {
                console.log(resp)
                setData(resp?.data?.body?.object);
                setReload(!reload)
                setMeta({
                    totalElements: resp?.data?.body.totalElements,
                    page: resp?.data?.body.page,
                    totalPages: resp?.body?.totalPages
                })
                setLoading(false)
            } else {
                message.error("Error get all data!")
                setLoading(false)
            }
        } catch (e) {
            setLoading(false)
            console.log(e)
            message.error("Error get all data!")
        }
    }

    useEffect(() => {
        if (isCall === "auto") {
            fetch()
        }
    }, [...reFetch])

    return {data, fetch, _meta, loading,reload}
}



export const useGetIdObject = ({url, isCall = "auto", params, reFetch = {}}) => {
    const [data, setData] = useState({});

    const fetch = async () => {
        try {
            let resp = await instance({
                method: "get",
                url,
                params
            })
            if (resp.data?.success) {
                setData(resp?.data?.object)
            } else {
                message.error("Error get all data!")
            }
        } catch (e) {
            console.log(e)
            message.error("Error get all data!")
        }
    }

    useEffect(() => {
        if (isCall === "auto") {
            fetch()
        }
    }, [...reFetch])

    return {data, fetch}
}