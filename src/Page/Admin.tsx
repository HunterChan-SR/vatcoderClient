import { Button, Table} from "antd";
import {api_url, proxy_url} from "../main.tsx";
import axios from "axios";
import {useEffect, useState} from "react";

export default function Admin() {
    //create table level(
    //     id int primary key auto_increment,
    //     title varchar(20)
    // );
    type LevelView = {
        id: number;
        title: string;
    }

    const [data, setData] = useState<LevelView[]>(
        []
    )

    const columns = [
        {
            title: '组别',
            dataIndex: 'title',
            key: 'title',
        }
    ]

   const dataSource  = data.map((item) => {
        return {
            key: item.id,
            title: <Button href={"/admin/level/" + item.id}>{item.title}</Button>
        }
    });

    useEffect(() => {
        axios.get(api_url + '/admin/levels', {
            headers: {
                Authorization: localStorage.getItem('token')
            }
        }).then((response)=>{
            const {code, msg, data} = response.data as { code: number, msg: string, data: LevelView[] };
            if (code === 0 && data) {
                setData(data);
            } else {
                alert(msg)
            }
        }).catch((error) => {
            alert(error)
        })
    }, [])
    const [reloading, setReloading] = useState(false)
    return (
        <>
            <Button danger={true} loading={reloading} onClick={
                () => {
                    setReloading(true)
                    axios.post(api_url + '/admin/reload', {}, {
                        headers: {
                            'Authorization': localStorage.getItem('token')
                        }
                    }).then((response) => {
                        const {code, msg, data} = response.data as { code: number, msg: string, data: string };
                        if (code === 0) {
                            alert(data)
                            setReloading(false)
                        } else {
                            alert(msg)
                        }
                    }).catch((error) => {
                        alert(error)
                    })
                }
            }>ReLoad</Button>

            <Button danger={true}  onClick={
                () => {
                    //新开窗口
                    window.open(proxy_url, '_blank');
                }
            } >前边的Reload不好用</Button>

            <Table dataSource={dataSource} columns={columns} pagination={false}>

            </Table>
        </>
    )
}