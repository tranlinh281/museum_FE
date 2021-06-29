import React, { useEffect, useMemo, useState } from 'react';
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
import SearchIcon from '@material-ui/icons/Search';
import CardHeader from 'components/Card/CardHeader';
import Button from "components/CustomButtons/Button.js";
import CardBody from 'components/Card/CardBody';
import { Add, Edit } from '@material-ui/icons';
import ModalUpdate from 'components/Modal/ModalUpdate'
import { getAllAccount } from 'service/AdminAPI';
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
  { id: 'username', label: 'Tên đăng nhập' },
  { id: 'fullname', label: 'Họ tên' },
  { id: 'phone', label: 'Số điện thoại', disableSorting: true },
  { id: 'gender', label: 'Giới tính', disableSorting: true },
  { id: 'email', label: 'Địa chỉ email', disableSorting: true },
  { id: 'language', label: 'Ngôn ngữ', disableSorting: true },
  { id: 'address', label: 'Địa chỉ', disableSorting: true },
  { id: 'birthday', label: 'Ngày sinh', disableSorting: true },
  { id: 'action', label: 'Chỉnh sửa', disableSorting: true },

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


// Sử dụng để load data mặc định
function App() {

  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState([]);
  const classes = useStyles2();
  const [page, setPage] = useState(0);
  const [currenPage, setCurrenPage] = useState()
  const [totalPages, setTotalPages] = useState()

  async function getAccount() {
    const hist = createBrowserHistory();
    if (sessionStorage.getItem("roleLogin") != 1) {
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

  //Chuyển trang page
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Styles>
      <TextField style={{ paddingBottom: "2px" }}
        variant="filled"
        label="Tìm kiếm theo tên đăng nhập"
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
          <h4 className={classes.cardTitleWhite}>Quản lý nhân viên</h4>
          <p className={classes.cardCategoryWhite}>
            Quản lý thông tin cá nhân, thêm nhân viên mới hoặc đình chỉ hoạt động của nhân viên.
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
                  <TableRow key={row.username}>
                    <TableCell component="th" scope="row" style={{ width: 150 }}>
                      {row.username}
                    </TableCell>
                    <TableCell style={{ width: 160 }} align="left">
                      {row.fullname}
                    </TableCell>
                    <TableCell style={{ width: 160 }} align="left">
                      {row.phone}
                    </TableCell>
                    <TableCell style={{ width: 80 }} align="center">
                      {row.gender}
                    </TableCell>
                    <TableCell style={{ width: 160 }} align="left">
                      {row.email}
                    </TableCell>
                    <TableCell style={{ width: 160 }} align="left">
                      {row.language}
                    </TableCell>
                    <TableCell style={{ width: 160 }} align="left">
                      {row.address}
                    </TableCell>
                    <TableCell style={{ width: 140 }} align="left">
                      {row.birthday}
                    </TableCell>
                    <TableCell style={{ width: 70 }} align="center">
                      <Popup onClose={() => { getAccount() }} modal closeOnDocumentClick={false} trigger={<Button size="sm" color="info"><Edit></Edit></Button>}>
                        {close =>
                          <ModalUpdate
                            close={close}
                            dataParentToChild={row}
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
                    rowsPerPageOptions={[0]}
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
export default App;
