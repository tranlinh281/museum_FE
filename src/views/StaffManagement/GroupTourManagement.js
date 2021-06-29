import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { TableHead, TextField, Card } from '@material-ui/core';
import Popup from 'reactjs-popup';
import styled from 'styled-components'
import CardHeader from 'components/Card/CardHeader';
import Button from "components/CustomButtons/Button.js";
import CardBody from 'components/Card/CardBody';
import { Edit, PersonAdd, Restore } from '@material-ui/icons';
import Swal from 'sweetalert2';
import ModalAddTourGuide from 'components/Modal/ModalAddTourGuide';
import { getAllGroupTour } from 'service/StaffAPI';
import ModalChangeStatusGT from 'components/Modal/ModalChangeStatusGT';
import { createBrowserHistory } from 'history';


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

const tableHeader = [
    { id: 'id', label: 'Mã nhóm' },
    { id: 'languageName', label: 'Ngôn ngữ', disableSorting: true },
    { id: 'bTourId', label: 'Các đoàn', disableSorting: true },
    { id: 'quantity', label: 'Số lượng khách', disableSorting: true },
    { id: 'startTime', label: 'Thời gian bắt đầu', disableSorting: true },
    { id: 'endTime', label: 'Thời gian kết thúc', disableSorting: true },
    { id: 'grouptourStatus', label: 'Trạng thái', disableSorting: true },
    { id: 'actions', label: 'Thêm HDV', disableSorting: true },
    { id: 'changeSTT', label: 'Cập nhật trạng thái nhóm', disableSorting: true },

]

const useStyles2 = makeStyles({
    table: {
        minWidth: 500,
    },
    cardCategoryWhite: {
        "&,& a,& a:hover,& a:focus": {
            color: "rgba(255,255,255,.62)",
            margin: "0",
            fontSize: "14px",
            marginTop: "0",
            marginBottom: "0"
        },
        "& a,& a:hover,& a:focus": {
            color: "#FFFFFF"
        }
    },
    cardTitleWhite: {
        color: "#FFFFFF",
        marginTop: "5px",
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

export default function CustomPaginationActionsTable() {

    const [rows, setRows] = React.useState([]);
    const [search, setSearch] = React.useState(false);
    const [searchDate, setSearchDate] = React.useState('');
    const [disSearch, setDisSearch] = React.useState(true);
    const classes = useStyles2();
    const [flagUpdate, setFlagUpdate] = React.useState(false)
    var test;
    var day = new Date()
    var month = day.getMonth() + 1
    if (month < 10) {
        month = "-0" + month
    }
    var today = day.getFullYear() + month + "-" + day.getDate()

    async function getGroupTours() {
        const hist = createBrowserHistory();
        if (sessionStorage.getItem("roleLogin") != 2) {
            Swal.fire({
                title: "Thông báo!",
                text: 'Bạn không có quyền truy cập!',
                icon: "warning",
            }).then(() => {
                hist.push("/login")
                // return;
                location.reload();
            })
        } else {
            if (searchDate.length == 0) {
                setDisSearch(true)
            } else {
                setDisSearch(false)
                var groupTour
                setSearchDate(searchDate)
                setSearch(search)
                if (search == true) {
                    groupTour = await getAllGroupTour(searchDate)
                        .then(res => {
                            console.log(res)
                            setSearch(false)
                            if (res.length == 0) {
                                Swal.fire({
                                    title: "Thông báo!",
                                    text: 'Không tìm thấy nhóm trong ngày',
                                    icon: "warning",
                                }).then(() => {
                                    // setSearchDate(today)
                                    // setSearch(true)
                                    // getGroupTours()
                                    return;
                                })
                            } else {
                                setRows(res)
                            }
                        })
                        .catch(e => {
                            Swal.fire({
                                title: "Thông báo!",
                                text: 'Không tìm thấy nhóm trong ngày',
                                icon: "warning",
                            })
                        })
                }
            }
        }

    }

    const listSTT = [
        // { id: 4, name: 'Hoanf thanhf' },
        { id: 5, name: 'Hủy' },
        { id: 6, name: 'Audio guide' },
    ]

    useMemo(() => {

        setSearchDate(today)
        setSearch(true)
    }, [])

    useEffect(() => {

        getGroupTours()
        console.log(searchDate)
    },
        [searchDate, search]);


    return (
        <Styles>
            <br />
            <TextField style={{ marginBottom: "2px" }}
                variant="filled"
                label="Tìm kiếm theo ngày"
                InputLabelProps={{
                    shrink: true,
                }}
                type="date"
                onChange={e => { setSearchDate(e.target.value) }}
                value={searchDate}
            />
            <Button disabled={disSearch} onClick={() => {
                setSearch(true)
            }} color="primary" style={{ marginLeft: "15px" }}>Tìm kiếm</Button>
            <br />
            <Card>
                <CardHeader color="primary">
                    <h4 className={classes.cardTitleWhite}>Danh sách nhóm tham quan theo ngày</h4>
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
                                            {"Nhóm " + row.id}
                                        </TableCell>
                                        <TableCell style={{ width: 70 }} align="left">
                                            {row.language}
                                        </TableCell>
                                        <TableCell style={{ width: 160 }}>
                                            {(row.btGroups).map((id) => (
                                                <p align="left">
                                                    {"Đoàn " + id.bookingTourIds + " - " + id.tourStatus}
                                                </p>
                                            ))}
                                        </TableCell>
                                        <TableCell style={{ width: 100 }} align="left">
                                            {row.totalQuantity}
                                        </TableCell>

                                        <TableCell style={{ width: 120 }} align="left">
                                            {row.startTime}
                                        </TableCell>
                                        <TableCell style={{ width: 120 }} align="left">
                                            {row.endTime}
                                        </TableCell>
                                        <TableCell style={{ width: 160 }} align="left">
                                            {row.assigned ? row.tgName + " - " + row.tgUsername : "Không có HDV"}
                                        </TableCell>
                                        <TableCell style={{ width: 60 }} >
                                            <Popup modal onClose={() => {
                                                setSearchDate(searchDate),
                                                    setSearch(true),
                                                    getGroupTours()
                                            }} closeOnDocumentClick={false} trigger={<Button color="info" disabled={row.assigned || !row.update} ><PersonAdd></PersonAdd></Button>}>
                                                {close =>
                                                    <ModalAddTourGuide
                                                        close={close}
                                                        dataParentToChild={row}
                                                    />}
                                            </Popup>
                                        </TableCell>
                                        <TableCell style={{ width: 60 }} >

                                            <Popup modal onClose={() => {
                                                setSearchDate(searchDate)
                                                setSearch(true)
                                                getGroupTours()
                                            }} closeOnDocumentClick={false} trigger={<Button color="primary" disabled={!row.update} ><Restore></Restore></Button>}>
                                                {close =>
                                                    <ModalChangeStatusGT
                                                        close={close}
                                                        dataParentToChild={row}
                                                        nameChange="nhóm"
                                                        labelName="Mã nhóm"
                                                        labelValue="Nhóm "
                                                        id={row.id}
                                                        listSTT={listSTT}
                                                    />}
                                            </Popup>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardBody>
            </Card>
        </Styles>
    );
}
