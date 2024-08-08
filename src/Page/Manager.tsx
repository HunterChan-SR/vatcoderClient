import {useParams} from "react-router-dom";
import {Button, Form, Input, Modal, Table} from "antd";
import {useEffect, useState} from "react";
import axios from "axios";
import {api_url} from "../main.tsx";

export default function Manager() {

    type ProblemCountView = {
        userid: number;
        problemid: number;
        atcoderid: string;
        account: number;
        wacount: number;
        level: number;
        truename: string;
        username: string;
        [key:string] : unknown;
    };

    // 更明确地定义列类型
    interface ColumnType {
        title: string;
        dataIndex: string //| ((record: any) => any); // 允许自定义 render 函数
        key: string;
    }

    const level = useParams().levelid;
    const [data, setData] = useState<ProblemCountView[]>([]);
    const [columns, setColumns] = useState<ColumnType[]>([]);

    const [addUser, setAddUser] = useState(false)
    const [addProblem, setAddProblem] = useState(false)

    useEffect(() => {
        axios.get(`${api_url}/admin/account/${level}`, {
            headers: {
                Authorization: localStorage.getItem('token') || ''
            }
        }).then((response) => {
            const {code, msg, data: responseData} = response.data as {
                code: number,
                msg: string,
                data: ProblemCountView[]
            };
            if (code === 0 && responseData) {
                const userList: ColumnType[] = [];
                const account: Record<string, ProblemCountView> = {};

                // 添加题目列
                userList.push({
                    title: '题目',
                    dataIndex: 'atcoderid',
                    key: 'atcoderid',
                });

                for (const item of responseData) {
                    // 添加用户列
                    if (!userList.find(col => col.key === item.username)) {
                        userList.push({
                            title: item.truename,
                            dataIndex: item.username,
                            key: item.username,
                        });
                    }

                    // 构建账户数据
                    if (!account[item.atcoderid]) {
                        account[item.atcoderid] = {
                            ...item,
                            // 清除不需要的字段

                        };
                    }

                    account[item.atcoderid][item.username] = item.account > 0 ?
                        <Button type={'text'} block={true} disabled={false}
                                style={{backgroundColor: 'green'}}>Solved</Button> :
                        item.wacount > 0 ?
                            <Button type={'text'} block={true} disabled={false} loading={true}
                                    style={{backgroundColor: 'yellow'}}>Solving</Button> :
                            <Button type={'text'} block={true} disabled={true}
                                    style={{backgroundColor: 'white'}}></Button>;
                }

                setColumns(userList);
                setData(Object.values(account));
                // console.log(userList)
                // console.log(Object.values(account))
            } else {
                alert(msg);
            }
        }).catch((error) => {
            alert(error);
        });
    }, [level]);

    return (
        <>
            <Button type="primary" onClick={() => {
                setAddUser(true)
            }}>添加用户</Button>
            <Button type="primary" danger={true} onClick={() => {
                setAddProblem(true)
            }}>添加题目</Button>
            <Table
                title={() => '完成情况'}
                pagination={false}
                loading={data.length === 0 || columns.length === 0}
                columns={columns}
                dataSource={data}
            />

            <Modal
                title={'添加用户'}
                open={addUser}
                onCancel={() => {
                    setAddUser(false)
                }}
                footer={[]}
            >
                <Form
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    onFinish={(values)=>{
                        values.level = parseInt(typeof level === "string" ? level :"0")
                        // console.log(values)
                        axios.post(`${api_url}/admin/adduser`, values, {
                            headers: {
                                Authorization: localStorage.getItem('token')
                            }
                        }).then((response) => {
                            const {code, msg,data} = response.data as {
                                code: number,
                                msg: string,
                                data: string
                            };
                            if (code === 0) {
                                alert(data);
                                setAddUser(false)
                                window.location.reload()
                            }else{
                                alert(msg);
                            }
                        }).catch((error)=>{
                            alert(error)
                        })
                    }}
                >
                    <Form.Item label={'用户名'} name={'username'}
                               rules={[{ required: true, message: 'Please input!' }]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item label={'密码'} name={'password'}
                               rules={[{ required: true, message: 'Please input!' }]}
                    >
                        <Input.Password/>
                    </Form.Item>
                    <Form.Item label={'真实姓名'} name={'truename'}
                               rules={[{ required: true, message: 'Please input!' }]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item>
                        <Button block={true} type={'primary'} htmlType={'submit'}>提交</Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title={'添加题目'}
                open={addProblem}
                onCancel={() => {
                    setAddProblem(false)
                }}
                footer={[]}
            >
                <Form
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    onFinish={(values)=>{
                        values.level = parseInt(typeof level === "string" ? level :"0")
                        // console.log(values)
                        axios.post(`${api_url}/admin/addproblem`, values, {
                            headers: {
                                Authorization: localStorage.getItem('token')
                            }
                        }).then((response) => {
                            const {code, msg,data} = response.data as {
                                code: number,
                                msg: string,
                                data: string
                            };
                            if (code === 0) {
                                alert(data);
                                setAddProblem(false)
                                window.location.reload()
                            }else{
                                alert(msg);
                            }
                        }).catch((error)=>{
                            alert(error)
                        })
                    }}
                >
                    <Form.Item label={'AtcoderId'} name={'atcoderid'}
                               rules={[{
                                   required: true,
                                   pattern: new RegExp('^abc\\d+_([a-z]+)$'),
                                   message: '格式例如: abc300_e'
                               }
                               ]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item>
                        <Button block={true} type={'primary'} htmlType={'submit'}>提交</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
