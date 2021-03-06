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

    //Th??m m???i booking
    const bookingTour = {
        bookingId: bookingId, //t??? t??ng
        bookingtourStatusId: bookingtourStatusId, //m???c ?????nh l?? ??ang ch???(1) (2-Ch??a di???n ra) (3-??ang di???n ra)(4-Ho??n th??nh)(5-H???y)
        endTime: endTime, //th???i gian k???t th??c tour
        eventId: eventId, //event
        listTopic: [],
        groupTourId: suggestGR, //n???u c?? merge group
        languageId: language, //list ng??n ng???
        quantity: quantity, //s??? l?????ng ng?????i
        startTime: startTime, //th???i gian b???t ?????u ??i
        usernameStaff: sessionStorage.getItem('usernameStaff'), //t??n nh??n vi??n Th??m m???i
        visitorId: dataParentToChild.visitorId//t??n c???a ng?????i ?????i di???n
    }

    //check th??ng tin ????? t??m HDV
    const checkAddGT = {
        endTime: endTime,
        event: eventId,
        language: language,
        listTopic: [],
        quantity: quantity,
        startTime: startTime
    }

    useMemo(() => {
        //Load language, event ?????ng
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

    //Check valid th??ng tin booking
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
                title: "Th??ng b??o!",
                text: "S??? ph??t ph???i ch???n [00, 10, 20, 30, 40, 50]",
                icon: "warning",
            })
                .then(() => {
                    return false;
                })
        }
        else if ((new Date(startTime).getTime() - new Date(timeStartWork).getTime()) < 27000000) {
            Swal.fire({
                title: "Th??ng b??o!",
                text: "Th???i gian b???t ?????u l??m vi???c t??? 7h30 - 18h",
                icon: "warning",
            }).then(() => {
                return false;
            })
        } else if (new Date(endTime).getTime() <= new Date(startTime).getTime()) {
            Swal.fire({
                title: "Th??ng b??o!",
                text: "Th???i gian k???t th??c ph???i l???n h??n th???i gian b???t ?????u v?? t???i ??a 3 gi???",
                icon: "warning",
            }).then(() => {
                return false;
            })
        } else if ((new Date(endTime).getTime() - new Date(startTime).getTime()) > 10800000) {
            Swal.fire({
                title: "Th??ng b??o!",
                text: "??o??n tham quan ch??? ???????c t???i ??a 3 gi???",
                icon: "warning",
            }).then(() => {
                return false;
            })
        } else if ((new Date(endTime).getTime() - new Date(timeEndWork).getTime()) > 0) {
            Swal.fire({
                title: "Th???t b???i",
                text: "Qu?? gi??? l??m vi???c! Gi??? l??m k???t th??c v??o 18h",
                icon: "warning",
            }).then(() => {
                return false;
            })

        } else if (quantity.length == 0) {
            Swal.fire({
                title: "Th??ng b??o!",
                text: 'Y??u c???u ??i???n s??? l?????ng kh??ch!',
                icon: "warning",
            }).then(() => {
                return false;
            })
        } else if (eventId.length == 0) {
            Swal.fire({
                title: "Th??ng b??o!",
                text: 'Y??u c???u ch???n s??? ki???n!',
                icon: "warning",
            }).then(() => {
                return false;
            })
        } else if (language.length == 0) {
            Swal.fire({
                title: "Th??ng b??o!",
                text: 'Y??u c???u ch???n ng??n ng???!',
                icon: "warning",
            }).then(() => {
                return false;
            })
        } else if (startTime.length == 0) {
            Swal.fire({
                title: "Th??ng b??o!",
                text: 'Y??u c???u ch???n th???i gian b???t ?????u!',
                icon: "warning",
            }).then(() => {
                return false;
            })
        } else if (endTime.length == 0) {
            Swal.fire({
                title: "Th??ng b??o!",
                text: 'Y??u c???u ch???n th???i gian k???t th??c!',
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
                            i.showName = 'Ch??a c?? HDV'

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
                // setFlagTG(false) //m??? select HDV -> ch???n
                //sst2 -> th??m username
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

    //Ng??n ng???
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
                            i.showName = 'Ch??a c?? HDV'

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
                // setFlagTG(false) //m??? select HDV -> ch???n
                //sst2 -> th??m username
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
                            i.showName = 'Ch??a c?? HDV'

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
                // setFlagTG(false) //m??? select HDV -> ch???n
                //sst2 -> th??m username
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
                            i.showName = 'Ch??a c?? HDV'

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
                // setFlagTG(false) //m??? select HDV -> ch???n
                //sst2 -> th??m username
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
                            i.showName = 'Ch??a c?? HDV'

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
                // setFlagTG(false) //m??? select HDV -> ch???n
                //sst2 -> th??m username
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

    //T??m nh??m ph?? h???p
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
                        i.showName = 'Ch??a c?? HDV'

                    }
                }
                setSuggestGR('')
                setSuggestGroupTour(data)
                setFlag(false)
            })


    }

    //t??m HDV ph?? h???p
    async function getTGToAdd() {
        if (checkValidBooking() == true) {
            let start = startTime.split("T")
            let end = endTime.split("T")
            let timeEnd = end[0] + " " + end[1]
            let timeStart = start[0] + " " + start[1]
            let check = await checkSW(timeStart)
            if (check) {
                // setFlagTG(false) //m??? select HDV -> ch???n
                //sst2 -> th??m username
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

    //Check nh??m b??? null HDV
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
                            title: "Th??nh c??ng!",
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
                            err = 'Th??m m???i ??o??n tham quan th???t b???i'
                        }
                        Swal.fire({
                            title: "Th???t b???i",
                            text: err,
                            icon: "error",
                            // timer: 2000,
                            // buttons: false,
                        })
                    })
            } else {
                let checkTime = await checkSW(timeStart)
                //ng??y l??m ???? ch???y auto
                if (checkTime) {
                    if (suggestGR.length == 0) { //b???t bu???c ch???n nh??m
                        Swal.fire({
                            title: "Th??ng b??o!",
                            text: 'Y??u c???u ch???n nh??m!',
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
                                    title: "Th??nh c??ng!",
                                    text: 'Th??m m???i ??o??n tham quan th??nh c??ng!',
                                    icon: "success",
                                }).then(() => {
                                    close()
                                })
                            })
                    }
                    else if (suggestGR == 2021 && suggestTG == '') { //b???t bu???c ch???n HDV
                        Swal.fire({
                            title: "Th??ng b??o!",
                            text: 'Y??u c???u ch???n HDV!',
                            icon: "warning",
                        }).then(() => {
                            return;
                        })
                    } else if (suggestTG == 'waitWS') { //check l???i n???u nh??n vi??n s???a b???a
                        Swal.fire({
                            title: "Th??ng b??o!",
                            text: 'Ng??y ch???n ???? c?? l???ch l??m. Y??u c???u ch???n l???i HDV!',
                            icon: "warning",
                        }).then(() => {
                            getTGToAdd()
                            return;
                        })
                    }
                    else if (suggestGR == 2021) { //n???u ch???n th??m nh??m m???i -> 2 || 7
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
                                        title: "Th??nh c??ng!",
                                        text: 'Th??m m???i ??o??n tham quan th??nh c??ng!',
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
                                        err = 'Th??m m???i ??o??n tham quan th???t b???i'
                                    }
                                    Swal.fire({
                                        title: "Th???t b???i",
                                        text: err,
                                        icon: "error",
                                        // timer: 2000,
                                        // buttons: false,
                                    })
                                })
                        }
                    }
                }// end if check time l???ch l??m
                else { //n???u k c?? l???ch l??m-> 1
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
                                        title: "Th??nh c??ng!",
                                        text: 'Th??m m???i ??o??n tham quan th??nh c??ng!',
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
                                        err = 'Th??m m???i ??o??n tham quan th???t b???i'
                                    }
                                    Swal.fire({
                                        title: "Th???t b???i",
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
                                    title: "Th??nh c??ng!",
                                    text: 'Th??m m???i ??o??n tham quan th??nh c??ng!',
                                    icon: "success",
                                }).then(() => {
                                    close()
                                })
                            })
                            .catch(async function (res) {
                                Swal.fire({
                                    title: "Th???t b???i!",
                                    text: 'Th??m m???i ??o??n tham quan th???t b???i!',
                                    icon: "erorr",
                                }).then(() => {
                                    return;
                                })
                            })
                    }
                    else if (suggestGR.length == 0) {
                        Swal.fire({
                            title: "Th??ng b??o!",
                            text: 'Y??u c???u ch???n nh??m!"',
                            icon: "warning",
                        }).then(() => {
                            setListTG([])
                            setFlagPT(true)
                            setFlagWS(false)
                            setSTT1(true)
                            // setFlagTG(false)
                        })
                    }
                    else { // check nh??n vi??n ch???n b???y
                        Swal.fire({
                            title: "Th??ng b??o!",
                            text: 'Ng??y ch???n ch??a c?? l???ch l??m. Y??u c???u ch???n "?????i l???ch l??m HDV"',
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
            //     title: "Th??ng b??o!",
            //     text: 'Kh??ng th??m ???????c ??o??n tham quan',
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
                                    <h4 >Th??m m???i ??o??n tham quan theo s??? ki???n</h4>
                                </CardHeader>
                            </Card>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6}>
                            <GridContainer>
                                <GridItem xs={12} sm={12} md={12} style={{ marginTop: "2vh" }}>
                                    <InputLabel style={{ float: 'left' }}>S??? ki???n</InputLabel>
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
                                        label="Th???i gian b???t ?????u"
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
                                        label="Th???i gian k???t th??c"
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
                                    <InputLabel style={{ float: 'left' }}>Ng??n ng???</InputLabel>
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
                                        label="S??? l?????ng kh??ch"
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
                                                {"Nh??m " + group.groupTourId + " - HDV: " + group.showName}
                                            </MenuItem>
                                        ))}
                                        <MenuItem value={2021}>T???o nh??m m???i</MenuItem>
                                    </Select>
                                    <Button disabled={btnGroup || checked} color="primary" style={{ width: "30%", float: 'right' }}
                                        onClick={() => {
                                            if (checkValidBooking() == true) {
                                                checkAddNewGT()
                                            } else {
                                                checkValidBooking()
                                            }
                                        }}
                                    >T??m nh??m</Button>

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
                                        <MenuItem value={"parttime"} disabled={flagPT}>T??m h?????ng d???n vi??n</MenuItem>
                                        <MenuItem value={"waitWS"} disabled={flagWS}>?????i l???ch l??m HDV</MenuItem>

                                    </Select>
                                    <Button disabled={btnAddTG || checked} color="primary" style={{ width: "30%", float: 'right' }}
                                        onClick={() => {
                                            getTGToAdd()
                                            setFlagTG(false)
                                        }}
                                    >T??m HDV</Button>
                                </GridItem>
                            </GridContainer>
                        </GridItem>
                    </GridContainer>

                    <CardFooter>
                        {/* <Button color="info" onClick={autoAssign} >Th??m t??? ?????ng</Button> */}

                        <Button color="primary" type="submit" >Th??m m???i </Button>
                        <FormControlLabel
                            control={<Switch checked={checked} onChange={toggleChecked} />}
                            label="T??? ?????ng th??m nh??m v?? HDV"
                        />
                    </CardFooter>
                </div>
            </div >
        </form >
    )
}

export default ModalAddNewVisitorBookingTourEvent;