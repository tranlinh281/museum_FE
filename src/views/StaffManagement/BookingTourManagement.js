import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import { InputAdornment, TableHead, TextField, TableSortLabel, Card } from '@material-ui/core';
import Popup from 'reactjs-popup';
import styled from 'styled-components'
import SearchIcon from '@material-ui/icons/Search';
import CardHeader from 'components/Card/CardHeader';
import Button from "components/CustomButtons/Button.js";
import CardBody from 'components/Card/CardBody';
import { Add, Edit, Restore } from '@material-ui/icons';
import Swal from 'sweetalert2';
import { getAllBookingTour } from 'service/StaffAPI';
import ModalChangeStatusGT from 'components/Modal/ModalChangeStatusGT';


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

const useStyles1 = makeStyles((theme) => ({
    root: {
        flexShrink: 0,
        marginLeft: theme.spacing(2.5),
    },

}));

function TablePaginationActions(props) {
    const classes = useStyles1();
    const theme = useTheme();
    const { count, page, rowsPerPage, onChangePage, } = props;

    const handleBackButtonClick = (event) => {
        onChangePage(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onChangePage(event, page + 1);
    };

    return (
        <div className={classes.root}>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"

            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
        </div>
    );
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
};

const tableHeader = [
    { id: 'bookingId', label: 'Mã đoàn' },
    { id: 'languageName', label: 'Ngôn ngữ', disableSorting: true },
    { id: 'eventName', label: 'Tên sự kiện', disableSorting: true },
    { id: 'topicName', label: 'Chuyên đề', disableSorting: true },
    { id: 'quantity', label: 'Số lượng khách', disableSorting: true },
    { id: 'groupTourId', label: 'Mã nhóm', disableSorting: true },
    { id: 'startTime', label: 'Thời gian bắt đầu', disableSorting: true },
    { id: 'endTime', label: 'Thời gian kết thúc', disableSorting: true },
    { id: 'usernameStaff', label: 'Nhân viên tạo' },
    { id: 'bookingtourStatus', label: 'Trạng thái', disableSorting: true },
    { id: 'changeSTT', label: 'Cập nhật trạng thái đoàn', disableSorting: true },

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
    var [search, setSearch] = React.useState('');
    const classes = useStyles2();
    const [page, setPage] = React.useState(0);
    const [currenPage, setCurrenPage] = React.useState()
    const [totalPages, setTotalPages] = React.useState()


    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Accept': 'application/json, text/plain, */*',
        'Authorization': 'Bearer ' + sessionStorage.getItem('jwtToken')
    };

    async function getAllBookingTours() {

        let checkPhone;
        let booking;
        if (sessionStorage.getItem('phone') != '') {
            booking = await getAllBookingTour(sessionStorage.getItem('phone'), page)
            checkPhone = true;
            sessionStorage.setItem('phone', '')
        }
        else if (search == '' || sessionStorage.getItem('phone') == null) {
            booking = await getAllBookingTour(search, page)
            checkPhone = true;
        } else if (search.length == 10) {
            await getAllBookingTour(search, page)
                .then(res => {
                    if (res.message) {
                        Swal.fire({
                            title: "Thông báo!",
                            text: res.message,
                            icon: "warning",
                        }).then(() => {
                            return;
                        })
                    } else {
                        booking = res
                        checkPhone = true;
                    }
                })

        }
        if (checkPhone == true) {
            setRows(booking.content)
            const currenPage = booking.size
            const totalPages = booking.totalElements
            setCurrenPage(currenPage)
            setTotalPages(totalPages)
        }

    }

    const listSTT = [
        { id: 5, name: 'Hủy' },
        // { id: 6, name: 'Audio guide' },
    ]

    useMemo(() => {
        getAllBookingTours()
    }, [page, search])

    useEffect(() => {
        getAllBookingTours()
    },
        [page, search]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    return (
        <Styles>
            <br />
            <TextField style={{ marginBottom: "2px" }}
                variant="filled"
                label="Tìm kiếm theo số điện thoại"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
                onChange={e => { setSearch(e.target.value) }}
                value={search}
            />
            <br />
            <Card>
                <CardHeader color="primary">
                    <h4 className={classes.cardTitleWhite}>Danh sách đoàn tham quan</h4>
                    <p className={classes.cardCategoryWhite}>
                        Quản lý thông tin khách tham quan bảo tàng.
            </p>
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
                                    <TableRow key={row.bookingId}>
                                        <TableCell component="th" scope="row" >
                                            {row.bookingId}
                                        </TableCell>
                                        <TableCell style={{ width: 80 }} align="left">
                                            {row.languageName}
                                        </TableCell>
                                        <TableCell style={{ width: 80 }} align="left">
                                            {row.eventName}
                                        </TableCell>
                                        <TableCell style={{ width: 160 }}>
                                            {(row.listTopic).map((listTopic) => (
                                                <p align="left">
                                                    {listTopic}
                                                </p>
                                            ))}
                                        </TableCell>
                                        <TableCell style={{ width: 100 }} align="left">
                                            {row.quantity}
                                        </TableCell>
                                        <TableCell style={{ width: 80 }} align="left">
                                            {row.groupTourId}
                                        </TableCell>
                                        <TableCell style={{ width: 120 }} align="left">
                                            {row.startTime}
                                        </TableCell>
                                        <TableCell style={{ width: 120 }} align="left">
                                            {row.endTime}
                                        </TableCell>
                                        <TableCell style={{ width: 100 }} align="left">
                                            {row.usernameStaff}
                                        </TableCell>
                                        <TableCell style={{ width: 80 }} align="left">
                                            {row.bookingtourStatus}
                                        </TableCell>
                                        {/* <TableCell style={{ width: 80 }}>
                                            <Popup onClose={getAllBookingTours} modal closeOnDocumentClick={false} trigger={<Button color='info' align="center"><Edit></Edit></Button>}>
                                                {close =>
                                                    <ModalUpdateBookingTour
                                                        close={close}
                                                        dataParentToChild={row}
                                                    />}
                                            </Popup>
                                        </TableCell> */}
                                        <TableCell style={{ width: 60 }} >
                                            <Popup modal
                                                closeOnDocumentClick={false} trigger={<Button color="primary" disabled={row.bookingtourStatus == 'Audio guide' || row.bookingtourStatus == 'Bị hủy'} ><Restore></Restore></Button>}>
                                                {close =>
                                                    <ModalChangeStatusGT
                                                        close={close}
                                                        dataParentToChild={row}
                                                        nameChange="đoàn"
                                                        labelName="Mã đoàn"
                                                        labelValue="Đoàn "
                                                        id={row.bookingId}
                                                        listSTT={listSTT}
                                                    />}
                                            </Popup>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TablePagination
                                        colSpan={tableHeader.length}
                                        count={totalPages}
                                        rowsPerPage={currenPage}
                                        page={page}
                                        onChangePage={handleChangePage}
                                        ActionsComponent={TablePaginationActions}
                                        rowsPerPageOptions={10}
                                    />
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>
                </CardBody>
            </Card>
        </Styles>
    );
}
