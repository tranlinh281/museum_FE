import React, { useEffect, useState } from 'react';
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
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import axios from 'axios';
import { InputAdornment, TableHead, TextField, TableSortLabel, Card } from '@material-ui/core';
import Popup from 'reactjs-popup';
import styled from 'styled-components'
import CardHeader from 'components/Card/CardHeader';
import Button from "components/CustomButtons/Button.js";
import CardBody from 'components/Card/CardBody';
import { Add, Block, Delete, Edit } from '@material-ui/icons';
import SearchIcon from '@material-ui/icons/Search';
import { useHistory } from 'react-router-dom'
import ConfirmDialog from 'components/Modal/ConfirmDialog'
import ModalCreateEvent from 'components/Modal/ModalCreateEvent.js'
import ModalUpdateEvent from 'components/Modal/ModalUpdateEvent.js'
import { getAllEvent } from 'service/AdminAPI';
import Swal from 'sweetalert2';

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
  rowsPerPage: PropTypes.number.isRequired,
};

const tableHeader = [
  { id: 'eventName', label: 'T??n s??? ki???n' },
  { id: 'startTime', label: 'Th???i gian b???t ?????u', disableSorting: true },
  { id: 'endTime', label: 'Th???i gian k???t th??c', disableSorting: true },
  { id: 'topicName', label: 'Chuy??n ?????', disableSorting: true },
  { id: 'status', label: 'Tr???ng th??i', disableSorting: true },
  { id: 'action', label: 'Ch???nh s???a', disableSorting: true },
  { id: 'active', label: 'D???ng/M???', disableSorting: true }
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

function App() {

  const onDelete = id => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    })
  }

  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState([]);
  const classes = useStyles2();
  const [page, setPage] = useState(0);
  const [currenPage, setCurrenPage] = useState()
  const [totalPages, setTotalPages] = useState()
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' });

  async function getEvents() {
    var event = await getAllEvent(search, page)
    setRows(event.content)
    const currenPage = event.size
    const totalPages = event.totalElements
    setCurrenPage(currenPage)
    setTotalPages(totalPages)
  }

  useEffect(() => {
    getEvents()

  },
    [page, search]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  function handleClick(isActive, eventId, startTime, endTime) {
    let status = "";
    let headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Accept': 'application/json, text/plain, */*',
      'Authorization': 'Bearer ' + sessionStorage.getItem('jwtToken')
    };
    console.log(isActive)
    if (isActive == 'T???m ng??ng ????ng k??') {
      status = 1;
    } else {
      // dd-mm-yyyy
      var dateFrom = startTime.split("-");
      var timeToStringFrom = dateFrom[2] + "-" + dateFrom[1] + "-" + dateFrom[0];

      // dd-mm-yyyy
      var dateTo = endTime.split("-");
      var timeToStringTo = dateTo[2] + "-" + dateTo[1] + "-" + dateTo[0];

      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();
      today = yyyy + '-' + mm + '-' + dd;

      var start = new Date(timeToStringFrom);
      var end = new Date(timeToStringTo);
      var current = new Date(today);
      status = 0
    }
    axios.post("http://localhost:8080/api/v1/events/updatestatus/" + status + "/" + eventId, { headers: headers })
      .then(res => {
        if (status == 0) {
          Swal.fire({
            title: "Th??nh c??ng",
            text: 'D???ng d??ng k?? s??? ki???n th??nh c??ng',
            icon: "success",
          }).then(() => {
            getEvents()
            // location.reload();
          })

        } else {
          Swal.fire({
            title: "Th??nh c??ng",
            text: 'M??? ????ng k?? s??? ki???n th??nh c??ng',
            icon: "success",
          }).then(() => {
            getEvents()
            
            // location.reload();
          })
        }

      })
      .catch(e => {
        let errMes = '';
        if (e.response.status === 400) {
          errMes = e.response.data.message
        } else if (e.response.status === 404) {
          errMes = e.response.data.message
        } else {
          errMes = 'C???p nh???t tr???ng th??i s??? ki???n th???t b???i'
        }
        Swal.fire({
          title: "Th???t b???i",
          text: errMes,
          icon: "error",
        }).then(() => {
          return;
        })
      })
  }

  return (
    <Styles>
      <TextField style={{ paddingBottom: "2px" }}
        variant="filled"
        label="T??m ki???m theo t??n s??? ki???n"
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
      <Popup onClose={getEvents} modal trigger={<Button color="primary" style={{ float: "right" }}>Th??m s??? ki???n</Button>}>
        {close =>
          <ModalCreateEvent
            close={close}
          />}
      </Popup>
      <br />

      <Card>
        <CardHeader color="primary">
          <h4 className={classes.cardTitleWhite}>Qu???n l?? s??? ki???n</h4>
          <p className={classes.cardCategoryWhite}>
            Qu???n l?? s??? ki???n, th??m s??? ki???n ho???c ch???nh s???a s??? ki???n c???a b???o t??ng.
          </p>
        </CardHeader>
        <CardBody>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="custom pagination table">
              <TableHead style={{ backgroundColor: "darkgray" }}>
                <TableRow>
                  {
                    tableHeader.map(headCell => (
                      <TableCell key={headCell.id} align="center">
                        {headCell.label}
                      </TableCell>))
                  }
                </TableRow>
              </TableHead>
              <TableBody>
                {(rows).map((row) => (
                  <TableRow key={row.eventId}>
                    <TableCell component="th" scope="row" style={{ width: 160 }}>
                      {row.eventName}
                    </TableCell>
                    <TableCell style={{ width: 60 }} align="left">
                      {row.startTime}
                    </TableCell>
                    <TableCell style={{ width: 60 }} align="left">
                      {row.endTime}
                    </TableCell>
                    <TableCell style={{ width: 160 }}>
                      {(row.listTopic).map((listTopic) => (
                        <p align="left">
                          {listTopic.topicName}
                        </p>
                      ))}
                    </TableCell>
                    <TableCell style={{ width: 40 }} align="left">
                      {row.active}
                    </TableCell>
                    <TableCell style={{ width: 40 }} align="center">
                      <Popup onClose={getEvents}  modal closeOnDocumentClick={false} trigger={<Button size="sm" color="info"><Edit></Edit></Button>}>
                        {close =>
                          <ModalUpdateEvent
                            close={close}
                            dataParentToChild={row}
                            dataTopic={row.listTopic}
                          />}
                      </Popup>
                    </TableCell>
                    <TableCell style={{ width: 80 }} align="center">
                      <Button size="sm" color="danger"
                        onClick={() => {
                          let temp = '';
                          if (row.active == '??ang m??? ????ng k??') {
                            temp = 'ng??ng s??? ki???n ' + row.eventName + ' kh??ng cho ????ng k???'
                          } else {
                            temp = 'm??? l???i s??? ki???n ' + row.eventName + ' cho ????ng k???'
                          }
                          setConfirmDialog({
                            isOpen: true,
                            title: 'B???n c?? ch???c mu???n ' + temp,
                            onConfirm: () => { setConfirmDialog({ isOpen: false }), handleClick(row.active, row.eventId, row.startTime, row.endTime) }
                          })
                        }}>
                        <Block>
                        </Block>
                      </Button>
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
                    labelRowsPerPage="Trang "
                    rowsPerPageOptions={10}
                    defaultValue={0}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </CardBody>
      </Card>
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </Styles>
  );
}

export default App
