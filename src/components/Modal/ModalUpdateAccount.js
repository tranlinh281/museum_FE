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
import Axios from "axios";
import ConfirmDialog from "./ConfirmDialog";
import Swal from "sweetalert2";

const ModalUpdateAccount = (props) => {

    const { close, dataParentToChild } = props;
    const [username, setUsername] = useState(dataParentToChild.username)
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' });

    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        "Authorization": "Bearer " + sessionStorage.getItem('jwtToken')
    };

    const account = {
        username: username,
        password: password
    }

    const BASE_URL = "http://localhost:8080";
    
    const onSubmit = (e) => {
        e.preventDefault();
        if (passwordConfirm != password) {
            Swal.fire({
                title: "Thông báo!",
                text: "Mật khẩu phải giống với Xác nhận mật khẩu",
                icon: "warning",
            }).then(() => {
                return
            });
        } else {
            Axios.post(BASE_URL + "/api/v1/accounts/update", account, { headers: headers })
                .then(res => {
                    Swal.fire({
                        title: "Thành công!",
                        text: "Cập nhật mật khẩu thành công",
                        icon: "success",
                    }).then(() => {
                        // location.reload();
                        close();
                    });
                })
                .catch(e => {
                    let mes="";
                    if (e.response.status === 400) {
                        mes = e.response.data.message
                    } else if (e.response.status === 404) {
                        mes = e.response.data.message;
                    } else {
                        mes = 'Không cập nhật được mật khẩu'
                    }
                    Swal.fire({
                        title: "Thất bại",
                        text: mes,
                        icon: "error",
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
                                    <h4 >Đổi mật khẩu cho tài khoản</h4>
                                </CardHeader>
                                <CardBody>
                                    <GridContainer>
                                        <GridItem xs={12} sm={12} md={12} style={{ marginTop: "1vh" }}>
                                            <TextField
                                                label="Tên tài khoản"
                                                value={username}
                                                required
                                                onChange={(e) => { setUsername(e.target.value) }}
                                                fullWidth={true}
                                                disabled={true}
                                                variant="outlined"
                                            />
                                        </GridItem>
                                    </GridContainer>
                                    <GridContainer>
                                        <GridItem xs={12} sm={12} md={12} style={{ marginTop: "1vh" }}>
                                            <TextField
                                                label="Mật khẩu mới"
                                                value={password}
                                                type="password"
                                                required
                                                helperText="Ít nhất 1 chữa thường, chữ hoa, con số, kí tự đặt biệt, không có khoảng trắng, từ 6 đến 20 kí tự"
                                                inputProps={{ minLength: 6, maxLength: 20 }}
                                                onChange={(e) => { setPassword(e.target.value) }}
                                                fullWidth={true}
                                                variant="outlined"
                                            />
                                        </GridItem>
                                    </GridContainer>
                                    <GridContainer>
                                        <GridItem xs={12} sm={12} md={12} style={{ marginTop: "1vh" }}>
                                            <TextField
                                                label="Xác nhận lại mật khẩu"
                                                type="password"
                                                value={passwordConfirm}
                                                fullWidth={true}
                                                required
                                                helperText="Ít nhất 1 chữa thường, chữ hoa, con số, kí tự đặt biệt, không có khoảng trắng, từ 6 đến 20 kí tự"
                                                inputProps={{ minLength: 6, maxLength: 20 }}
                                                onChange={(e) => { setPasswordConfirm(e.target.value) }}
                                                variant="outlined"
                                            />
                                        </GridItem>
                                    </GridContainer>
                                </CardBody>
                                <CardFooter>
                                    <Button color="primary" type="submit">Cập nhật</Button>
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

export default ModalUpdateAccount;