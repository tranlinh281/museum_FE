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

    //Tạo role động
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
            mesErrValid = 'Không được bỏ trống chức vụ!'
        } else if (account.gender === "") {
            mesErrValid = 'Không được bỏ trống giới tính'
        } else if (account.phone === "") {
            mesErrValid = 'Không được bỏ trống số điện thoại'
        } else if (account.phone.length != 10) {
            mesErrValid = 'Số điện thoại phải 10 số!'
        } else if (passwordConfirm != password) {
            mesErrValid = "Mật khẩu phải giống với Xác nhận mật khẩu"
        } else if (language.length === 0) {
            mesErrValid = "Không được bỏ trống ngôn ngữ"
        }
        else {
            axios.post(BASE_URL + "/api/v1/accounts/create", account, { headers: headers })
                .then(res => {
                    if (res.data.message != null) {
                        Swal.fire({
                            title: "Thất bại",
                            text: res.data.message,
                            icon: "error",
                            // timer: 2000,
                            // buttons: false,
                        })
                    } else {
                        axios.post(BASE_URL + '/api/v1/inforlanguages/create/' + account.username + '/' + language, { headers: headers })
                            .then(res => {
                                if (res.data.message == 'thành công') {
                                    // alert('Thêm mới nhân viên thành công')
                                    Swal.fire({
                                        title: "Thành công",
                                        text: 'Thêm mới nhân viên thành công',
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
                                        title: "Thất bại",
                                        text: 'Thêm mới ngôn ngữ mới cho nhân viên thất bại',
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
                                    err = 'Thêm mới ngôn ngữ mới cho nhân viên thất bại'
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
                })
                .catch(e => {
                    let err = ''
                    if (e.response.status === 400) {
                        err = e.response.data.message
                    } else if (e.response.status === 404) {
                        err = e.response.data.message
                    } else {
                        err = 'Không thêm mới được tài khoản!'
                    }
                    Swal.fire({
                        title: "Thất bại",
                        text: err,
                        icon: "error",
                        // timer: 2000,
                        // buttons: false,
                    })
                })
        } if (mesErrValid != '') {
            Swal.fire({
                title: "Cảnh báo",
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
                                    <h4 >Thêm mới nhân viên</h4>
                                </CardHeader>
                                <CardBody>
                                    <GridContainer>
                                        <GridItem xs={12} sm={12} md={6} style={{ marginTop: "1vh" }}>
                                            <TextField
                                                label="Tên đăng nhập"
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
                                            <FormLabel component="legend" style={{ margin: "10px 0px 10px 0px", float: "left" }}>Giới tính</FormLabel>
                                            <RadioGroup row aria-label="position" style={{ marginTop: "20px", padding: "0px" }} value={gender} onChange={(e) => { setGender(e.target.value) }}>
                                                <FormControlLabel value="Nam" control={<Radio color="primary" />} label="Nam" labelPlacement="start" />
                                                <FormControlLabel value="Nữ" control={<Radio color="primary" />} label="Nữ" labelPlacement="start" />
                                            </RadioGroup>
                                        </GridItem>

                                        <GridItem xs={12} sm={12} md={6} style={{ marginTop: "1vh" }}>
                                            <TextField
                                                label="Mật khẩu"
                                                type="password"
                                                value={password}
                                                fullWidth={true}
                                                required
                                                helperText="Ít nhất 1 chữa thường, chữ hoa, con số, kí tự đặt biệt, không có khoảng trắng, từ 6 đến 20 kí tự"
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
                                                label="Chức vụ"
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
                                                label="Xác nhận lại mật khẩu"
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
                                                label="Số điện thoại"
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
                                                helperText="Số điện thoại 10 chữ số!"
                                            />
                                        </GridItem>
                                        <GridItem xs={12} sm={12} md={6} style={{ marginTop: "1vh" }}>
                                            <TextField
                                                label="Họ tên"
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
                                            <InputLabel style={{ float: 'left' }}>Ngôn ngữ</InputLabel>
                                            <Select
                                                label="Ngôn ngữ"
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
                                                label="Địa chỉ email"
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
                                                label="Địa chỉ"
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
                                                label="Ngày sinh"
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
                                            <Button color="primary" type="submit" fullWidth={true}>Thêm mới</Button>
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