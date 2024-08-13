import {useEffect, useState} from 'react';
import {Button, Card, Form, FormProps, Input, Modal} from 'antd';
import {api_url} from '../main.tsx';
import axios from 'axios';


function AdminButton({adminGroup}:{adminGroup: boolean}) {
    if (adminGroup) {
        return (
            <Button href={"/admin"}>管理员界面</Button>
        );
    } else {
        return (
            <></>
        );
    }
}

export default function UserBoard() {
    type UserView = {
        id: number;
        username: string;
        truename: string;
        level: string;
    };

    type ApiResponse = {
        code: number;
        data: UserView | null; // Assuming the data could be null
    };

    const [userData, setUserData] = useState<UserView>({
        id: -1,
        username: "NULL",
        truename: "NULL",
        level: "NULL"
    });

    const [loading, setLoading] = useState(true);
    const [needLogin, setNeedLogin] = useState(false);


    useEffect(() => {
        axios.get(api_url + '/user/online', {
            headers: {
                Authorization: localStorage.getItem('token')
            }
        })
            .then((response) => {
                const {code, data} = response.data as ApiResponse;
                if (code === 0 && data) {

                    setUserData(data);
                    setLoading(false);
                } else {
                    setNeedLogin(true);
                }
            })
            .catch((error) => {
                alert(error); // Fixed typo in catch block
            });

    }, [setLoading, setNeedLogin]); // Add dependency array to avoid infinite loop


    type FieldType = {
        username?: string;
        password?: string;
    };


    const [onloading, setOnloading] = useState(
        false
    );

    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        // console.log("submit", values)
        setOnloading(true)
        axios.post(api_url + '/user/login', values)
            .then((response) => {
                const {code, data} = response.data as {
                    code: number;
                    data: string;
                };
                // console.log(response.data);
                if (code === 0) {
                    alert("登录成功!")
                    localStorage.setItem('token', data);
                    //同时保存为cookie
                    document.cookie = "token=" + data;
                    // console.log("token", data)
                    setNeedLogin(false)
                    window.location.reload()
                } else {
                    alert("用户名或密码错误！")
                }
                setOnloading(false)
            })
            .catch((error) => {
                alert(error)
            });
    }

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        alert(errorInfo)
    }


    return (
        <>
            <p>8.13不定时停机更新，若出现提交失败，请稍后刷新页面后重试。</p>
            <AdminButton adminGroup={userData.level === "管理员组"}/>
            <Card size="small" style={{width: 800}} loading={loading}>
                <p>{userData.username}</p>
                <p>{userData.truename}</p>
                <p>{userData.level}</p>
                <Button
                    type={"primary"}
                    href={"/user/change_password"}
                >修改密码</Button>
                <Button
                    danger={true}
                    onClick={() => {
                        localStorage.removeItem('token');
                        document.cookie = "token=";
                        window.location.reload()
                    }}
                >退出</Button>
            </Card>
            <Modal
                width={800}
                height={800}
                open={needLogin}
                footer={[]}
            >
                <Form
                    name="loginForm"
                    labelCol={{span: 8}}
                    wrapperCol={{span: 16}}
                    style={{maxWidth: 400, margin: 'auto'}}
                    initialValues={{remember: true}}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete={"off"}
                >
                    <Form.Item<FieldType>
                        label="用户名"
                        name="username"
                        rules={[{required: true, message: '请输入用户名'},
                            {pattern: /^[a-zA-Z0-9]+$/, message: '用户名只能包含英文字母或数字'}]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        label="密码"
                        name="password"
                        rules={[{required: true, message: '请输入密码'},
                            {pattern: /^[a-zA-Z0-9]+$/, message: '密码只能包含英文字母或数字'}]}
                    >
                        <Input.Password/>
                    </Form.Item>

                    <Form.Item wrapperCol={{offset: 8, span: 16}}>
                        <Button type="primary"
                                htmlType="submit"
                                loading={onloading}
                        >
                            登录
                        </Button>
                    </Form.Item>
                </Form>

            </Modal>
        </>
    );
}
