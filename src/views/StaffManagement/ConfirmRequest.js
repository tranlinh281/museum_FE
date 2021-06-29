import CardBody from "components/Card/CardBody";
import React, { useEffect, useMemo } from "react";
import Button from 'components/CustomButtons/Button'
import { makeStyles } from '@material-ui/core/styles';
import "../../assets/css/workingSchedule.css";
import styled from 'styled-components'
import { createBrowserHistory } from "history";
import Swal from "sweetalert2";
import { Card, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import CardHeader from "components/Card/CardHeader";
import { getAllRequest, changeSttAbsent, swapTour, changeTour, changeWorkingSchedule, changeDayWS } from 'service/StaffAPI';
// import {  } from "service/StaffAPI";
import Axios from "axios";
import ConfirmDialog from 'components/Modal/ConfirmDialog'


const Styles = styled.div`

  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }

      input {
        font-size: 1rem;
        padding: 0;
        margin: 0;
        border: 0;
      }
    }
  }

  .pagination {
    padding: 0.5rem;
  }
`
const useStyles = makeStyles({
  table: {
    minWidth: 500,
  },
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "15px",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "15px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  }
});

const tableHeader = [
  { id: 'actorSend', label: 'Người gửi' },
  { id: 'type', label: 'Loại' },
  { id: 'description', label: 'Nội dung', disableSorting: true },
  { id: 'active', label: 'Trạng thái', disableSorting: true },
  { id: 'actions', label: 'Xác nhận', disableSorting: true },
]

const ConfirmRequest = () => {

  var requests;
  const classes = useStyles();
  const [rows, setRows] = React.useState([])
  const [confirmDialog, setConfirmDialog] = React.useState({ isOpen: false, title: '', subTitle: '' });
  const [checkStt, setCheckStt] = React.useState()
  //get all request
  async function getRequest() {
    const hist = createBrowserHistory();
    if (sessionStorage.getItem("roleLogin") != 2) {
      Swal.fire({
        title: "Thông báo!",
        text: 'Bạn không có quyền truy cập!',
        icon: "warning",
      }).then(() => {
        hist.push("/login")
        location.reload();
      })
    } else {
      requests = await getAllRequest()
        .then(res => {
          // for (var requestTemp of res) {
          //   console.log(requestTemp.request)
          //   if (requestTemp.request.statusId == 3) {
          //     console.log('aaa')
          //     setCheckStt(true)
          //   } else if (requestTemp.request.statusId == 4) {
          //     setCheckStt(true)
          //   } else {
          //     console.log('aaa2')
          //     setCheckStt(false)
          //   }
            setRows(res)
          // }


        })

    }
  }

  //accept request
  async function acceptRequest(id, workingScheduleId1, workingScheduleId2, groupTourId1, groupTourId2, dateId, username, requestTypeId, statusId) {
    let check = false;
    let mess;
    //xin nghỉ
    if (requestTypeId == 1) {
      //có thay thế
      if (workingScheduleId1 != null) {
        username = username
      }
      //xin nghỉ không thay thế
      else {
        username = 0
      }
      let data = await changeSttAbsent(username, workingScheduleId1)
        .then(res => {
          mess = 'Xin nghỉ thành công'
          Axios.post("http://localhost:8080/api-v1/update-status-request?id=" + id + "&status=3")
            .then(() => {
              Swal.fire({
                title: "Thành công!",
                text: mess,
                icon: "success",
              }).then(() => {
                getRequest()
              });
            })
        })
    }
    //chuyển ngày làm
    else if (requestTypeId == 2) {
      let data = await changeDayWS(dateId, workingScheduleId1)
        .then(() => {
          mess = 'Chuyển ngày làm thành công'
          Axios.post("http://localhost:8080/api-v1/update-status-request?id=" + id + "&status=3")
            .then(() => {
              Swal.fire({
                title: "Thành công!",
                text: mess,
                icon: "success",
              }).then(() => {
                getRequest()
              });
            })
        })
    }
    //đổi ngày làm
    else if (requestTypeId == 3) {
      let data = await changeWorkingSchedule(workingScheduleId1, workingScheduleId2)
        .then(() => {
          mess = 'Đổi ngày làm thành công'
          Axios.post("http://localhost:8080/api-v1/update-status-request?id=" + id + "&status=3")
            .then(() => {
              Swal.fire({
                title: "Thành công!",
                text: mess,
                icon: "success",
              }).then(() => {
                getRequest()
              });
            })
        })
    }
    //chuyển nhóm
    else if (requestTypeId == 4) {
      let data = await changeTour(groupTourId1, workingScheduleId1)
        .then(() => {
          mess = 'Chuyển nhóm thành công'
          Axios.post("http://localhost:8080/api-v1/update-status-request?id=" + id + "&status=3")
            .then(() => {
              Swal.fire({
                title: "Thành công!",
                text: mess,
                icon: "success",
              }).then(() => {
                getRequest()
              });
            })
        })
    }
    //đổi nhóm
    else if (requestTypeId == 5) {
      let data = await swapTour(groupTourId1, groupTourId2)
        .then(() => {
          mess = 'Đổi nhóm thành công'
          Axios.post("http://localhost:8080/api-v1/update-status-request?id=" + id + "&status=3")
            .then(() => {
              Swal.fire({
                title: "Thành công!",
                text: mess,
                icon: "success",
              }).then(() => {
                getRequest()
              });
            })

        })
    }
  }

  //complete request
  async function completeRequest(id) {
    Axios.post("http://localhost:8080/api-v1/update-status-request?id=" + id + "&status=3")
      .then(() => {
        Swal.fire({
          title: "Thành công!",
          text: "Xác nhận hoàn thành yêu cầu!",
          icon: "success",
        }).then(() => {
          getRequest()
        });
      })
  }

  //reject repuest
  async function rejectRequest(id) {
    Axios.post("http://localhost:8080/api-v1/update-status-request?id=" + id + "&status=4")
      .then(() => {
        Swal.fire({
          title: "Thành công!",
          text: "Hủy yêu cầu thành công",
          icon: "success",
        }).then(() => {
          getRequest()
        });
      })
  }

  useMemo(() => {
    getRequest()
  }, [])

  return (
    <Styles>
      <Card>
        <CardHeader color="primary">
          <h4 className={classes.cardTitleWhite}>Danh sách yêu cầu thay đổi lịch làm việc từ HDV</h4>
        </CardHeader>
        <CardBody>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="custom pagination table">
              <TableHead style={{ backgroundColor: "darkgray" }}>
                <TableRow>
                  {
                    tableHeader.map(headCell => (
                      <TableCell key={headCell.id}>
                        {headCell.label}
                      </TableCell>))
                  }
                </TableRow>
              </TableHead>
              <TableBody>
                {(rows).map((row) => (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row" style={{ width: 70 }}>
                      {row.fullname1}
                    </TableCell>
                    <TableCell style={{ width: 70 }} align="left">
                      {row.type}
                    </TableCell>
                    <TableCell style={{ width: 200 }} align="left">
                      {row.description}
                    </TableCell>
                    <TableCell style={{ width: 70 }} align="left">
                      {row.nameStatus}
                    </TableCell>
                    <TableCell style={{ width: 70 }} align="center">
                      <Button color="primary" disabled={row.request.statusId == 3 || row.request.statusId == 4}
                        onClick={() => {
                          setConfirmDialog({
                            isOpen: true,
                            title: 'Bạn có chắc xác nhận hoàn thành yêu cầu?',
                            onConfirm: () => {
                              setConfirmDialog({ isOpen: false }),
                                completeRequest(row.request.id)
                              // acceptRequest(
                              //   row.request.id,
                              //   row.request.workingScheduleId1,
                              //   row.request.workingScheduleId2,
                              //   row.request.groupTourId1,
                              //   row.request.groupTourId2,
                              //   row.request.dateId,
                              //   row.request.username,
                              //   row.request.requestTypeId,
                              //   row.request.statusId,
                              // )//end accept
                            }//end confirm
                          })
                        }}>Đã giải quyết</Button>
                      <Button color="danger" align="right" disabled={row.request.statusId == 3 || row.request.statusId == 4}
                        onClick={() => {
                          console.log(checkStt)
                          setConfirmDialog({
                            isOpen: true,
                            title: 'Bạn có chắc muốn hủy yêu cầu?',
                            onConfirm: () => {
                              setConfirmDialog({ isOpen: false }),
                                rejectRequest(row.request.id)
                            }//end confirm
                          })
                        }}>Hủy</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardBody>
      </Card>
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </Styles>
  )
};

export default ConfirmRequest;
