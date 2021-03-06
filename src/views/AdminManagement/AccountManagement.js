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
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import axios from 'axios';
import { InputAdornment, TableHead, TextField, TableSortLabel, Card } from '@material-ui/core';
import Popup from 'reactjs-popup';
import { createBrowserHistory } from 'history';
import styled from 'styled-components'
import SearchIcon from '@material-ui/icons/Search';
import CardHeader from 'components/Card/CardHeader';
import Button from "components/CustomButtons/Button.js";
import CardBody from 'components/Card/CardBody';
import { Add, Block, Edit } from '@material-ui/icons';
import ModalCreate from 'components/Modal/ModalCreateAccount';
import ModalUpdateAccount from 'components/Modal/ModalUpdateAccount';
import ConfirmDialog from 'components/Modal/ConfirmDialog';
import { getAllAccount } from 'service/AdminAPI';
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
  { id: 'username', label: 'T??n ????ng nh???p' },
  { id: 'role', label: 'Ch???c v???' },
  { id: 'status', label: 'Tr???ng th??i', disableSorting: true },
  { id: 'changePass', label: '?????i m???t kh???u', disableSorting: true },
  { id: 'active', label: 'Kh??a/M??? t??i kho???n', disableSorting: true }
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

  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState([]);
  const classes = useStyles2();
  const [page, setPage] = useState(0);
  const [currenPage, setCurrenPage] = useState()
  const [totalPages, setTotalPages] = useState()
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' });

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Accept': 'application/json, text/plain, */*',
    'Authorization': 'Bearer ' + sessionStorage.getItem('jwtToken')
  };

  const BASE_URL = "http://localhost:8080";

  async function getAccount() {

    const hist = createBrowserHistory();
    if (sessionStorage.getItem("roleLogin") != 1) {
      Swal.fire({
        title: "Th??ng b??o!",
        text: 'B???n kh??ng c?? quy???n truy c???p!',
        icon: "warning",
      }).then(() => {
        hist.push("/login")
        // return;
        location.reload();
      })
    } else {
      var account = await getAllAccount(search, page)
      setRows(account.content)
      const currenPage = account.size
      const totalPages = account.totalElements
      setCurrenPage(currenPage)
      setTotalPages(totalPages)
    }

  }

  useEffect(() => {
    getAccount()

  },
    [page, search]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  function checkAdmin(roleName) {
    if (roleName == 'Qu???n l??') {
      return true;
    }
    return false
  }

  function handleClickBlock(status, username) {

    var change;
    //l???y stt t??? account, n???u l?? true => c???n kh??a => status = 0
    if (status == true) {
      change = 0

    } else if (status == false) {
      change = 1
    }
    axios.post(BASE_URL + "/api/v1/accounts/updatestatus/" + change + "/" + username, { headers: headers })
      .then(res => {
        if (res.data.message === 'Kh??ng th??? kh??a Qu???n l??') {
          Swal.fire({
            title: "C???nh b??o",
            text: 'Kh??ng th??? kh??a t??i kho???n c???a qu???n l??',
            icon: "warning",
          }).then(() => {
            return;
          })
        } else {
          Swal.fire({
            title: "Th??nh c??ng",
            text: res.data.message,
            icon: "success",
          }).then(() => {
            getAccount()
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
          errMes = 'Kh??ng c???p nh???t ???????c tr???ng th??i'
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
        label="T??m ki???m theo t??n ????ng nh???p"
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
      <Popup modal closeOnDocumentClick={false} trigger={<Button color="primary" style={{ float: 'right' }}>Th??m t??i kho???n</Button>}>
        {close =>
          <ModalCreate
            close={close}
          />}
      </Popup>
      <br />
      <Card>
        <CardHeader color="primary">
          <h4 className={classes.cardTitleWhite}>Qu???n l?? t??i kho???n</h4>
          <p className={classes.cardCategoryWhite}>
            Qu???n l?? t??i kho???n nh??n vi??n, th??m t??i kho???n ho???c kh??a t??i kho???n c???a nh??n vi??n.
            </p>
        </CardHeader>
        <CardBody>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="custom pagination table">
              <TableHead style={{ backgroundColor: "darkgray" }}>
                <TableRow >
                  {
                    tableHeader.map(headCell => (
                      <TableCell key={headCell.id} style={{ textAlign: "center" }}>
                        {headCell.label}
                      </TableCell>))
                  }
                </TableRow>
              </TableHead>
              <TableBody>
                {(rows).map((row) => (
                  <TableRow key={row.username}>
                    <TableCell component="th" scope="row" style={{ width: 200 }}>
                      {row.username}
                    </TableCell>
                    <TableCell style={{ width: 160 }} align="left">
                      {row.roleName}
                    </TableCell>
                    <TableCell style={{ width: 100 }} align="left">
                      {row.activeView}
                    </TableCell>
                    <TableCell style={{ width: 50 }} align="center">
                      <Popup onClose={getAccount} modal closeOnDocumentClick={false} trigger={<Button size="sm" color="info"><Edit></Edit></Button>}>
                        {close =>
                          <ModalUpdateAccount
                            close={close}
                            dataParentToChild={row}
                            search={search}
                            page={page}
                          />}
                      </Popup>
                    </TableCell>
                    <TableCell style={{ width: 50 }} align="center">
                      <Button size="sm" color="danger"
                        disabled={checkAdmin(row.roleName)}
                        onClick={() => {
                          let temp = '';
                          if (row.active == false) {
                            temp = 'm??? kh??a'
                          } else {
                            temp = 'kh??a'
                          }
                          setConfirmDialog({
                            isOpen: true,
                            title: 'B???n c?? ch???c mu???n ' + temp + ' t??i kho???n ' + row.username + '?',
                            onConfirm: () => {
                              handleClickBlock(row.active, row.username),
                                setConfirmDialog({ isOpen: false })
                            }
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
