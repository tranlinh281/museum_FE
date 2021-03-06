import React, { useEffect, useState } from "react";
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
import { Input, InputLabel, MenuItem, Select } from "@material-ui/core";
import Axios from "axios";
import Swal from "sweetalert2";

const ModalAddTourGuide = (props) => {


    const { close, dataParentToChild } = props
    const showname = dataParentToChild.tgName + " - " + dataParentToChild.tgUsername
    const [groupTourId, setGroupTourId] = useState(dataParentToChild.id)
    console.log(dataParentToChild.btGroups)
    const [bookingTourId, setBookingTourId] = useState(dataParentToChild.btGroups[0].bookingTourIds);
    const [listAcc, setListAcc] = useState([])
    const [username, setUserName] = useState(dataParentToChild.tgName)
    const [flag, setFlag] = useState(true)
    const [isAssign, setIsAssign] = useState(dataParentToChild.assigned)
    const startTime = dataParentToChild.startTime
    const endTime = dataParentToChild.endTime
    var startHour = startTime.split(" ")[1]
    var endHour = endTime.split(" ")[1]
    var [checkButton, setCheckButton] = useState(false)

    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        "Authorization": "Bearer " + sessionStorage.getItem('jwtToken')
    };

    // const assignTG = {
    //     username: username,
    //     bookingTourId: dataParentToChild.bookingTourIds[0]
    // }

    useEffect(() => {
        if (flag) {
            Axios.get("http://localhost:8080/api/v1/accounts/getTourGuideForAssign/" + bookingTourId)
                .then(async function (res) {
                    const data = res.data.map(key => ({
                        username: key.username,
                        fullname: key.fullname,
                        phone: key.phone,
                        email: key.email,
                        birthday: key.birthday,
                        address: key.address,
                        gender: key.gender,
                        language: key.language,
                        roleName: key.roleName,
                        inDay: key.inDay
                    }))
                    for (var i of data) {
                        if(i.inDay != "") {
                            i.inDay = " (" + i.inDay + ")"
                        }
                    }
                    await setListAcc(data)
                    setFlag(false)
                    if (data.length == 0) {
                        setIsAssign(true)
                        Swal.fire({
                            title: "Th??ng b??o",
                            text: 'Kh??ng c?? HDV ph?? h???p. Vui l??ng li??n h??? C???ng t??c vi??n!',
                            icon: "warning",
                        }).then(() => {
                            close()
                        })
                    }
                })
                .catch(e => {
                    setIsAssign(true)

                    Swal.fire({
                        title: "Th??ng b??o",
                        text: 'Kh??ng c?? HDV ph?? h???p. ',
                        icon: "warning",
                    }).then(() => {
                        close()
                        return;
                    })
                })


        }


    }
    )

    const BASE_URL = "http://localhost:8080";

    const onSubmit = (e) => {
        e.preventDefault();
        if (isAssign) {
            Swal.fire({
                title: "Th??ng b??o",
                text: 'Nh??m ???? c?? HDV. Ch??? xem th??ng tin!',
                icon: "warning",

            }).then(() => {
                return;
            })
        } else if (username == "Kh??ng c?? HDV ph?? h???p") {
            Swal.fire({
                title: "Th??ng b??o!",
                text: 'Kh??ng c?? HDV ph?? h???p. Vui l??ng li??n h??? v???i C???ng t??c vi??n!',
                icon: "warning",
            }).then(() => {
                return;
            })
        } else if (username == 0) {
            Swal.fire({
                title: "Th??ng b??o!",
                text: 'Vui l??ng ch???n HDV',
                icon: "warning",
            }).then(() => {
                return;
            })
        }
        else {
            axios.post(BASE_URL + "/api-v1/assignTourGuideForGroupTour/" + username + "/" + bookingTourId, { headers: headers })
                .then(res => {
                    Swal.fire({
                        title: "Th??nh c??ng!",
                        text: 'Th??m HDV th??nh c??ng!',
                        icon: "success",
                    }).then(() => {
                        close()
                    })
                })
                .catch(e => {
                    let errMes = '';
                    if (e.response.status === 400) {
                        errMes = e.response.data.message
                    } else if (e.response.status === 404) {
                        errMes = e.response.data.message
                    } else {
                        errMes = 'Th??m h?????ng d???n vi??n th???t b???i'
                    }
                    Swal.fire({
                        title: "Th???t b???i",
                        text: errMes,
                        icon: "error",
                    }).then(() => {
                        return;
                    })
                })

        }

    }

    return (
        <form onSubmit={onSubmit} autoComplete="off" style={{ justifyContent: "center" }} >
            <div className="modal" >
                <a className="close" onClick={close}>
                    &times;
                    </a>
                <div >
                    <GridContainer>
                        <GridItem xs={12} sm={12} md={12}>
                            <Card profile>
                                <CardHeader color="primary">
                                    <h4 >Th??m HDV cho nh??m</h4>
                                </CardHeader>
                                <CardBody>
                                    <GridContainer style={{ justifyContent: "center" }}>
                                        <GridItem xs={12} sm={12} md={6} style={{ marginTop: "2vh" }}>
                                            <TextField
                                                label="M?? nh??m"
                                                value={"Nh??m " + groupTourId}
                                                required
                                                onChange={(e) => { setGroupTourId(e.target.value) }}
                                                fullWidth={true}
                                                disabled={true}
                                                variant="outlined"
                                            />
                                        </GridItem>
                                        <GridItem xs={12} sm={12} md={6} style={{ marginTop: "2vh" }}>
                                            <TextField
                                                label="Gi??? b???t ?????u"
                                                value={startHour}
                                                required
                                                fullWidth={true}
                                                disabled={true}
                                                variant="outlined"
                                            />
                                        </GridItem>
                                        <GridItem xs={12} sm={12} md={6} style={{ marginTop: "2vh" }}>
                                            <InputLabel style={{ float: 'left' }}>H?????ng d???n vi??n</InputLabel>
                                            <Select
                                                required
                                                value={username}
                                                onChange={(e) => setUserName(e.target.value)}
                                                input={<Input />}
                                                fullWidth={true}
                                                variant="outlined"
                                                disabled={isAssign}
                                            >
                                                {listAcc.map((account) => (
                                                    <MenuItem key={account.username} value={account.username} >
                                                        {account.fullname + " - " + account.username + account.inDay }
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </GridItem>
                                        <GridItem xs={12} sm={12} md={6} style={{ marginTop: "1vh" }}>
                                            <TextField
                                                label="Gi??? k???t th??c"
                                                value={endHour}
                                                required
                                                fullWidth={true}
                                                disabled={true}
                                                variant="outlined"
                                            />
                                        </GridItem>
                                    </GridContainer>
                                </CardBody>
                                <CardFooter>
                                    <Button color="primary" type="submit" disabled={isAssign}>Th??m HDV</Button>
                                </CardFooter>
                            </Card>
                        </GridItem>
                    </GridContainer>
                </div>
            </div>
        </form>
    )
}

export default ModalAddTourGuide;