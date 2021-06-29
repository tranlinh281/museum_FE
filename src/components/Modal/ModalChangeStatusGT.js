import React, { useEffect, useMemo, useState } from "react";
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
import Swal from "sweetalert2";

const ModalChangeStatusGT = (props) => {


    const { close, dataParentToChild, labelValue, labelName, nameChange, id, listSTT } = props
    const [Id, setId] = useState(id)
    const startTime = dataParentToChild.startTime
    const endTime = dataParentToChild.endTime
    var startHour = startTime.split(" ")[1]
    var endHour = endTime.split(" ")[1]
    var lableShow = labelValue + Id

    // const [listSTT, setListSTT] = useState([])
    const [status, setStatus] = useState('')

    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        "Authorization": "Bearer " + sessionStorage.getItem('jwtToken')
    };
    const BASE_URL = "http://localhost:8080";

    // const listSTT = [
    //     { id: 5, name: 'Hủy' },
    //     { id: 6, name: 'Audio guide' },
    // ]

    // const sttForGroup = { id: 5, name: 'Huỷ' }

    function changeSttGT() {
        let url = ''
        if (nameChange == 'nhóm') {
            url = "/api-v1/updateGroupTourStatus/" + Id + "/" + status
        } else {
            url = "/api/v1/bookingtours/updatestatus/" + status + "/" + Id
        }
        axios.post(BASE_URL + url)
            .then(res => {
                console.log(res)
                Swal.fire({
                    title: "Thành công!",
                    text: "Thay đổi trạng thái '" + lableShow + "' thành công",
                    icon: "success",
                }).then(() => {
                    close();
                })
            })
            .catch(e => {
                console.log("e" + e)
            })
    }

    useMemo(() => {

    })



    const onSubmit = (e) => {
        e.preventDefault();
        // if (flag) {
        changeSttGT()
        // }


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
                                    <h4 >Cập nhật trạng thái cho {nameChange}</h4>
                                </CardHeader>
                                <CardBody>
                                    <GridContainer style={{ justifyContent: "center" }}>
                                        <GridItem xs={12} sm={12} md={6} style={{ marginTop: "2vh" }}>
                                            <TextField
                                                label={labelName}
                                                value={lableShow}
                                                required
                                                onChange={(e) => { setId(e.target.value) }}
                                                fullWidth={true}
                                                disabled={true}
                                                variant="outlined"
                                            />
                                        </GridItem>
                                        <GridItem xs={12} sm={12} md={6} style={{ marginTop: "2vh" }}>
                                            <TextField
                                                label="Giờ bắt đầu"
                                                value={startHour}
                                                required
                                                fullWidth={true}
                                                disabled={true}
                                                variant="outlined"
                                            />
                                        </GridItem>
                                        <GridItem xs={12} sm={12} md={6} style={{ marginTop: "2vh" }}>
                                            <InputLabel style={{ float: 'left' }}>Trạng thái</InputLabel>
                                            <Select
                                                required
                                                value={status}
                                                onChange={(e) => setStatus(e.target.value)}
                                                input={<Input />}
                                                fullWidth={true}
                                                variant="outlined"
                                            >
                                                {listSTT.map((stt) => (
                                                    <MenuItem key={stt.id} value={stt.id} >
                                                        {stt.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </GridItem>
                                        <GridItem xs={12} sm={12} md={6} style={{ marginTop: "1vh" }}>
                                            <TextField
                                                label="Giờ kết thúc"
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
                                    <Button color="primary" type="submit">Lưu</Button>
                                </CardFooter>
                            </Card>
                        </GridItem>
                    </GridContainer>
                </div>
            </div>
        </form>
    )
}

export default ModalChangeStatusGT;