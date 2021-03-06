import React, { useState } from "react";
import "./style.css"
import 'reactjs-popup/dist/index.css';
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import GridListCheckbox from "components/Grid/GridListCheckbox";

import TextField from '@material-ui/core/TextField';
import axios from "axios";
import ConfirmDialog from "./ConfirmDialog";
import Swal from "sweetalert2";

const ModalCreateEvent = ({ close }) => {
    const [eventName, setEventName] = useState('');
    const [eventId, setEventId] = useState('');
    const [priority, setPriority] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [topicSelect, setTopicSelect] = useState([]);
    const [topic, setTopicEvent] = useState([]);
    const [topicSelected, setTopicSelected] = useState([]);
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' });

    const event = {
        eventId: eventId,
        eventName: eventName,
        active: true,
        startTime: startTime,
        endTime: endTime,
        listTopic: topicSelected
    }

    const BASE_URL = "http://localhost:8080"

    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        "Authorization": "Bearer " + sessionStorage.getItem('jwtToken')
    };

    if (topicSelect.length == 0) {
        axios.get(BASE_URL + "/api/v1/topics/getAllTopicActive", { headers: headers })
            .then(function (response) {
                const topicSelect = response.data.map(key =>
                    ({
                        topicId: key.topicId,
                        topicName: key.topicName,
                        startTime: key.startTime,
                        endTime: key.endTime
                    })
                )
                setTopicSelect(topicSelect);
            })
    }

    const onSubmit = (e) => {
        e.preventDefault();
        if (new Date(endTime).getTime() <= new Date(startTime).getTime()) {
            Swal.fire({
                title: "Th???t b???i",
                text: "Th???i gian k???t th??c ph???i l???n h??n th???i gian b???t ?????u",
                icon: "warning",
            }).then(() => {
                return;
            })
        }
        else {
            axios.post(BASE_URL + "/api/v1/events/create", event, { headers: headers })
                .then(res => {
                    if (res.data.message) {
                        Swal.fire({
                            title: "Th???t b???i",
                            text: res.data.message,
                            icon: "warning",
                        }).then(() => {
                            return;
                        })
                    } else {
                        axios.post(BASE_URL + '/api/v1/eventtopics/create/' + res.data.eventId + '/' + topicSelected, { headers: headers })
                            .then(res => {
                                if (res.data.message == 'th??nh c??ng') {
                                    Swal.fire({
                                        title: "Th??nh c??ng",
                                        text: "Th??m m???i s??? ki???n th??nh c??ng",
                                        icon: "success",
                                    }).then(() => {
                                        close()
                                    })
                                }
                                else {
                                    Swal.fire({
                                        title: "Th???t b???i",
                                        text: "Th??m chuy??n ????? m???i cho s??? ki???n th???t b???i",
                                        icon: "error",
                                        // timer: 2000,
                                        // buttons: false,
                                    }).then(() => {
                                        return;
                                    })
                                }
                            })
                            .catch(err => {
                                let errMes = '';
                                if (err.response.status === 400) {
                                    errMes = err.response.data.message
                                } else if (err.response.status === 404) {
                                    errMes = err.response.data.message
                                } else {
                                    errMes = 'Th??m m???i s??? ki???n th???t b???i'
                                } Swal.fire({
                                    title: "Th???t b???i",
                                    text: errMes,
                                    icon: "error",
                                }).then(() => {
                                    return;
                                })
                            })
                    }
                })
                .catch(e => {
                    let errMes = '';
                    if (e.response.status === 400) {
                        errMes = e.response.data.message
                    } else if (e.response.status === 404) {
                        errMes = e.response.data.message
                    } else {
                        errMes = 'Th??m m???i s??? ki???n th???t b???i'
                    } Swal.fire({
                        title: "Th???t b???i",
                        text: errMes,
                        icon: "error",
                    }).then(() => {
                        return;
                    })
                })
        }
    }

    const handleCheckboxChange = (e) => {
        if (e.target.checked) {
            setTopicSelected([...topicSelected, e.target.value]);
        } else {
            setTopicSelected(topicSelected.filter(id => id !== e.target.value));
        }
    }
    return (
        <form onSubmit={onSubmit}>
            <div className="modal" >
                <a className="close"
                    onClick={() => {
                        setConfirmDialog({
                            isOpen: true,
                            title: 'B???n c?? ch???c mu???n tho??t?',
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
                                    <h4 >Th??m m???i s??? ki???n</h4>
                                </CardHeader>
                            </Card>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6}>
                            <GridContainer>
                                <GridItem xs={12} sm={12} md={12}>
                                </GridItem>
                                <GridItem xs={12} sm={12} md={12} style={{ marginTop: "1vh" }}>
                                    <GridListCheckbox
                                        nameCheckbox='listTopic'
                                        label='Chuy??n ?????'
                                        items={topicSelect}
                                        height="auto"
                                        size='medium'
                                        color='primary'
                                        handleChange={handleCheckboxChange} />
                                </GridItem>
                            </GridContainer>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6}>
                            <GridContainer>
                                <GridItem xs={12} sm={12} md={12} style={{ marginTop: "1vh" }}>
                                    <TextField
                                        label="T??n s??? ki???n"
                                        value={eventName}
                                        fullWidth={true}
                                        required
                                        inputProps={{ maxLength: 150 }}
                                        onChange={(e) => { setEventName(e.target.value) }}
                                        variant="outlined"
                                    />
                                </GridItem>

                                <GridItem xs={12} sm={12} md={12} style={{ marginTop: "1vh" }}>
                                    <TextField
                                        hiddenLabel="true"
                                        label="Th???i gian b???t ?????u"
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

                                <GridItem xs={12} sm={12} md={12} style={{ marginTop: "1vh" }}>
                                    <TextField
                                        label="Th???i gian k???t th??c"
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

                                <GridItem xs={12} sm={12} md={12}>

                                    <Button
                                        color="primary"
                                        type="submit"
                                        fullWidth={true}>Th??m m???i</Button>
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
        </form>
    )
}

export default ModalCreateEvent;