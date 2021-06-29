import React, { useState } from "react";
import "./style.css"
import 'reactjs-popup/dist/index.css';
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import TextField from '@material-ui/core/TextField';
import Axios from "axios";
import ConfirmDialog from "./ConfirmDialog";
import Swal from "sweetalert2";

const ModalUpdateTopic = (props) => {

    const { close, dataParentToChild } = props
    const [topicName, setTopicName] = useState(dataParentToChild.topicName)
    const [priority, setPriority] = useState(dataParentToChild.priority)
    const [topicId, setTopicId] = useState(dataParentToChild.topicId)
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' });

    var deleteBoolean = true;
    if (dataParentToChild.active === 'Đã ngưng đăng ký') {
        deleteBoolean = false;
    }
    const [isActive, setIsActive] = useState(deleteBoolean)
    // dd-mm-yyyy
    var dateParts = dataParentToChild.startTime.split("-");
    var timeFromString = dateParts[2] + "-" + dateParts[1] + "-" + dateParts[0];
    const [startTime, setStartTime] = useState(timeFromString);
    // dd-mm-yyyy
    var dateParts = dataParentToChild.endTime.split("-");
    var timeToString = dateParts[2] + "-" + dateParts[1] + "-" + dateParts[0];
    const [endTime, setEndTime] = useState(timeToString);

    const topic = {
        topicName: topicName,
        priority: priority,
        active: isActive,
        topicId: topicId,
        startTime: startTime,
        endTime: endTime
    }

    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        "Authorization": "Bearer " + sessionStorage.getItem('jwtToken')
    };

    const BASE_URL = "http://localhost:8080";

    const onSubmit = (e) => {
        e.preventDefault();
        if (new Date(endTime).getTime() <= new Date(startTime).getTime()) {
            Swal.fire({
                title: "Thất bại",
                text: "Thời gian kết thúc phải lớn hơn thời gian bắt đầu",
                icon: "warning",
            }).then(() => {
                return;
            })
        }
        else {
            Axios.post(BASE_URL + "/api/v1/topics/update", topic, { headers: headers })
                .then(res => {
                    Swal.fire({
                        title: "Thành công",
                        text: "Cập nhật chuyên đề thành công",
                        icon: "success",
                    }).then(() => {
                        close()
                        // location.reload()
                    })
                })
                .catch(e => {
                    let errMes = '';
                    if (e.response.status === 400) {
                        errMes = e.response.data.message
                    } else if (e.response.status === 404) {
                        errMes = e.response.data.message
                    } else {
                        errMes = 'Không cập nhật được chuyên đề'
                    }
                    Swal.fire({
                        title: "Thất bại",
                        text: errMes,
                        icon: "error",
                    }).then(() => {
                        return;
                    })
                })
        }
    }

    return (
        <form onSubmit={onSubmit} >
            <div className="modal" >
                <a className="close"
                    onClick={() => {
                        setConfirmDialog({
                            isOpen: true,
                            title: 'Bạn có chắc muốn thoát?',
                            onConfirm: () => {
                                close();
                            }
                        })
                    }}>
                    &times;
                    </a>
                <div >
                    <GridContainer>
                        <GridItem xs={12} sm={12} md={12}>
                            <Card profile>
                                <CardHeader color="primary">
                                    <h4 >Chi tiết chuyên đề</h4>
                                </CardHeader>
                                <CardBody>
                                    <GridContainer>
                                        <GridItem xs={12} sm={12} md={12} style={{ marginTop: "1vh" }}>
                                            <TextField
                                                label="Tên chuyên đề"
                                                value={topicName}
                                                max
                                                required
                                                inputProps={{ maxLength: 100 }}
                                                onChange={(e) => { setTopicName(e.target.value) }}
                                                fullWidth={true}
                                                variant="outlined"
                                            />
                                        </GridItem>
                                        {/* </GridContainer>
                                    <GridContainer> */}
                                        <GridItem xs={12} sm={12} md={12} style={{ marginTop: "1vh" }}>
                                            <TextField
                                                label="Độ ưu tiên"
                                                value={priority}
                                                required
                                                type="number"
                                                InputProps={{ inputProps: { min: 0, max: 50 } }}
                                                onChange={(e) => { setPriority(e.target.value) }}
                                                fullWidth={true}
                                                variant="outlined"
                                            />
                                        </GridItem>
                                        {/* </GridContainer>
                                    <GridContainer> */}
                                        <GridItem xs={12} sm={12} md={12} style={{ marginTop: "1vh" }}>
                                            <TextField
                                                label="Thời gian bắt đầu"
                                                type="date"
                                                value={startTime}
                                                fullWidth={true}
                                                required
                                                onChange={(e) => { setStartTime(e.target.value) }}
                                                variant="outlined"
                                            />
                                        </GridItem>
                                        {/* </GridContainer>
                                    <GridContainer> */}
                                        <GridItem xs={12} sm={12} md={12} style={{ marginTop: "1vh" }}>
                                            <TextField
                                                label="Thời gian kết thúc"
                                                type="date"
                                                value={endTime}
                                                fullWidth={true}
                                                required
                                                onChange={(e) => { setEndTime(e.target.value) }}
                                                variant="outlined"
                                            />
                                        </GridItem>
                                    </GridContainer>
                                </CardBody>
                                <CardFooter>
                                    <Button color="primary" type="submit">Cập nhật</Button>
                                    {/* <Button color="primary" >Hủy</Button> */}
                                </CardFooter>
                            </Card>
                            <ConfirmDialog
                                confirmDialog={confirmDialog}
                                setConfirmDialog={setConfirmDialog}
                            />
                        </GridItem>
                    </GridContainer>
                </div>
            </div>
        </form>
    )
}

export default ModalUpdateTopic;