import React, { useState, useStyles } from "react";
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
import { createBrowserHistory } from 'history';
import { FormControlLabel, FormLabel, Input, makeStyles, MenuItem, Radio, RadioGroup, Select, Chip, InputLabel } from "@material-ui/core";
import Swal from "sweetalert2";


const ModalUpdate = (props) => {
    const { close, dataParentToChild } = props;
    const [languageSelect, setLanguageSelect] = useState([])
    const [username, setUsername] = useState(dataParentToChild.username)
    const [email, setEmail] = useState(dataParentToChild.email);
    const [address, setAddress] = useState(dataParentToChild.address);
    const [phone, setPhone] = useState(dataParentToChild.phone);
    // dd-mm-yyyy
    var dateParts = dataParentToChild.birthday.split("-");
    var dateString = dateParts[2] + "-" + dateParts[1] + "-" + dateParts[0];
    // console.log(dateString)
    const [birthday, setBirthday] = useState(dateString);
    const [fullname, setFullname] = useState(dataParentToChild.fullname);
    const [id, setId] = useState(dataParentToChild.id);
    const [gender, setGender] = useState(dataParentToChild.gender);
    const [language, setLanguageInfor] = useState(dataParentToChild.language ? dataParentToChild.language.split(',') : [])
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' });
    const [roleName] = useState(dataParentToChild.roleName)

    var [check, setCheck] = useState(false);
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        "Authorization": "Bearer " + sessionStorage.getItem('jwtToken')
    };
    const BASE_URL = "http://localhost:8080";

    if (languageSelect.length == 0) {
        axios.get(BASE_URL + "/api/v1/languages/getAll", { headers: headers })
            .then(function (response) {
                const languageSelect = response.data.map(key =>
                    ({
                        value: key.languageId,
                        label: key.languageName,
                    })
                )
                setLanguageSelect(languageSelect);
            })
    }

    const infor = {
        username: username,
        address: address,
        birthday: birthday,
        email: email,
        fullname: fullname,
        phone: phone,
        gender: gender
    }

    //disable if admin and staff
    function checkAdminAndStaff(roleName) {
        if (roleName == 'Qu???n l??') {
            return true;
        }
        return false
    }

    const hist = createBrowserHistory();

    const onSubmit = (e) => {
        e.preventDefault();
        if (infor.phone === "") {
            Swal.fire({
                title: "Th???t b???i",
                text: 'Kh??ng ???????c b??? tr???ng s??? ??i???n tho???i',
                icon: "error",
                // timer: 2000,
                // buttons: false,
            }).then(() => {
                return;
            })
        } else if (infor.phone.length != 10) {
            Swal.fire({
                title: "Th???t b???i",
                text: 'S??? ??i???n tho???i ph???i 10 s???!',
                icon: "error",
                // timer: 2000,
                // buttons: false,
            }).then(() => {
                return;
            })
        } else if ((dataParentToChild.roleName === 'H?????ng d???n vi??n' && language.length == 0) || (dataParentToChild.roleName === 'C???ng t??c vi??n' && language.length == 0)) {
            Swal.fire({
                title: "Th???t b???i",
                text: "Ph???i ch???n ??t nh???t m???t ng??n ng???",
                icon: "error",
                // timer: 2000,
                // buttons: false,
            }).then(() => {
                return;
            })
        } else {
            var listId = [];
            var listLang = "";
            if (check) {
                listLang = language;
            }
            else {
                listLang = dataParentToChild.language.split(',');
            }
            for (let index = 0; index < listLang.length; index++) {
                let lang = listLang[index];
                for (let index1 = 0; index1 < languageSelect.length; index1++) {
                    if (lang === languageSelect[index1].label) {
                        listId.push(languageSelect[index1].value);
                    }
                }
            }
            axios.post(BASE_URL + "/api/v1/accounts/updateInfo", infor, { headers: headers })
                .then(res2 => {
                    if (dataParentToChild.roleName === 'H?????ng d???n vi??n' || dataParentToChild.roleName === 'C???ng t??c vi??n' || dataParentToChild.roleName === 'Nh??n vi??n') {
                        axios.post('http://localhost:8080/api/v1/inforlanguages/create/' + infor.username + '/' + listId, { headers: headers })
                            .then(res => {
                                console.log(res.data)

                                if (res.data.message == 'th??nh c??ng') {
                                    Swal.fire({
                                        title: "Th??nh c??ng",
                                        text: 'C???p nh???t th??nh c??ng th??ng tin nh??n vi??n',
                                        icon: "success",
                                        // timer: 2000,
                                        // buttons: false,
                                    }).then(() => {
                                        close()
                                        // hist.push("/admin/infor")
                                    })
                                } else {
                                    Swal.fire({
                                        title: "Th???t b???i",
                                        text: 'Kh??ng c???p nh???t ???????c ng??n ng??? cho nh??n vi??n',
                                        icon: "error",
                                        // timer: 2000,
                                        // buttons: false,
                                    }).then(() => {
                                        return;
                                    })
                                }
                            })
                            .catch(e => {
                                let errMess = '';
                                if (e.response.status === 400) {
                                    errMess = e.response.data.message
                                } else if (e.response.status === 404) {
                                    errMess = e.response.data.message
                                } else {
                                    errMess = 'Kh??ng c???p nh???t ???????c ng??n ng??? cho nh??n vi??n'
                                }
                                Swal.fire({
                                    title: "Th???t b???i",
                                    text: errMess,
                                    icon: "error",
                                    // timer: 2000,
                                    // buttons: false,
                                }).then(() => {
                                    return;
                                })
                            })
                    } else {
                        Swal.fire({
                            title: "Th??nh c??ng",
                            text: 'C???p nh???t th??nh c??ng th??ng tin nh??n vi??n',
                            icon: "success",
                            // timer: 2000,
                            // buttons: false,
                        }).then(() => {
                            close()
                            // window.location.reload();
                        })
                    }

                })
                .catch(e => {
                    let errMess = ''
                    if (e.response.status === 400) {
                        errMess = e.response.data.message
                    } else if (e.response.status === 404) {
                        errMess = e.response.data.message
                    } else {
                        errMess = 'Kh??ng c???p nh???t ???????c th??ng tin nh??n vi??n!'
                    } Swal.fire({
                        title: "Th???t b???i",
                        text: errMess,
                        icon: "error",
                        // timer: 2000,
                        // buttons: false,
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
                                    <h4 >Chi ti???t nh??n vi??n</h4>
                                </CardHeader>
                                <CardBody>
                                    <GridContainer>
                                        <GridItem xs={12} sm={12} md={6} style={{ marginTop: "2vh" }}>
                                            <TextField
                                                label="T??n t??i kho???n"
                                                value={username}
                                                required
                                                onChange={(e) => { setUsername(e.target.value) }}
                                                fullWidth={true}
                                                disabled={true}
                                                variant="outlined"
                                            />
                                        </GridItem>
                                        <GridItem xs={12} sm={12} md={6} style={{ marginTop: "2vh" }}>
                                            <FormLabel component="legend" style={{ margin: "10px 0px 10px 0px", float: "left" }}>Gi???i t??nh</FormLabel>
                                            <RadioGroup row aria-label="position" style={{ marginTop: "10px" }} value={gender} onChange={(e) => { setGender(e.target.value) }}>
                                                <FormControlLabel value="Nam" control={<Radio color="primary" />} label="Nam" labelPlacement="start" />
                                                <FormControlLabel value="N???" control={<Radio color="primary" />} label="N???" labelPlacement="start" />
                                            </RadioGroup>
                                        </GridItem>

                                        <GridItem xs={12} sm={12} md={6} style={{ marginTop: "2vh" }}>
                                            <TextField
                                                label="H??? t??n"
                                                required
                                                value={fullname}
                                                inputProps={{ maxLength: 50 }}
                                                onChange={(e) => { setFullname(e.target.value) }}
                                                fullWidth={true}
                                                variant="outlined"
                                            />
                                        </GridItem>
                                        <GridItem xs={12} sm={12} md={6} style={{ marginTop: "2vh" }}>
                                            <TextField
                                                label="S??? ??i???n tho???i"
                                                value={phone}
                                                fullWidth={true}
                                                required
                                                type="number"
                                                inputProps={{ maxLength: 10, minLength: 10 }}
                                                onChange={(e) => { setPhone(e.target.value) }}
                                                variant="outlined"
                                            />
                                        </GridItem>

                                        <GridItem xs={12} sm={12} md={6} style={{ marginTop: "2vh" }}>
                                            <TextField
                                                label="Email"
                                                value={email}
                                                type="email"
                                                required
                                                inputProps={{ maxLength: 50 }}
                                                onChange={(e) => { setEmail(e.target.value) }}
                                                fullWidth={true}
                                                variant="outlined"
                                            />
                                        </GridItem>

                                        <GridItem xs={12} sm={12} md={6} variant="outlined" style={{ marginTop: "2vh" }}>
                                            <InputLabel style={{ float: 'left' }}>Ng??n ng???</InputLabel>
                                            <Select
                                                label="Ng??n ng???"
                                                multiple
                                                value={language}
                                                onChange={(e) => {
                                                    setLanguageInfor(e.target.value);
                                                    setCheck(true);
                                                }}
                                                input={<Input id="select-multiple-chip" />}
                                                fullWidth={true}
                                                variant="outlined"
                                                disabled={checkAdminAndStaff(roleName)}
                                            >
                                                {languageSelect.map((language) => (
                                                    <MenuItem key={language.label} value={language.label} >
                                                        {language.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </GridItem>

                                        <GridItem xs={6} sm={12} md={6} style={{ marginTop: "2vh" }}>
                                            <TextField
                                                label="?????a ch???"
                                                value={address}
                                                required
                                                inputProps={{ maxLength: 250 }}
                                                onChange={(e) => { setAddress(e.target.value) }}
                                                fullWidth={true}
                                                variant="outlined"
                                            />
                                        </GridItem>

                                        <GridItem xs={6} sm={12} md={6} style={{ marginTop: "2vh" }}>
                                            <TextField
                                                label="Ng??y sinh"
                                                value={birthday}
                                                type="date"
                                                InputLabelProps={{ shrink: true, required: true }}
                                                required
                                                onChange={(e) => { setBirthday(e.target.value) }}
                                                fullWidth={true}
                                                variant="outlined"
                                            />
                                        </GridItem>


                                    </GridContainer>
                                </CardBody>
                                <CardFooter>
                                    <Button color="primary" type="submit">C???p nh???t</Button>
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
export default ModalUpdate;