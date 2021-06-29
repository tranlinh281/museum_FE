import React, { useMemo, useState } from "react";
import "./style.css"
import 'reactjs-popup/dist/index.css';
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import TextField from '@material-ui/core/TextField';
import axios from "axios";
import Axios from "axios";
import { FormControlLabel, Input, InputLabel, MenuItem, Select, Switch } from "@material-ui/core";
import Swal from "sweetalert2";
import { checkSW } from "service/StaffAPI";
import { findTG } from "service/StaffAPI";

const ModalAddNewVisitorBookingTourEvent = (props) => {

    const { close, dataParentToChild } = props;
    const visitorId = dataParentToChild.visitorId
    const [bookingId, setBookingId] = useState('');
    const [bookingtourStatusId, setBookingtourStatusId] = useState('');

    const [createAt, setCreateAt] = useState('');
    const [endTime, setEndTime] = useState('');
    const [eventId, setEventId] = useState('');
    const [eventSelect, setEventSelect] = useState([]);

    const [suggestGroupTour, setSuggestGroupTour] = useState([])
    const [suggestGR, setSuggestGR] = useState('')
    var [flag, setFlag] = useState(true)

    const [language, setLanguage] = useState('');
    const [languageSelect, setLanguageSelect] = useState([]);

    const [quantity, setQuantity] = useState('');
    const [startTime, setStartTime] = useState('');
    const [listTG, setListTG] = useState([])
    const [suggestTG, setSuggestTG] = useState('')
    var [flagTG, setFlagTG] = useState(true)
    const [STT1, setSTT1] = useState(false)
    const [btnAddTG, setBtnAddTG] = useState(true)
    const [btnGroup, setBtnGroup] = useState(false)
    const [flagPT, setFlagPT] = useState(true)
    const [flagWS, setFlagWS] = useState(true)

    const [checked, setChecked] = useState(true);

    const toggleChecked = () => {
        console.log(checked)
        setChecked((prev) => !prev);
    };

    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        "Authorization": "Bearer " + sessionStorage.getItem('jwtToken')
    };
    const BASE_URL = "http://localhost:8080"

    //Thêm mới booking
    const bookingTour = {
        bookingId: bookingId, //tự tăng
        bookingtourStatusId: bookingtourStatusId, //mặc định là đang chờ(1) (2-Chưa diễn ra) (3-Đang diễn ra)(4-Hoàn thành)(5-Hủy)
        endTime: endTime, //thời gian kết thúc tour
        eventId: eventId, //event
        listTopic: [],
        groupTourId: suggestGR, //nếu có merge group
        languageId: language, //list ngôn ngữ
        quantity: quantity, //số lượng người
        startTime: startTime, //thời gian bắt đầu đi
        usernameStaff: sessionStorage.getItem('usernameStaff'), //tên nhân viên Thêm mới
        visitorId: dataParentToChild.visitorId//tên của người đại diện
    }

    //check thông tin để tìm HDV
    const checkAddGT = {
        endTime: endTime,
        event: eventId,
        language: language,
        listTopic: [],
        quantity: quantity,
        startTime: startTime
    }

    useMemo(() => {
        //Load language, event động
        if (languageSelect.length == 0) {
            Axios.get(BASE_URL + "/api/v1/languages/getAll", { headers: headers })
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
        if (eventSelect.length == 0) {
            Axios.get(BASE_URL + "/api/v1/events/getAllEventActive", { headers: headers })
                .then(function (response) {
                    const eventSelectTemp = response.data.map(key =>
                    ({
                        eventId: key.eventId,
                        eventName: key.eventName,
                        startTime: key.startTime,
                        endTime: key.endTime,
                    })
                    )
                    setEventSelect(eventSelectTemp);
                })
        }
    }, [])

    //Check valid thông tin booking
    function checkValidBooking() {
        var dateTimeStartParts = startTime.split("T");
        var dateStartParts = dateTimeStartParts[0].split("-")
        var dateStartString = dateStartParts[0] + "-" + dateStartParts[1] + "-" + dateStartParts[2];
        let timeStartWork = dateStartString + 'T00:00'
        var dateTimeEndParts = endTime.split("T")
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
                    return false;
                })
        }
        else if ((new Date(startTime).getTime() - new Date(timeStartWork).getTime()) < 27000000) {
            Swal.fire({
                title: "Thông báo!",
                text: "Thời gian bắt đầu làm việc từ 7h30 - 18h",
                icon: "warning",
            }).then(() => {
                return false;
            })
        } else if (new Date(endTime).getTime() <= new Date(startTime).getTime()) {
            Swal.fire({
                title: "Thông báo!",
                text: "Thời gian kết thúc phải lớn hơn thời gian bắt đầu và tối đa 3 giờ",
                icon: "warning",
            }).then(() => {
                return false;
            })
        } else if ((new Date(endTime).getTime() - new Date(startTime).getTime()) > 10800000) {
            Swal.fire({
                title: "Thông báo!",
                text: "đoàn tham quan chỉ được tối đa 3 giờ",
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

        } else if (quantity.length == 0) {
            Swal.fire({
                title: "Thông báo!",
                text: 'Yêu cầu điền số lượng khách!',
                icon: "warning",
            }).then(() => {
                return false;
            })
        } else if (eventId.length == 0) {
            Swal.fire({
                title: "Thông báo!",
                text: 'Yêu cầu chọn sự kiện!',
                icon: "warning",
            }).then(() => {
                return false;
            })
        } else if (language.length == 0) {
            Swal.fire({
                title: "Thông báo!",
                text: 'Yêu cầu chọn ngôn ngữ!',
                icon: "warning",
            }).then(() => {
                return false;
            })
        } else if (startTime.length == 0) {
            Swal.fire({
                title: "Thông báo!",
                text: 'Yêu cầu chọn thời gian bắt đầu!',
                icon: "warning",
            }).then(() => {
                return false;
            })
        } else if (endTime.length == 0) {
            Swal.fire({
                title: "Thông báo!",
                text: 'Yêu cầu chọn thời gian kết thúc!',
                icon: "warning",
            }).then(() => {
                return false;
            })
        } else {
            return true;
        }
    }

    //onchange event
    async function checkAddNewGTForEvent(eventIdChange) {
        if (quantity != '' && endTime != '' && startTime != '' && eventId != '' && language != '') {
            checkAddGT.event = eventIdChange
            await Axios.post(BASE_URL + "/api/v1/bookingtours/suggest-grouptour", checkAddGT)
                .then(function (res) {
                    const data = res.data.map(key => ({
                        fullname: key.fullname,
                        username: key.username,
                        workingScheduleId: key.workingScheduleId,
                        groupTourId: key.groupTourId,
                        showName: key.fullname + "-" + key.username
                    }))
                    for (var i of data) {
                        if (i.fullname == null) {
                            i.showName = 'Chưa có HDV'

                        }
                    }
                    setSuggestGR('')
                    setSuggestGroupTour(data)
                    setFlag(false)
                })
        }


        if (startTime != '' && endTime != '' && language != '') {
            let start = startTime.split("T")
            let end = endTime.split("T")
            let timeEnd = end[0] + " " + end[1]
            let timeStart = start[0] + " " + start[1]
            let check = await checkSW(timeStart)
            if (check) {
                // setFlagTG(false) //mở select HDV -> chọn
                //sst2 -> thêm username
                await findTG(timeStart, timeEnd, language)
                    .then(async function (res) {
                        const data = res.map(key => ({
                            fullname: key.fullname,
                            groupTourId: key.groupTourId,
                            username: key.username,
                            workingScheduleId: key.workingScheduleId
                        }))
                        setSuggestTG('')
                        setListTG(data)
                        setFlagPT(false)
                        setFlagWS(true)
                    })

                //stt7
            } else {

                setListTG([])
                setFlagPT(true)
                setFlagWS(false)
                setSTT1(true)
                // setFlagTG(false)
            }
        }
    }

    //Ngôn ngữ
    async function checkAddNewGTForLanguage(languageChange) {
        if (quantity != '' && endTime != '' && startTime != '' && eventId != '' && language != '') {
            checkAddGT.language = languageChange
            await Axios.post(BASE_URL + "/api/v1/bookingtours/suggest-grouptour", checkAddGT)
                .then(function (res) {
                    const data = res.data.map(key => ({
                        fullname: key.fullname,
                        username: key.username,
                        workingScheduleId: key.workingScheduleId,
                        groupTourId: key.groupTourId,
                        showName: key.fullname + "-" + key.username
                    }))
                    for (var i of data) {
                        if (i.fullname == null) {
                            i.showName = 'Chưa có HDV'

                        }
                    }
                    setSuggestGR('')
                    setSuggestGroupTour(data)
                    setFlag(false)
                })
        }

        if (startTime != '' && endTime != '' && language != '') {
            let start = startTime.split("T")
            let end = endTime.split("T")
            let timeEnd = end[0] + " " + end[1]
            let timeStart = start[0] + " " + start[1]
            let check = await checkSW(timeStart)
            if (check) {
                // setFlagTG(false) //mở select HDV -> chọn
                //sst2 -> thêm username
                await findTG(timeStart, timeEnd, language)
                    .then(async function (res) {
                        const data = res.map(key => ({
                            fullname: key.fullname,
                            groupTourId: key.groupTourId,
                            username: key.username,
                            workingScheduleId: key.workingScheduleId
                        }))
                        setSuggestTG('')
                        setListTG(data)
                        setFlagPT(false)
                        setFlagWS(true)
                    })

                //stt7
            } else {

                setListTG([])
                setFlagPT(true)
                setFlagWS(false)
                setSTT1(true)
                // setFlagTG(false)
            }
        }
    }

    //for starttime
    async function checkAddNewGTForStartTime(starttime) {
        if (quantity != '' && endTime != '' && startTime != '' && eventId != '' && language != '') {
            checkAddGT.startTime = starttime
            await Axios.post(BASE_URL + "/api/v1/bookingtours/suggest-grouptour", checkAddGT)
                .then(function (res) {
                    const data = res.data.map(key => ({
                        fullname: key.fullname,
                        username: key.username,
                        workingScheduleId: key.workingScheduleId,
                        groupTourId: key.groupTourId,
                        showName: key.fullname + "-" + key.username
                    }))
                    for (var i of data) {
                        if (i.fullname == null) {
                            i.showName = 'Chưa có HDV'

                        }
                    }
                    setSuggestGR('')
                    setSuggestGroupTour(data)
                    setFlag(false)
                })
        }

        if (startTime != '' && endTime != '' && language != '') {
            let start = startTime.split("T")
            let end = endTime.split("T")
            let timeEnd = end[0] + " " + end[1]
            let timeStart = start[0] + " " + start[1]
            let check = await checkSW(timeStart)
            if (check) {
                // setFlagTG(false) //mở select HDV -> chọn
                //sst2 -> thêm username
                await findTG(timeStart, timeEnd, language)
                    .then(async function (res) {
                        const data = res.map(key => ({
                            fullname: key.fullname,
                            groupTourId: key.groupTourId,
                            username: key.username,
                            workingScheduleId: key.workingScheduleId
                        }))
                        setSuggestTG('')
                        setListTG(data)
                        setFlagPT(false)
                        setFlagWS(true)
                    })

                //stt7
            } else {

                setListTG([])
                setFlagPT(true)
                setFlagWS(false)
                setSTT1(true)
                // setFlagTG(false)
            }
        }
    }

    //endtime
    async function checkAddNewGTForEndTime(endtime) {
        if (quantity != '' && endTime != '' && startTime != '' && eventId != '' && language != '') {
            checkAddGT.endTime = endtime
            await Axios.post(BASE_URL + "/api/v1/bookingtours/suggest-grouptour", checkAddGT)
                .then(function (res) {
                    const data = res.data.map(key => ({
                        fullname: key.fullname,
                        username: key.username,
                        workingScheduleId: key.workingScheduleId,
                        groupTourId: key.groupTourId,
                        showName: key.fullname + "-" + key.username
                    }))
                    for (var i of data) {
                        if (i.fullname == null) {
                            i.showName = 'Chưa có HDV'

                        }
                    }
                    setSuggestGR('')
                    setSuggestGroupTour(data)
                    setFlag(false)
                })
        }

        if (startTime != '' && endTime != '' && language != '') {
            let start = startTime.split("T")
            let end = endTime.split("T")
            let timeEnd = end[0] + " " + end[1]
            let timeStart = start[0] + " " + start[1]
            let check = await checkSW(timeStart)
            if (check) {
                // setFlagTG(false) //mở select HDV -> chọn
                //sst2 -> thêm username
                await findTG(timeStart, timeEnd, language)
                    .then(async function (res) {
                        const data = res.map(key => ({
                            fullname: key.fullname,
                            groupTourId: key.groupTourId,
                            username: key.username,
                            workingScheduleId: key.workingScheduleId
                        }))
                        setSuggestTG('')
                        setListTG(data)
                        setFlagPT(false)
                        setFlagWS(true)
                    })

                //stt7
            } else {

                setListTG([])
                setFlagPT(true)
                setFlagWS(false)
                setSTT1(true)
                // setFlagTG(false)
            }
        }
    }

    //quantity
    async function checkAddNewGTForQuantity(quantityChange) {
        if (quantity != '' && endTime != '' && startTime != '' && eventId != '' && language != '') {
            checkAddGT.quantity = quantityChange
            await Axios.post(BASE_URL + "/api/v1/bookingtours/suggest-grouptour", checkAddGT)
                .then(function (res) {
                    const data = res.data.map(key => ({
                        fullname: key.fullname,
                        username: key.username,
                        workingScheduleId: key.workingScheduleId,
                        groupTourId: key.groupTourId,
                        showName: key.fullname + "-" + key.username
                    }))
                    for (var i of data) {
                        if (i.fullname == null) {
                            i.showName = 'Chưa có HDV'

                        }
                    }
                    setSuggestGR('')
                    setSuggestGroupTour(data)
                    setFlag(false)
                })
        }

        if (startTime != '' && endTime != '' && language != '') {
            let start = startTime.split("T")
            let end = endTime.split("T")
            let timeEnd = end[0] + " " + end[1]
            let timeStart = start[0] + " " + start[1]
            let check = await checkSW(timeStart)
            if (check) {
                // setFlagTG(false) //mở select HDV -> chọn
                //sst2 -> thêm username
                await findTG(timeStart, timeEnd, language)
                    .then(async function (res) {
                        const data = res.map(key => ({
                            fullname: key.fullname,
                            groupTourId: key.groupTourId,
                            username: key.username,
                            workingScheduleId: key.workingScheduleId
                        }))
                        setSuggestTG('')
                        setListTG(data)
                        setFlagPT(false)
                        setFlagWS(true)
                    })

                //stt7
            } else {

                setListTG([])
                setFlagPT(true)
                setFlagWS(false)
                setSTT1(true)
                // setFlagTG(false)
            }
        }

        // }
    }

    //Tìm nhóm phù hợp
    async function checkAddNewGT() {
        await Axios.post(BASE_URL + "/api/v1/bookingtours/suggest-grouptour", checkAddGT)
            .then(function (res) {
                const data = res.data.map(key => ({
                    fullname: key.fullname,
                    username: key.username,
                    workingScheduleId: key.workingScheduleId,
                    groupTourId: key.groupTourId,
                    showName: key.fullname + "-" + key.username
                }))
                for (var i of data) {
                    if (i.fullname == null) {
                        i.showName = 'Chưa có HDV'

                    }
                }
                setSuggestGR('')
                setSuggestGroupTour(data)
                setFlag(false)
            })


    }

    //tìm HDV phù hợp
    async function getTGToAdd() {
        if (checkValidBooking() == true) {
            let start = startTime.split("T")
            let end = endTime.split("T")
            let timeEnd = end[0] + " " + end[1]
            let timeStart = start[0] + " " + start[1]
            let check = await checkSW(timeStart)
            if (check) {
                // setFlagTG(false) //mở select HDV -> chọn
                //sst2 -> thêm username
                await findTG(timeStart, timeEnd, language)
                    .then(async function (res) {
                        const data = res.map(key => ({
                            fullname: key.fullname,
                            groupTourId: key.groupTourId,
                            username: key.username,
                            workingScheduleId: key.workingScheduleId
                        }))
                        setSuggestTG('')
                        setListTG(data)
                        setFlagPT(false)
                        setFlagWS(true)
                    })

                //stt7
            } else {
                setListTG([])
                setFlagPT(true)
                setFlagWS(false)
                setSTT1(true)
                // setFlagTG(false)
            }
        }
        else {
            setFlagTG(true)
        }
    }

    //Check nhóm bị null HDV
    async function checkNullTG(grId) {
        for (var i of suggestGroupTour) {
            if (i.groupTourId == grId) {
                if (i.fullname != null) {
                    setSuggestTG([])
                    setFlagTG(true)
                    setBtnAddTG(true)
                    return true
                } else {
                    setFlagTG(false)
                    setBtnAddTG(false)
                    getTGToAdd()
                    return true
                }
            }
        }
        setFlagTG(false)
        setBtnAddTG(false)
        getTGToAdd()
        return false

    }

    //submit form update
    async function onSubmit(e) {
        e.preventDefault();
        let start = startTime.split("T")
        let timeStart = start[0] + " " + start[1]
        if (checkValidBooking() == true) {
            if (checked) {
                axios.post("http://localhost:8080/api/v1/accounts/autoAssignTourGuide", bookingTour)
                    .then(res => {

                        Swal.fire({
                            title: "Thành công!",
                            text: res.data,
                            icon: "success",
                        }).then(() => {
                            close()
                        })
                    })
                    .catch(e => {
                        let err = '';
                        if (e.response.status === 400) {
                            err = e.response.data.message
                        } else if (e.response.status === 404) {
                            err = e.response.data.message
                        } else {
                            err = 'Thêm mới đoàn tham quan thất bại'
                        }
                        Swal.fire({
                            title: "Thất bại",
                            text: err,
                            icon: "error",
                            // timer: 2000,
                            // buttons: false,
                        })
                    })
            } else {
                let checkTime = await checkSW(timeStart)
                //ngày làm đã chạy auto
                if (checkTime) {
                    if (suggestGR.length == 0) { //bắt buộc chọn nhóm
                        Swal.fire({
                            title: "Thông báo!",
                            text: 'Yêu cầu chọn nhóm!',
                            icon: "warning",
                        }).then(() => {
                            return;
                        })
                    }
                    else if (suggestGR != 2021) {
                        if (suggestTG == 'parttime') {
                            bookingTour.bookingtourStatusId = 7

                        } else {
                            bookingTour.bookingtourStatusId = 2

                        }
                        axios.post(BASE_URL + "/api/v1/bookingtours/create", bookingTour)
                            .then(async function (res) {
                                if (suggestTG.length != 0) {
                                    axios.post(BASE_URL + "/api-v1/assignTourGuideForGroupTour/" + suggestTG + "/" + res.data.bookingId, { headers: headers })
                                        .then(res => {

                                        })
                                }
                                Swal.fire({
                                    title: "Thành công!",
                                    text: 'Thêm mới đoàn tham quan thành công!',
                                    icon: "success",
                                }).then(() => {
                                    close()
                                })
                            })
                    }
                    else if (suggestGR == 2021 && suggestTG == '') { //bắt buộc chọn HDV
                        Swal.fire({
                            title: "Thông báo!",
                            text: 'Yêu cầu chọn HDV!',
                            icon: "warning",
                        }).then(() => {
                            return;
                        })
                    } else if (suggestTG == 'waitWS') { //check lại nếu nhân viên sửa bừa
                        Swal.fire({
                            title: "Thông báo!",
                            text: 'Ngày chọn đã có lịch làm. Yêu cầu chọn lại HDV!',
                            icon: "warning",
                        }).then(() => {
                            getTGToAdd()
                            return;
                        })
                    }
                    else if (suggestGR == 2021) { //nếu chọn thêm nhóm mới -> 2 || 7
                        let check
                        let start = startTime.split("T")
                        let end = endTime.split("T")
                        let timeEnd = end[0] + " " + end[1]
                        let timeStart = start[0] + " " + start[1]
                        let URL = ""
                        if (listTG.length == 0 || suggestTG == "parttime") {
                            //stt7
                            URL = BASE_URL + "/api/v1/bookingtours/add-tour-stt-7?endTime=" + timeEnd + "&eventId=" + eventId + "&language=" + language + "&quantity=" + quantity + "&staffUsername=" + sessionStorage.getItem('usernameStaff') + "&startTime=" + timeStart + "&visitorId=" + visitorId
                            check = true
                        }
                        else {
                            URL = BASE_URL + "/api/v1/bookingtours/add-tour-stt-2?endTime=" + timeEnd + "&eventId=" + eventId + "&language=" + language + "&quantity=" + quantity + "&staffUsername=" + sessionStorage.getItem('usernameStaff') + "&startTime=" + timeStart + "&tourguideUsername=" + suggestTG + "&visitorId=" + visitorId
                            check = true
                        }
                        if (check == true) {
                            axios.post(URL)
                                .then(function (res) {
                                    Swal.fire({
                                        title: "Thành công!",
                                        text: 'Thêm mới đoàn tham quan thành công!',
                                        icon: "success",
                                    }).then(() => {
                                        close()
                                    })
                                })
                                .catch(e => {
                                    let err = '';
                                    if (e.response.status === 400) {
                                        err = e.response.data.message
                                    } else if (e.response.status === 404) {
                                        err = e.response.data.message
                                    } else {
                                        err = 'Thêm mới đoàn tham quan thất bại'
                                    }
                                    Swal.fire({
                                        title: "Thất bại",
                                        text: err,
                                        icon: "error",
                                        // timer: 2000,
                                        // buttons: false,
                                    })
                                })
                        }
                    }
                }// end if check time lịch làm
                else { //nếu k có lịch làm-> 1
                    if (suggestGR == 2021 && suggestTG == 'waitWS') {
                        let check
                        let start = startTime.split("T")
                        let end = endTime.split("T")
                        let timeEnd = end[0] + " " + end[1]
                        let timeStart = start[0] + " " + start[1]
                        let URL = ""
                        if (STT1 == true) {
                            URL = BASE_URL + "/api/v1/bookingtours/add-tour-stt-1?endTime=" + timeEnd + "&eventId=" + eventId + "&language=" + language + "&quantity=" + quantity + "&staffUsername=" + sessionStorage.getItem('usernameStaff') + "&startTime=" + timeStart + "&visitorId=" + visitorId
                            check = true
                        }
                        if (check) {
                            axios.post(URL)
                                .then(function (res) {
                                    Swal.fire({
                                        title: "Thành công!",
                                        text: 'Thêm mới đoàn tham quan thành công!',
                                        icon: "success",
                                    }).then(() => {
                                        close()
                                        // location.reload();
                                    })
                                })
                                .catch(e => {
                                    let err = '';
                                    if (e.response.status === 400) {
                                        err = e.response.data.message
                                    } else if (e.response.status === 404) {
                                        err = e.response.data.message
                                    } else {
                                        err = 'Thêm mới đoàn tham quan thất bại'
                                    }
                                    Swal.fire({
                                        title: "Thất bại",
                                        text: err,
                                        icon: "error",
                                    })
                                })
                        }
                    }
                    else if (suggestGR != 2021 && suggestTG == 'waitWS') {
                        bookingTour.bookingtourStatusId = 1
                        axios.post(BASE_URL + "/api/v1/bookingtours/create", bookingTour)
                            .then(async function (res) {
                                Swal.fire({
                                    title: "Thành công!",
                                    text: 'Thêm mới đoàn tham quan thành công!',
                                    icon: "success",
                                }).then(() => {
                                    close()
                                })
                            })
                            .catch(async function (res) {
                                Swal.fire({
                                    title: "Thất bại!",
                                    text: 'Thêm mới đoàn tham quan thất bại!',
                                    icon: "erorr",
                                }).then(() => {
                                    return;
                                })
                            })
                    }
                    else if (suggestGR.length == 0) {
                        Swal.fire({
                            title: "Thông báo!",
                            text: 'Yêu cầu chọn nhóm!"',
                            icon: "warning",
                        }).then(() => {
                            setListTG([])
                            setFlagPT(true)
                            setFlagWS(false)
                            setSTT1(true)
                            // setFlagTG(false)
                        })
                    }
                    else { // check nhân viên chọn bậy
                        Swal.fire({
                            title: "Thông báo!",
                            text: 'Ngày chọn chưa có lịch làm. Yêu cầu chọn "Đợi lịch làm HDV"',
                            icon: "warning",
                        }).then(() => {
                            setListTG([])
                            setFlagPT(true)
                            setFlagWS(false)
                            setSTT1(true)
                            // setFlagTG(false)
                        })
                    }
                }
            }

        } else {
            checkValidBooking()
            // Swal.fire({
            //     title: "Thông báo!",
            //     text: 'Không thêm được đoàn tham quan',
            //     icon: "warning",
            // }).then(() => {
            //     return;
            // })
        }
    }

    //show table
    return (
        <form onSubmit={onSubmit}>
            <div className="modal" >
                <a className="close" onClick={close}>
                    &times;
                    </a>
                <div >
                    <GridContainer>
                        <GridItem xs={12} sm={12} md={12}>
                            <Card profile>
                                <CardHeader color="primary">
                                    <h4 >Thêm mới đoàn tham quan theo sự kiện</h4>
                                </CardHeader>
                            </Card>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6}>
                            <GridContainer>
                                <GridItem xs={12} sm={12} md={12} style={{ marginTop: "2vh" }}>
                                    <InputLabel style={{ float: 'left' }}>Sự kiện</InputLabel>
                                    <Select
                                        required
                                        value={eventId}
                                        onChange={function (e) { setEventId(e.target.value), checkAddNewGTForEvent(e.target.value) }}
                                        // input={<Input />}
                                        fullWidth={true}
                                        variant="outlined"
                                    >
                                        {eventSelect.map((event) => (
                                            <MenuItem key={event.eventId} value={event.eventId} >
                                                {event.eventName + " (" + event.startTime + " - " + event.endTime + ")"}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </GridItem>
                                <GridItem xs={12} sm={12} md={12} style={{ marginTop: "4vh" }}>
                                    <TextField
                                        label="Thời gian bắt đầu"
                                        type="datetime-local"
                                        value={startTime}
                                        fullWidth={true}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        
                                        required
                                        onChange={function (e) { setStartTime(e.target.value), checkAddNewGTForStartTime(e.target.value) }}
                                        variant="outlined"
                                    />
                                </GridItem>
                                <GridItem xs={12} sm={12} md={12} style={{ marginTop: "4vh" }}>
                                    <TextField
                                        label="Thời gian kết thúc"
                                        type="datetime-local"
                                        value={endTime}
                                        fullWidth={true}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        required
                                        onChange={function (e) { setEndTime(e.target.value), checkAddNewGTForEndTime(e.target.value) }}
                                        variant="outlined"
                                        inputProps={{
                                            step: 600,
                                        }}
                                    />
                                </GridItem>
                            </GridContainer>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6}>
                            <GridContainer>
                                <GridItem xs={12} sm={12} md={12} style={{ marginTop: "2vh" }}>
                                    <InputLabel style={{ float: 'left' }}>Ngôn ngữ</InputLabel>
                                    <Select
                                        required
                                        value={language}
                                        onChange={function (e) { setLanguage(e.target.value), checkAddNewGTForLanguage(e.target.value) }}
                                        // input={<Input />}
                                        fullWidth={true}
                                        variant="outlined"

                                    >
                                        {languageSelect.map((language) => (
                                            <MenuItem key={language.languageId} value={language.languageId} >
                                                {language.languageName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </GridItem>
                                <GridItem xs={12} sm={12} md={12} style={{ marginTop: "2vh" }}>
                                    <TextField
                                        label="Số lượng khách"
                                        value={quantity}
                                        fullWidth={true}
                                        required
                                        type="number"
                                        InputProps={{ min: 0, max: 50}}
                                        onInput = {(e) =>{
                                            e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,2)
                                        }}
                                        onChange={function (e) { setQuantity(e.target.value), checkAddNewGTForQuantity(e.target.value) }}
                                        variant="outlined"
                                    />
                                </GridItem>
                                <GridItem xs={12} sm={12} md={12} style={{ marginTop: "2vh" }}>
                                    <Select style={{ width: "65%", float: 'left' }}
                                        required
                                        value={suggestGR}
                                        onChange={function (e) {
                                            setSuggestGR(e.target.value),
                                                checkNullTG(e.target.value)
                                        }}

                                        input={<Input />}
                                        fullWidth={true}
                                        variant="outlined"
                                        disabled={flag || checked}
                                    >
                                        {suggestGroupTour.map((group) => (
                                            <MenuItem key={group.groupTourId} value={group.groupTourId} >
                                                {"Nhóm " + group.groupTourId + " - HDV: " + group.showName}
                                            </MenuItem>
                                        ))}
                                        <MenuItem value={2021}>Tạo nhóm mới</MenuItem>
                                    </Select>
                                    <Button disabled={btnGroup || checked} color="primary" style={{ width: "30%", float: 'right' }}
                                        onClick={() => {
                                            if (checkValidBooking() == true) {
                                                checkAddNewGT()
                                            } else {
                                                checkValidBooking()
                                            }
                                        }}
                                    >Tìm nhóm</Button>

                                </GridItem>
                                <GridItem xs={12} sm={12} md={12} style={{ marginTop: "2vh" }}>
                                    <Select style={{ width: "65%", float: 'left' }}
                                        required
                                        value={suggestTG}
                                        onChange={(e) => setSuggestTG(e.target.value)}
                                        input={<Input />}
                                        fullWidth={true}
                                        variant="outlined"
                                        disabled={flagTG || checked}
                                    >
                                        {listTG.map((tourguide) => (
                                            <MenuItem key={tourguide.username} value={tourguide.username} >
                                                {"HDV: " + tourguide.fullname + "-" + tourguide.username}
                                            </MenuItem>
                                        ))}

                                        {/* {selectTG.map((select) => (
                                            <MenuItem key={select.id} value={select.id} >
                                                {select.name}
                                            </MenuItem>
                                        ))} */}
                                        <MenuItem value={"parttime"} disabled={flagPT}>Tìm hướng dẫn viên</MenuItem>
                                        <MenuItem value={"waitWS"} disabled={flagWS}>Đợi lịch làm HDV</MenuItem>

                                    </Select>
                                    <Button disabled={btnAddTG || checked} color="primary" style={{ width: "30%", float: 'right' }}
                                        onClick={() => {
                                            getTGToAdd()
                                            setFlagTG(false)
                                        }}
                                    >Tìm HDV</Button>
                                </GridItem>
                            </GridContainer>
                        </GridItem>
                    </GridContainer>

                    <CardFooter>
                        {/* <Button color="info" onClick={autoAssign} >Thêm tự động</Button> */}

                        <Button color="primary" type="submit" >Thêm mới </Button>
                        <FormControlLabel
                            control={<Switch checked={checked} onChange={toggleChecked} />}
                            label="Tự động thêm nhóm và HDV"
                        />
                    </CardFooter>
                </div>
            </div >
        </form >
    )
}

export default ModalAddNewVisitorBookingTourEvent;