import {Button, Form, Input} from "antd";
import {api_url} from "../main.tsx";
import axios from "axios";

export default function ChangePWD() {
    return (
        <div>
            <Form
                name="basic"
                labelCol={{span: 8}}
                wrapperCol={{span: 16}}
                style={{maxWidth: 600, margin: '0 auto'}}
                initialValues={{remember: true}}
                autoComplete="off"
                onFinish={(values) => {
                    if (values.newpwd !== values.confirmpwd || values.newpwd === '') {
                        alert('两次密码不一致');
                        return;
                    }
                    if (values.oldpwd === values.newpwd) {
                        alert('新旧密码不能相同');
                        return;
                    }

                    axios.post(api_url + '/user/pwd', values, {
                        headers: {
                            'Authorization': localStorage.getItem('token')
                        }
                    })
                        .then(res => {
                            const data = res.data as { code: number, msg: string }
                            if (data.code === 200) {
                                alert(data.msg);
                            } else {
                                alert(data.msg);
                            }
                        }).catch((err) => {
                        alert(err);
                    })
                }}
            >
                <Form.Item
                    label="旧密码"
                    name="oldpwd"
                    rules={[{required: true, message: '请输入旧密码!'}]}
                >
                    <Input.Password/>
                </Form.Item>
                <Form.Item
                    label="新密码"
                    name="newpwd"
                    rules={[{required: true, message: '请输入新密码!'}]}
                >
                    <Input.Password/>
                </Form.Item>
                <Form.Item
                    label="确认新密码"
                    name="confirmpwd"
                    rules={[{required: true, message: '请输入确认新密码!'}]}
                >
                    <Input.Password/>
                </Form.Item>
                <Form.Item wrapperCol={{offset: 8, span: 16}}>
                    <Button type="primary" htmlType="submit">
                        提交
                    </Button>
                </Form.Item>
            </Form>

        </div>
    );
}