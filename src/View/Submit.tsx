import {Button, Modal, message} from "antd";
import {useState} from "react";
import TextArea from "antd/es/input/TextArea";
import {api_url} from "../main.tsx";
import axios from "axios";

export default function Submit({atcoderid}: { atcoderid: string }) {
    const [open, setOpen] = useState(false);
    const [code, setCode] = useState("");
    const [open2, setOpen2] = useState(false);
    const [onLoading2, setOnLoading2] = useState(false);
    const [state2, setState2] = useState("PENDING");

    const handleOpenModal = () => {
        setOpen(true);
    };

    const handleCloseModal = () => {
        setOpen(false);
    };

    const handleSubmit = () => {
        const data = {
            source: code,
            atcoderid: atcoderid,
        };

        console.log(data);

        axios
            .post(`${api_url}/submit/`, data, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            })
            .then((response) => {
                const {code: responseCode, msg, data: responseData} = response.data as {
                    code: number;
                    msg: string;
                    data: number;
                };

                if (responseCode === 0) {
                    message.success("提交成功");
                    console.log(response);
                    console.log(responseData);
                    const submitId = responseData;

                    setOnLoading2(true);
                    setOpen(false);
                    setOpen2(true);
                    setState2("PENDING");

                    checkSubmissionStatus(submitId);
                } else {
                    message.error(msg);
                }
            })
            .catch((error) => {
                message.error(error);
            });
    };

    const checkSubmissionStatus = (submitId: number) => {

            axios
                .get(`${api_url}/submit/data/${submitId}`, {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                })
                .then((response) => {
                    const {code: responseCode, msg, data: responseData} = response.data as {
                        code: number;
                        msg: string;
                        data: { statusCanonical: string };
                    };

                    if (responseCode === 0) {
                        const newStatus = responseData.statusCanonical;
                        setState2(newStatus);

                        if (newStatus !== "PENDING") {

                            setOnLoading2(false);
                        }
                    } else {
                        message.error(msg);

                    }
                })
                .catch((error) => {
                    message.error(error);

                });

    };

    return (
        <>
            <Button onClick={handleOpenModal}>Submit</Button>
            <Modal
                title="Submit Code"
                open={open}
                onCancel={handleCloseModal}
                footer={[
                    <Button
                        key="submit"
                        type="primary"
                        onClick={handleSubmit}
                        loading={onLoading2}
                    >
                        Submit
                    </Button>,
                ]}
            >
                <TextArea
                    name="code"
                    rows={20}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />
            </Modal>
            <Modal
                title="Submission Status"
                open={open2}
                footer={[
                    <Button
                        key="close"
                        loading={onLoading2}
                        onClick={() => setOpen2(false)}
                    >
                        Close
                    </Button>,
                ]}
            >
                <p>{state2}</p>
            </Modal>
        </>
    );
}
