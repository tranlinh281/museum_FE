import React, { useState, useEffect } from "react";
import "./style.css"
import 'reactjs-popup/dist/index.css';
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import axios from "axios";
import ConfirmDialog from "./ConfirmDialog";
import { Dialog, FormControlLabel, FormHelperText, FormLabel, Input, InputLabel, List, Radio, RadioGroup, Select, Typography } from "@material-ui/core";
import Swal from "sweetalert2";

const ModalCreate = ({ close }) => {

    const [roleSelect, setRoleSelect] = useState([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [role, setRole] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [birthday, setBirthday] = useState('');
    const [fullname, setFullname] = useState('');
    const [gender, setGender] = useState('');
    const [language, setLanguageInfor] = useState([]);
    const [languageSelect, setLanguageSelect] = useState([]);
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' });

    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        "Authorization": "Bearer " + sessionStorage.getItem('jwtToken')
    };

    const account = {
        username: username,
        password: password,
        roleId: role,
        active: true,
        address: address,
        birthday: birthday,
        email: email,
        fullname: fullname,
        phone: phone,
        gender: gender
    }
    const BASE_URL = "http://localhost:8080"

    //T???o role ?????ng
    if (roleSelect.length == 0) {
        axios.get(BASE_URL + "/api/v1/roles/getAll", { headers: headers })
            .then(function (response) {
                const roleSelect = response.data.map(key =>
                    ({
                        value: key.roleId,
                        label: key.roleName,
                    })
                )
                setRoleSelect(roleSelect);
            })
    }
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


    const onSubmit = (e) => {
        e.preventDefault();
        let mesErrValid = '';
        if (account.roleId === "") {
            mesErrValid = 'Kh??ng ???????c b??? tr???ng ch???c v???!'
        } else if (account.gender === "") {
            mesErrValid = 'Kh??ng ???????c b??? tr???ng gi???i t??nh'
        } else if (account.phone === "") {
            mesErrValid = 'Kh??ng ???????c b??? tr???ng s??? ??i???n tho???i'
        } else if (account.phone.length != 10) {
            mesErrValid = 'S??? ??i???n tho???i ph???i 10 s???!'
        } else if (passwordConfirm != password) {
            mesErrValid = "M???t kh???u ph???i gi???ng v???i X??c nh???n m???t kh???u"
        } else if (language.length === 0) {
            mesErrValid = "Kh??ng ???????c b??? tr???ng ng??n ng???"
        }
        else {
            axios.post(BASE_URL + "/api/v1/accounts/create", account, { headers: headers })
                .then(res => {
                    if (res.data.message != null) {
                        Swal.fire({
                            title: "Th???t b???i",
                            text: res.data.message,
                            icon: "error",
                            // timer: 2000,
                            // buttons: false,
                        })
                    } else {
                        axios.post(BASE_URL + '/api/v1/inforlanguages/create/' + account.username + '/' + language, { headers: headers })
                            .then(res => {
                                if (res.data.message == 'th??nh c??ng') {
                                    // alert('Th??m m???i nh??n vi??n th??nh c??ng')
                                    Swal.fire({
                                        title: "Th??nh c??ng",
                                        text: 'Th??m m???i nh??n vi??n th??nh c??ng',
                                        icon: "success",
                                        // timer: 2000,
                                        // buttons: false,
                                    }).then(() => {
                                        close()
                                        // window.location.reload();
                                    })
                                }
                                else {
                                    Swal.fire({
                                        title: "Th???t b???i",
                                        text: 'Th??m m???i ng??n ng??? m???i cho nh??n vi??n th???t b???i',
                                        icon: "error",
                                        // timer: 2000,
                                        // buttons: false,
                                    }).then(() => {
                                        return;
                                    })
                                }
                            })
                            .catch(e => {
                                let err = '';
                                if (e.response.status === 400) {
                                    err = e.response.data.message
                                } else if (e.response.status === 404) {
                                    err = e.response.data.message
                                } else {
                                    err = 'Th??m m???i ng??n ng??? m???i cho nh??n vi??n th???t b???i'
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
                })
                .catch(e => {
                    let err = ''
                    if (e.response.status === 400) {
                        err = e.response.data.message
                    } else if (e.response.status === 404) {
                        err = e.response.data.message
                    } else {
                        err = 'Kh??ng th??m m???i ???????c t??i kho???n!'
                    }
                    Swal.fire({
                        title: "Th???t b???i",
                        text: err,
                        icon: "error",
                        // timer: 2000,
                        // buttons: false,
                    })
                })
        } if (mesErrValid != '') {
            Swal.fire({
                title: "C???nh b??o",
                text: mesErrValid,
                icon: "error",
                // timer: 2000,
                // buttons: false,
            })
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
                                    <h4 >Th??m m???i nh??n vi??n</h4>
                                </CardHeader>
                                <CardBody>
                                    <GridContainer>
                                        <GridItem xs={12} sm={12} md={6} style={{ marginTop: "1vh" }}>
                                            <TextField
                                                label="T??n ????ng nh???p"
                                                value={username}
                                                fullWidth={true}
                                                required
                                                inputProps={{ maxLength: 30 }}
                                                onInput = {(e) =>{
                                                    e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,30)
                                                }}
                                                onChange={(e) => { setUsername(e.target.value) }}
                                                variant="outlined"
                                            />
                                        </GridItem>
                                        <GridItem xs={12} sm={12} md={6} style={{ marginTop: "1vh" }}>
                                            <FormLabel component="legend" style={{ margin: "10px 0px 10px 0px", float: "left" }}>Gi???i t??nh</FormLabel>
                                            <RadioGroup row aria-label="position" style={{ marginTop: "20px", padding: "0px" }} value={gender} onChange={(e) => { setGender(e.target.value) }}>
                                                <FormControlLabel value="Nam" control={<Radio color="primary" />} label="Nam" labelPlacement="start" />
                                                <FormControlLabel value="N???" control={<Radio color="primary" />} label="N???" labelPlacement="start" />
                                            </RadioGroup>
                                        </GridItem>

                                        <GridItem xs={12} sm={12} md={6} style={{ marginTop: "1vh" }}>
                                            <TextField
                                                label="M???t kh???u"
                                                type="password"
                                                value={password}
                                                fullWidth={true}
                                                required
                                                helperText="??t nh???t 1 ch???a th?????ng, ch??? hoa, con s???, k?? t??? ?????t bi???t, kh??ng c?? kho???ng tr???ng, t??? 6 ?????n 20 k?? t???"
                                                inputProps={{ minLength: 6, maxLength: 20 }}
                                                onInput = {(e) =>{
                                                    e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,20)
                                                }}
                                                onChange={(e) => { setPassword(e.target.value) }}
                                                variant="outlined"
                                            />
                                        </GridItem>

                                        <GridItem xs={12} sm={12} md={6} style={{ marginTop: "1vh" }}>
                                            <TextField
                                                select
                                                label="Ch???c v???"
                                                value={role}
                                                required
                                                fullWidth={true}
                                                onChange={(e) => { setRole(e.target.value) }}
                                                variant="outlined"
                                            >
                                                {roleSelect.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </GridItem>

                                        <GridItem xs={12} sm={12} md={6} style={{ marginTop: "1vh" }}>
                                            <TextField
                                                label="X??c nh???n l???i m???t kh???u"
                                                type="password"
                                                value={passwordConfirm}
                                                fullWidth={true}
                                                required
                                                inputProps={{ minLength: 6, maxLength: 20 }}
                                                onInput = {(e) =>{
                                                    e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,20)
                                                }}
                                                onChange={(e) => { setPasswordConfirm(e.target.value) }}
                                                variant="outlined"
                                            />
                                        </GridItem>

                                        <GridItem xs={12} sm={12} md={6} style={{ marginTop: "1vh" }}>
                                            <TextField
                                                label="S??? ??i???n tho???i"
                                                value={phone}
                                                fullWidth={true}
                                                required
                                                type="number"
                                                inputProps={{ minLength: 10, maxLength: 10 }}
                                                onInput = {(e) =>{
                                                    e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,10)
                                                }}
                                                onChange={(e) => { setPhone(e.target.value) }}
                                                variant="outlined"
                                                helperText="S??? ??i???n tho???i 10 ch??? s???!"
                                            />
                                        </GridItem>
                                        <GridItem xs={12} sm={12} md={6} style={{ marginTop: "1vh" }}>
                                            <TextField
                                                label="H??? t??n"
                                                id="fullname"
                                                value={fullname}
                                                fullWidth={true}
                                                required
                                                inputProps={{ maxLength: 50 }}
                                                onInput = {(e) =>{
                                                    e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,50)
                                                }}
                                                onChange={(e) => { setFullname(e.target.value) }}
                                                variant="outlined"
                                            />
                                        </GridItem>
                                        <GridItem xs={12} sm={12} md={6} >
                                            <InputLabel style={{ float: 'left' }}>Ng??n ng???</InputLabel>
                                            <Select
                                                label="Ng??n ng???"
                                                multiple
                                                required
                                                value={language}
                                                onChange={(e) => setLanguageInfor(e.target.value)}
                                                input={<Input id="select-multiple-chip" />}
                                                fullWidth={true}
                                                variant="outlined"
                                            >
                                                {languageSelect.map((language) => (
                                                    <MenuItem key={language.value} value={language.value} >
                                                        {language.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </GridItem>

                                        <GridItem xs={12} sm={12} md={6} style={{ marginTop: "1vh" }}>
                                            <TextField
                                                label="?????a ch??? email"
                                                type="email"
                                                value={email}
                                                fullWidth={true}
                                                required
                                                inputProps={{ maxLength: 50 }}
                                                onInput = {(e) =>{
                                                    e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,50)
                                                }}
                                                onChange={(e) => { setEmail(e.target.value) }}
                                                variant="outlined"
                                            />
                                        </GridItem>

                                        <GridItem xs={12} sm={12} md={6} style={{ marginTop: "1vh" }}>
                                            <TextField
                                                label="?????a ch???"
                                                value={address}
                                                fullWidth={true}
                                                required
                                                inputProps={{ maxLength: 250 }}
                                                onInput = {(e) =>{
                                                    e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,250)
                                                }}
                                                onChange={(e) => { setAddress(e.target.value) }}
                                                variant="outlined"
                                                multiline
                                            />
                                        </GridItem>

                                        <GridItem xs={12} sm={12} md={6} style={{ marginTop: "1vh" }}>
                                            <TextField
                                                label="Ng??y sinh"
                                                type="date"
                                                value={birthday}
                                                fullWidth={true}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                required
                                                onChange={(e) => { setBirthday(e.target.value) }}
                                                variant="outlined"
                                            />
                                        </GridItem>
                                        <GridItem xs={12} sm={12} md={6} style={{ marginTop: "1vh" }}>
                                            <Button color="primary" type="submit" fullWidth={true}>Th??m m???i</Button>
                                        </GridItem>
                                    </GridContainer>
                                </CardBody>
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

export default ModalCreate;