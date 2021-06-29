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
import Swal from "sweetalert2";

const ModalUpdateVisitor = (props) => {

    const { close, dataParentToChild } = props;
    const [name, setName] = useState(dataParentToChild.name)
    const [phone, setPhone] = useState(dataParentToChild.phone);
    const visitorId = dataParentToChild.visitorId;
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' });

    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        "Authorization": "Bearer " + sessionStorage.getItem('jwtToken')
    };

    const updateVisitor = {
        name: name,
        phone: phone,
        visitorId: dataParentToChild.visitorId
    }

    const BASE_URL = "http://localhost:8080";

    const onSubmit = (e) => {
        
        e.preventDefault();
        if (phone.length != 10) {
            Swal.fire({
                title: "Thất bại",
                text: 'Số điện thoại phải 10 số!',
                icon: "warning",
            }).then(() => {
                return;
            })
        } else {
            axios.post(BASE_URL + "/api/v1/visitors/update", updateVisitor, { headers: headers })
                .then(res => {
                    Swal.fire({
                        title: "Thành công",
                        text: 'Cập nhật thông tin khách tham quan thành công!',
                        icon: "success",
                    }).then(() => {
                        close()
                        // location.reload();
                    })
                })
                .catch(e => {
                    let errMes = '';
                    if (e.response.status === 400) {
                        errMes = e.response.data.message
                    } else if (e.response.status === 404) {
                        errMes = e.response.data.message
                    } else {
                        errMes = 'Không cập nhật được thông tin'
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
                                    <h4 >Chi tiết khách tham quan</h4>
                                </CardHeader>
                                <CardBody>
                                    <GridContainer>
                                        <GridItem xs={12} sm={12} md={12} style={{ marginTop: "1vh" }}>
                                            <TextField
                                                label="Họ tên khách"
                                                value={name}
                                                required
                                                onChange={(e) => { setName(e.target.value) }}
                                                fullWidth={true}
                                                variant="outlined"
                                            />
                                        </GridItem>
                                        <GridItem xs={12} sm={12} md={12} style={{ marginTop: "1vh" }}>
                                            <TextField
                                                label="Số điện thoại"
                                                value={phone}
                                                required
                                                type="number"
                                                onInput = {(e) =>{
                                                    e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,10)
                                                }}
                                                onChange={(e) => { setPhone(e.target.value) }}
                                                fullWidth={true}
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

export default ModalUpdateVisitor;