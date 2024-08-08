import {Button, Checkbox, Table} from "antd";
import {useEffect, useState} from "react";
import {api_url} from '../main.tsx';
import axios from 'axios';
import Submit from "./Submit.tsx"; // Corrected import statement

//type ProblemACView struct {
// 	Userid    int    `json:"userid"`
// 	Problemid int    `json:"problemid"`
// 	Atcoderid string `json:"atcoderid"`
// 	Account   int    `json:"account"`
// }

type ProblemCountView = {
    userid: number;
    problemid: number;
    atcoderid: string;
    account: number;
    wacount: number;
};

export default function Problems() {
    const [data, setData] = useState<ProblemCountView[]>(
        []
    )
    const [displayData, setDisplayData] = useState<ProblemCountView[]>(
        []
    )
    const columns = [
        {
            title: 'solved',
            dataIndex: 'solved',
            key: 'solved',
        },
        {
            title: 'problem',
            dataIndex: 'atcoderid',
            key: 'atcoderid',
        },
        {
            title: 'atcoder',
            dataIndex: 'atcoder',
            key: 'atcoder',
        },
        {
            title: 'vjudge',
            dataIndex: 'vjudge',
            key: 'vjudge',
        },
        {
            title: 'luogu',
            dataIndex: 'luogu',
            key: 'luogu',
        },
        {
            title: '提交',
            dataIndex: 'submit',
            key: 'submit',
        }
    ]


    const dataSource = displayData.map((item) => {
        return {
            key: item.problemid,
            solved: <>
                <Button type={'text'} style={{color: item.account > 0 ? 'green' : (item.wacount>0?'red':'white')}}>
                    {item.account > 0 ? 'solved' : (item.wacount>0?'solving':'')}
                </Button>
            </>,
            atcoderid: item.atcoderid,
            atcoder: <>
                <Button type={'link'} style={{color: item.account > 0 ? 'green' : 'blue'}} onClick={() => {
                    window.open(`https://atcoder.jp/contests/${item.atcoderid.split('_')[0]}/tasks/${item.atcoderid}`)
                }}>{'atcoder'}</Button>
            </>,
            vjudge: <>
                <Button type={'link'} style={{color: item.account > 0 ? 'green' : 'blue'}} onClick={() => {
                    window.open(`https://vjudge.net/problem/AtCoder-${item.atcoderid}#author=GPT_zh`)
                }}>{'vjudge'}</Button>
            </>,
            luogu: <>
                <Button type={'link'} style={{color: item.account > 0 ? 'green' : 'blue'}} onClick={() => {
                    window.open(`https://www.luogu.com.cn/problem/AT_${item.atcoderid}`)
                }}>{'luogu'}</Button>
            </>,
            submit: <>
                <Submit atcoderid={item.atcoderid}></Submit>
            </>


        }
    })

    useEffect(() => {

        axios.get(api_url + '/problem/', {
            headers: {
                Authorization: localStorage.getItem('token')
            }
        }).then((response) => {

            const {code, msg, data} = response.data as { code: number, msg: string, data: ProblemCountView[] };
            if (code === 0 && data) {
                setData(data);
                setDisplayData(data)
            } else {
                alert(msg)
            }
        })
            .catch((error) => {
                alert(error)
            })

    }, []);

    return (
        <>
            <Checkbox onClick={(e:React.MouseEvent<HTMLInputElement>) => {
                if ((e.target as HTMLInputElement).checked ) {
                    setDisplayData(data.filter((item) => {
                        return item.account === 0
                    }))
                }else{
                    setDisplayData(data)
                }
            }}>仅显示未解决</Checkbox>
            <Table dataSource={dataSource} columns={columns}
                   pagination={false}
                   loading={data.length === 0}
            >
            </Table>
        </>
    )
}