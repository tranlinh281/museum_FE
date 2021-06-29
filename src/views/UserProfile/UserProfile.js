import React, { useEffect, useState, useStyles } from "react";
import "../../components/Modal/style.css"
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
import { FormControlLabel, FormLabel, Radio, RadioGroup,  } from "@material-ui/core";
import Swal from "sweetalert2";
import { Edit } from "@material-ui/icons";
import Popup from "reactjs-popup";
import ModalUpdateAccount from "components/Modal/ModalUpdateAccount";


const UserProfile = () => {

    const BASE_URL = "http://localhost:8080";
    
    const [infor, setInfor] = useState(JSON.parse(sessionStorage.getItem('infor')))
    const [username, setUsername] = useState(infor.username);
    const [email, setEmail] = useState(infor.email);
    const [address, setAddress] = useState(infor.address);
    const [phone, setPhone] = useState(infor.phone);

    const [birthday, setBirthday] = useState(infor.birthday);
    const [fullname, setFullname] = useState(infor.fullname);
    const [gender, setGender] = useState(infor.gender);
    const [flag, setFlag] = useState(false)

    const inforUpdate = {
        username: username,
        address: address,
        birthday: birthday,
        email: email,
        fullname: fullname,
        phone: phone,
        gender: gender
    }

    const onSubmit = (e) => {
        let errValid = '';
        e.preventDefault();
        console.log(inforUpdate)
        if (phone === "") {
            errValid = 'Không được bỏ trống số điện thoại'
            Swal.fire({
                title: "Thất bại",
                text: errValid,
                icon: "error",
            })
        } else if (phone.length != 10) {
            errValid = 'Số điện thoại phải 10 số!'
            Swal.fire({
                title: "Thất bại",
                text: errValid,
                icon: "error",
            })
        } if (flag) {
            axios.post(BASE_URL + "/api/v1/accounts/updateInfo", inforUpdate)
                .then(res2 => {
                    sessionStorage.setItem('infor', JSON.stringify(inforUpdate))
                    Swal.fire({
                        title: "Thành công",
                        text: 'Cập nhật thành công thông tin',
                        icon: "success",
                    }).then(() => {
                        location.reload();
                    })
                })
        }
    }

    return (
        <form autoComplete="off" onSubmit={onSubmit}>
            <div className="modal" >
                <div >
                    <GridContainer>
                        <GridItem xs={12} sm={12} md={12}>
                            <Card profile>
                                <CardHeader color="primary">
                                    <h4 >Thông tin {infor.fullname}</h4>
                                </CardHeader>
                                <CardBody>
                                    <GridContainer>
                                        <GridItem xs={12} sm={12} md={6} style={{ marginTop: "2vh" }}>
                                            <TextField
                                                label="Tên tài khoản"
                                                value={username}
                                                required
                                                fullWidth={true}
                                                disabled={true}
                                                variant="outlined"
                                            />
                                        </GridItem>
                                        <GridItem xs={12} sm={12} md={6} style={{ marginTop: "2vh" }}>
                                            <FormLabel component="legend" style={{ margin: "10px 0px 10px 0px", float: "left" }}>Giới tính</FormLabel>
                                            <RadioGroup row aria-label="position" style={{ marginTop: "10px" }} value={gender} onChange={(e) => { setGender(e.target.value) }}>
                                                <FormControlLabel value="Nam" control={<Radio color="primary" />} label="Nam" labelPlacement="start" />
                                                <FormControlLabel value="Nữ" control={<Radio color="primary" />} label="Nữ" labelPlacement="start" />
                                            </RadioGroup>
                                        </GridItem>

                                        <GridItem xs={12} sm={12} md={6} style={{ marginTop: "2vh" }}>
                                            <TextField
                                                label="Họ tên"
                                                required
                                                value={fullname}
                                                onChange={(e) => { setFullname(e.target.value) }}
                                                inputProps={{ maxLength: 50 }}
                                                fullWidth={true}
                                                variant="outlined"
                                            />
                                        </GridItem>

                                        <GridItem xs={12} sm={12} md={6} style={{ marginTop: "2vh" }}>
                                            <TextField
                                                label="Số điện thoại"
                                                value={phone}
                                                fullWidth={true}
                                                required
                                                onChange={(e) => { setPhone(e.target.value) }}

                                                type="number"
                                                inputProps={{ maxLength: 10, minLength: 10 }}
                                                variant="outlined"
                                            />
                                        </GridItem>

                                        <GridItem xs={12} sm={12} md={6} style={{ marginTop: "2vh" }}>
                                            <TextField
                                                label="Email"
                                                value={email}
                                                type="email"
                                                onChange={(e) => { setEmail(e.target.value) }}

                                                required
                                                inputProps={{ maxLength: 50 }}
                                                fullWidth={true}
                                                variant="outlined"
                                            />
                                        </GridItem>

                                        <GridItem xs={6} sm={12} md={6} style={{ marginTop: "2vh" }}>
                                            <TextField
                                                label="Địa chỉ"
                                                value={address}
                                                required
                                                inputProps={{ maxLength: 250 }}
                                                fullWidth={true}
                                                variant="outlined"
                                                onChange={(e) => { setAddress(e.target.value) }}

                                            />
                                        </GridItem>

                                        <GridItem xs={6} sm={12} md={6} style={{ marginTop: "2vh" }}>
                                            <TextField
                                                label="Ngày sinh"
                                                value={birthday}
                                                type="date"
                                                InputLabelProps={{ shrink: true, required: true }}
                                                required
                                                fullWidth={true}
                                                variant="outlined"
                                                onChange={(e) => { setBirthday(e.target.value) }}
                                            />
                                        </GridItem>


                                    </GridContainer>
                                </CardBody>
                                <CardFooter>
                                    <Button color="primary" type="submit" style={{ float: "right" }}
                                        onClick={() => {
                                            setFlag(true)
                                        }}>Lưu</Button>
                                    <Popup modal closeOnDocumentClick={false} trigger={<Button size="nomal" type="button" color="info"><Edit></Edit>Đổi mật khẩu</Button>}>
                                        {close =>
                                            <ModalUpdateAccount
                                                close={close}
                                                dataParentToChild={JSON.parse(localStorage.getItem('infor'))}
                                            />}
                                    </Popup>
                                </CardFooter>
                            </Card>
                        </GridItem>
                    </GridContainer>
                </div>
            </div>
        </form>
    )
}

export default UserProfile;