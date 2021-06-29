import React, { useEffect } from 'react';
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
import Axios from 'axios';
import { InputAdornment, TableHead, TextField, TableSortLabel, Card, Dialog, DialogTitle, List, ListItemAvatar, Avatar, ListItemText, ListItem } from '@material-ui/core';
import Popup from 'reactjs-popup';

import { createBrowserHistory } from 'history';
import styled from 'styled-components'
import SearchIcon from '@material-ui/icons/Search';
import CardHeader from 'components/Card/CardHeader';
import Button from "components/CustomButtons/Button.js";
import CardBody from 'components/Card/CardBody';
import ModalUpdateVisitor from 'components/Modal/ModalUpdateVisitor';
import { Add, Edit, DirectionsBus } from '@material-ui/icons';
import ModalCreateVisitor from 'components/Modal/ModalCreateVisitor';
import ModalAddNewVisitorBookingTourEvent from 'components/Modal/ModalAddNewVisitorBookingTourEvent';
import ModalAddNewVisitorBookingTourTopic from 'components/Modal/ModalAddNewVisitorBookingTourTopic';
import { getAllVisitors } from 'service/StaffAPI';


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

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      {/* <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton> */}
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
      {/* <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton> */}
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
  { id: 'name', label: 'Tên khách tham quan' },
  { id: 'phone', label: 'Số điện thoại' },
  { id: 'actions', label: 'Chỉnh sửa thông tin khách', disableSorting: true },
  { id: 'actionsBookingTopic', label: 'Thêm đoàn theo chuyên đề', disableSorting: true },
  { id: 'actionsBookingEvent', label: 'Thêm đoàn theo sự kiện', disableSorting: true },
  { id: 'redirec', label: 'Thông tin các đoàn', disableSorting: true }
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
  const [search, setSearch] = React.useState([]);
  const classes = useStyles2();
  const [page, setPage] = React.useState(0);
  const [currenPage, setCurrenPage] = React.useState()
  const [totalPages, setTotalPages] = React.useState()

  sessionStorage.setItem('phone', '')

  async function getVisitors() {
    var visitor = await getAllVisitors(search, page)
    setRows(visitor.content)
    const currenPage = visitor.size
    const totalPages = visitor.totalElements
    setCurrenPage(currenPage)
    setTotalPages(totalPages)
  }

  useEffect(() => {

    getVisitors()

  },
    [page, search]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const hist = createBrowserHistory();
  return (
    <Styles>
      <TextField style={{ paddingBottom: "2px" }}
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
      <Popup modal onClose={getVisitors} closeOnDocumentClick={false} trigger={<Button color="primary" style={{ float: "right" }} >Thêm khách tham quan</Button>}>
        {close =>
          <ModalCreateVisitor
            close={close}
          />
        }
      </Popup>
      {/* <Button color="primary" style={{ float: 'right' }} onClick={logoutHandle}>Đăng xuất</Button> */}
      <br />
      <Card>
        <CardHeader color="primary">
          <h4 className={classes.cardTitleWhite}>Quản lý khách tham quan</h4>
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
                  <TableRow key={row.visitorId} >
                    <TableCell component="th" scope="row" style={{ width: 'auto' }} >
                      {row.name}
                    </TableCell>
                    <TableCell style={{ width: 'auto' }} align="left">
                      {row.phone}
                    </TableCell>
                    <TableCell style={{ width: 170 }} align="center">
                      <Popup onClose={getVisitors} modal closeOnDocumentClick={false} trigger={<Button color="info" size="sm"><Edit></Edit></Button>}>
                        {close =>
                          <ModalUpdateVisitor
                            close={close}
                            dataParentToChild={row}
                          />}
                      </Popup>
                    </TableCell>
                    <TableCell style={{ width: 180 }} align="center">
                      <Popup onClose={getVisitors} modal closeOnDocumentClick={false} trigger={<Button color="primary" size="sm"><Add></Add></Button>}>
                        {close =>
                          <ModalAddNewVisitorBookingTourTopic
                            close={close}
                            dataParentToChild={row}
                          />}
                      </Popup>
                    </TableCell>
                    <TableCell style={{ width: 160 }} align="center">
                      <Popup onClose={getVisitors} modal closeOnDocumentClick={false} trigger={<Button color="primary" size="sm"><Add></Add></Button>}>
                        {close =>
                          <ModalAddNewVisitorBookingTourEvent
                            close={close}
                            dataParentToChild={row}
                          />}
                      </Popup>
                    </TableCell>
                    <TableCell style={{ width: 120 }} align="center" >
                      <Button color="primary" size="sm" onClick={() => {
                        hist.push('/staff/bookingtour')
                        sessionStorage.setItem('phone', row.phone)
                        window.location.reload()
                      }}><DirectionsBus></DirectionsBus></Button>
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
                    rowsPerPageOptions={false}
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
