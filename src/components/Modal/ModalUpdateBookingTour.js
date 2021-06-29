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
import axios from "axios";
import ConfirmDialog from "./ConfirmDialog";
import { Input, InputLabel, MenuItem, Select } from "@material-ui/core";
import Swal from "sweetalert2";

const ModalUpdateBookingTour = (props) => {

    const { close, dataParentToChild } = props;
    const [language, setLanguage] = useState(dataParentToChild.languageName);
    const [languageSelect, setLanguageSelect] = useState([]);
    const [quantity, setQuantity] = useState(dataParentToChild.quantity);
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' });

    //cắt ngày đi
    var dateTimeStartParts = dataParentToChild.startTime.split(" ");
    var dateStartParts = dateTimeStartParts[0].split("-")
    var dateStartString = dateStartParts[2] + "-" + dateStartParts[1] + "-" + dateStartParts[0];

    //cắt giờ đi
    var timeStartParts = dateTimeStartParts[1].split(":")
    var timeStartString = timeStartParts[0] + ":" + timeStartParts[1] + ":" + timeStartParts[2]


    //cắt giờ kết thúc
    var dateTimeEndParts = dataParentToChild.endTime.split(" ");
    var dateEndParts = dateTimeEndParts[0].split("-")
    var dateEndString = dateEndParts[2] + "-" + dateEndParts[1] + "-" + dateEndParts[0];
    var timeEndParts = dateTimeEndParts[1].split(":")
    var timeEndString = timeEndParts[0] + ":" + timeEndParts[1] + ":" + timeEndParts[2]


    const [startHour, setStartHour] = useState(timeStartString)
    const [startTime, setStartTime] = useState(dateStartString + "T" + timeStartString);
    const [endTime, setEndTime] = useState(dateEndString + "T" + timeEndString);
    const [endHour, setEndHour] = useState(timeEndString)

    const BASE_URL = "http://localhost:8080";

    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        "Authorization": "Bearer " + sessionStorage.getItem('jwtToken')
    };

    //load động language
    if (languageSelect.length == 0) {
        axios.get(BASE_URL + "/api/v1/languages/getAll", { headers: headers })
            .then(function (response) {
                const languageSelect = response.data.map(key =>
                    ({
                        languageId: key.languageId,
                        languageName: key.languageName,
                    })
                )
                setLanguageSelect(languageSelect);
            })
    }

    const updateBookingTour = {
        bookingTourId: dataParentToChild.bookingId,
        languageId: language,
        quantity: quantity,
        startTime: startTime,
        endTime: endTime
    }

    const checkValidBooking = () => {
        if (language == "Tiếng Anh") {
            updateBookingTour.languageId = 1
        } else if (language == "Tiếng Nhật") {
            updateBookingTour.languageId = 2
        } else if (language == "Tiếng Việt") {
            updateBookingTour.languageId = 3
        }
        var dateTimeStartParts = startTime.split("T");
        var dateStartParts = dateTimeStartParts[0].split("-")
        var dateStartString = dateStartParts[0] + "-" + dateStartParts[1] + "-" + dateStartParts[2];
        let timeStartWork = dateStartString + 'T00:00'
        var dateTimeEndParts = dataParentToChild.endTime.split("T")
        var dateEndParts = dateTimeEndParts[0].split("-")
        var dateEndString = dateEndParts[0] + "-" + dateEndParts[1] + "-" + dateEndParts[2];
        let timeEndWork = dateEndString + 'T18:00'

        if (new Date(endTime).getMinutes() % 10 != 0 || new Date(endTime).getMinutes() % 10 != 0) {
            Swal.fire({
                title: "Thông báo!",
                text: "Số phút phải chẵn [00, 10, 20, 30, 40, 50]",
                icon: "warning",
            })
                .then(() => {
                    return;
                })
        }
        else if ((new Date(startTime).getTime() - new Date(timeStartWork).getTime()) < 27000000) {
            console.log((new Date(startTime).getTime() - new Date(timeStartWork).getTime()))
            Swal.fire({
                title: "Thất bại",
                text: "Thời gian bắt đầu làm việc từ 7h30 - 18h",
                icon: "warning",
            }).then(() => {
                return false;
            })
        } else if (new Date(endTime).getTime() <= new Date(startTime).getTime()) {
            Swal.fire({
                title: "Thất bại",
                text: "Thời gian kết thúc phải lớn hơn thời gian bắt đầu tối đa 3 giờ",
                icon: "warning",
            }).then(() => {
                return false;
            })
        } else if ((new Date(endTime).getTime() - new Date(startTime).getTime()) > 10800000) {
            Swal.fire({
                title: "Thất bại",
                text: "Chuyến tham quan chỉ được tối đa 3 giờ",
                icon: "warning",
            }).then(() => {
                return false;
            })
        } else if ((new Date(endTime).getTime() - new Date(timeEndWork).getTime()) > 0) {
            Swal.fire({
                title: "Thất bại",
                text: "Quá giờ làm việc! Giờ làm kết thúc vào 18h",
                icon: "warning",
            }).then(() => {
                return false;
            })
        }
        else if (language.length == 0) {
            Swal.fire({
                title: "Thất bại",
                text: 'Yêu cầu chọn ngôn ngữ!',
                icon: "warning",
            }).then(() => {
                return false;
            })
        } else {
            return true;
        }
    }

    const onSubmit = (e) => {
        e.preventDefault();
        if (checkValidBooking() == true) {
            axios.post(BASE_URL + "/api/v1/bookingtours/update", updateBookingTour, { headers: headers })
                .then(res => {
                    Swal.fire({
                        title: "Thành công!",
                        text: 'Cập nhật thông tin chuyến tham quan thành công!',
                        icon: "success",
                    }).then(() => {
                        close()
                        // window.location.reload()
                    })
                })
                .catch(e => {
                    let errMes = '';
                    if (e.response.status === 400) {
                        errMes = e.response.data.message
                    } else if (e.response.status === 404) {
                        errMes = e.response.data.message
                    } else {
                        errMes = 'Không cập nhật chuyến tham quan'
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
        <form onSubmit={onSubmit} autoComplete="off">
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
                                    <h4 >Chi tiết chuyến tham quan</h4>
                                </CardHeader>
                                <CardBody>
                                    <GridContainer>
                                        <GridItem xs={12} sm={12} md={6} style={{ marginTop: "1vh" }}>
                                            <TextField
                                                label="Họ tên khách tham quan"
                                                value={dataParentToChild.visitorName}
                                                fullWidth={true}
                                                required
                                                inputProps={{ maxLength: 100 }}
                                                variant="outlined"
                                                disabled={true}
                                            />
                                        </GridItem>
                                        <GridItem xs={12} sm={12} md={6} style={{ marginTop: "1vh" }}>
                                            <InputLabel style={{ float: 'left' }}>Ngôn ngữ</InputLabel>
                                            <Select
                                                label="Ngôn ngữ"
                                                required
                                                value={language}
                                                onChange={(e) => setLanguage(e.target.value)}
                                                fullWidth={true}
                                            // variant="outlined"
                                            >
                                                {languageSelect.map((language) => (
                                                    <MenuItem key={language.languageName} value={language.languageName} >
                                                        {language.languageName}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </GridItem>
                                        <GridItem xs={12} sm={12} md={6} style={{ marginTop: "2vh" }}>
                                            <TextField
                                                label="Số điện thoại"
                                                value={dataParentToChild.visitorPhone}
                                                fullWidth={true}
                                                required
                                                type="number"
                                                inputProps={{ maxLength: 10 }}
                                                variant="outlined"
                                                disabled={true}
                                            />
                                        </GridItem>

                                        <GridItem xs={12} sm={12} md={6} style={{ marginTop: "2vh" }}>
                                            <TextField
                                                label="Sự kiện"
                                                value={dataParentToChild.eventName}
                                                fullWidth={true}
                                                variant="outlined"
                                                disabled={true}
                                            />
                                        </GridItem>
                                        <GridItem xs={12} sm={12} md={6} style={{ marginTop: "2vh" }}>
                                            <TextField
                                                label="Chuyên đề"
                                                value={dataParentToChild.listTopic}
                                                fullWidth={true}
                                                multiline
                                                variant="outlined"
                                                disabled={true}
                                            />
                                        </GridItem>
                                        <GridItem xs={12} sm={12} md={6} style={{ marginTop: "2vh" }}>
                                            <TextField
                                                label="Số lượng khách"
                                                value={quantity}
                                                fullWidth={true}
                                                required
                                                type="number"
                                                inputProps={{ min: 0, max: 50 }}
                                                onChange={(e) => { setQuantity(e.target.value) }}
                                                variant="outlined"
                                            />
                                        </GridItem>
                                        {/* <GridItem xs={12} sm={12} md={6} style={{ marginTop: "2vh" }}>
                                            <TextField
                                                label="Thời gian bắt đầu"
                                                type="time"
                                                value={startHour}
                                                fullWidth={true}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                required
                                                onChange={(e) => { setStartHour(e.target.value) }}
                                                variant="outlined"
                                            />
                                        </GridItem> */}
                                        <GridItem xs={12} sm={12} md={6} style={{ marginTop: "2vh" }}>
                                            <TextField
                                                label="Thời gian bắt đầu"
                                                type="datetime-local"
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

                                        <GridItem xs={12} sm={12} md={6} style={{ marginTop: "2vh" }}>
                                            <TextField
                                                label="Thời gian kết thúc"
                                                type="datetime-local"
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
                                        <GridItem xs={12} sm={12} md={6} style={{ marginTop: "2vh" }}>
                                            <Button color="primary" type="submit" fullWidth={true}>Cập nhật</Button>
                                        </GridItem>
                                    </GridContainer>
                                </CardBody>
                                <CardFooter>

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

export default ModalUpdateBookingTour;