import React, { useState } from "react";
import "./style.css"
import 'reactjs-popup/dist/index.css';
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import axios from "axios";
import ConfirmDialog from "./ConfirmDialog";
import Swal from "sweetalert2";
import { TextField } from "@material-ui/core";

const ModalUpdateEvent = (props) => {

    const { close, dataParentToChild, dataTopic } = props
    const [eventName, setEventName] = useState(dataParentToChild.eventName)
    const [priority, setPriority] = useState(dataParentToChild.priority)
    const [eventId, setEventId] = useState(dataParentToChild.eventId)
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' });

    var deleteBoolean = true;
    if (dataParentToChild.active === 'Đã xóa') {
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

    const [listTopicShow, setTopicEvent] = useState(dataTopic)

    const event = {
        eventName: eventName,
        eventId: eventId,
        startTime: startTime,
        endTime: endTime,
        active: isActive,
        listTopic: []
    }

    const BASE_URL = "http://localhost:8080";

    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        "Authorization": "Bearer " + sessionStorage.getItem('jwtToken')
    };

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
        } else {
            axios.post(BASE_URL + "/api/v1/events/update", event, { headers: headers })
                .then(res => {
                    Swal.fire({
                        title: "Thành công",
                        text: "Cập nhật sự kiện thành công",
                        icon: "success",
                    }).then(() => {
                        close()
                        // location.reload();
                    })
                })
                .catch(e => {
                    let errMes = '';
                    if (e.response.status === 400) {
                        errMes = e.response.data.message
                    } else if (e.response.status === 404) {
                        errMes = e.response.data.message
                    } else {
                        errMes = 'Không cập nhật được sự kiện'
                    } Swal.fire({
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
                                    <h4 >Chi tiết sự kiện</h4>
                                </CardHeader>
                            </Card>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6}>
                            <GridContainer>
                                <GridItem xs={12} sm={12} md={12} style={{ marginTop: "1vh" }}>
                                    <p style={{ fontSize: "1.5em", textAlign: "center", fontWeight: "bold" }}>Chuyên đề của sự kiện</p>
                                    <div style={{
                                        flexWrap: 'wrap',
                                        justifyContent: 'space-around',
                                        overflow: 'auto',
                                        maxHeight: 200,
                                        textAlign: "center"
                                    }}>
                                        {listTopicShow.map((topic) => (
                                            <p key={topic.topicId} value={topic.topicId} style={{ wordWrap: 'break-word', overflow: 'auto', fontSize: '1.3em' }}>
                                                {topic.topicName} ({topic.startTime + " - " + topic.endTime})
                                            </p>

                                        ))}
                                    </div>
                                </GridItem>
                            </GridContainer>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6}>
                            <GridContainer>
                                <GridItem xs={12} sm={12} md={11} style={{ marginTop: "1vh" }}>
                                    <TextField
                                        label="Tên sự kiện"
                                        value={eventName}
                                        fullWidth={true}
                                        required
                                        inputProps={{ maxLength: 150 }}
                                        onChange={(e) => { setEventName(e.target.value) }}
                                        variant="outlined"
                                    />
                                </GridItem>

                                <GridItem xs={12} sm={12} md={11} style={{ marginTop: "1vh" }}>
                                    <TextField
                                        hiddenLabel="true"
                                        label="Thời gian bắt đầu"
                                        type="date"
                                        value={startTime}
                                        fullWidth={true}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        required
                                        onChange={(e) => { setStartTime(e.target.value) }}
                                        variant="outlined"
                                    />
                                </GridItem>

                                <GridItem xs={12} sm={12} md={11} style={{ marginTop: "1vh" }}>
                                    <TextField
                                        label="Thời gian kết thúc"
                                        type="date"
                                        value={endTime}
                                        fullWidth={true}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        required
                                        onChange={(e) => { setEndTime(e.target.value) }}
                                        variant="outlined"
                                    />
                                </GridItem>
                                <GridItem xs={12} sm={12} md={11}>
                                    <Button
                                        color="primary"
                                        type="submit"
                                        fullWidth={true}>Cập nhật</Button>
                                </GridItem>
                            </GridContainer>
                            <ConfirmDialog
                                confirmDialog={confirmDialog}
                                setConfirmDialog={setConfirmDialog}
                            />
                        </GridItem>
                    </GridContainer>
                </div>
            </div>
        </form >
    )
}

export default ModalUpdateEvent;