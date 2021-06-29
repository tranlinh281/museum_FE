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
import { Add, Block, Edit } from '@material-ui/icons';
import SearchIcon from '@material-ui/icons/Search';
import { useHistory } from 'react-router-dom'
import ConfirmDialog from 'components/Modal/ConfirmDialog'
import Notification from '../Notifications/Notifications.js';
import ModalCreateTopic from 'components/Modal/ModalCreateTopic.js';
import ModalUpdateTopic from 'components/Modal/ModalUpdateTopic.js';
import { getAllTopics } from 'service/AdminAPI';
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
  { id: 'topicName', label: 'Tên chuyên đề' },
  { id: 'priority', label: 'Độ ưu tiên' },
  { id: 'startTime', label: 'Thời gian bắt đầu', disableSorting: true },
  { id: 'endTime', label: 'Thời gian kết thúc', disableSorting: true },
  { id: 'status', label: 'Trạng thái', disableSorting: true },
  { id: 'action', label: 'Chỉnh sửa', disableSorting: true },
  { id: 'active', label: 'Dừng/Mở', disableSorting: true }
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
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })

  async function getTopics() {
    var topic = await getAllTopics(search, page)
    setRows(topic.content)
    const currenPage = topic.size
    const totalPages = topic.totalElements
    setCurrenPage(currenPage)
    setTotalPages(totalPages)
  }

  useEffect(() => {
    getTopics()

  },
    [page, search]);


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  function handleClick(isActive, topicId, startTime, endTime) {
    let status = "";
    let headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Accept': 'application/json, text/plain, */*',
      'Authorization': 'Bearer ' + sessionStorage.getItem('jwtToken')
    };
    if (isActive == 'Tạm ngưng đăng ký') {
      status = 1;
    } else {
      let changeStatus = 0;
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

      status = changeStatus;
    }
    axios.post("http://localhost:8080/api/v1/topics/updatestatus/" + status + "/" + topicId, { headers: headers })
      .then(res => {
        //nếu chuyên đề chưa được xóa thì hiển thị xóa
        if (status == 0) {
          Swal.fire({
            title: "Thành công",
            text: 'Dừng đăng ký chuyên đề thành công',
            icon: "success",
          }).then(() => {
            getTopics()
            // location.reload();
          })
        } else {
          //Hiển thị khôi phục chuyên đề
          Swal.fire({
            title: "Thành công",
            text: 'Mở đăng ký chuyên đề thành công',
            icon: "success",
          }).then(() => {
            getTopics()
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
          errMes = 'Cập nhật trạng thái chuyên đề thất bại'
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

  return (
    <Styles>
      <TextField style={{ paddingBottom: "2px" }}
        variant="filled"
        label="Tìm kiếm theo tên chuyên đề"
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
      <Popup onClose={getTopics} modal trigger={<Button color="primary" style={{ float: 'right' }}>Thêm chuyên đề</Button>}>
        {close =>
          <ModalCreateTopic
            close={close}
          />}
      </Popup>
      <br />
      <Card>
        <CardHeader color="primary">
          <h4 className={classes.cardTitleWhite}>Quản lý chuyên đề</h4>
          <p className={classes.cardCategoryWhite}>
            Quản lý chuyên đề, thêm chuyên đề hoặc chỉnh sửa chuyên đề của bảo tàng.
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
                  <TableRow key={row.topicId}>
                    <TableCell component="th" scope="row" style={{ width: 200 }}>
                      {row.topicName}
                    </TableCell>
                    <TableCell style={{ width: 100 }} align="left">
                      {row.priority}
                    </TableCell>
                    <TableCell style={{ width: 130 }} align="left">
                      {row.startTime}
                    </TableCell>
                    <TableCell style={{ width: 130 }} align="left">
                      {row.endTime}
                    </TableCell>
                    <TableCell style={{ width: 80 }} align="left">
                      {row.active}
                    </TableCell>
                    <TableCell style={{ width: 80 }} align="center">
                      <Popup onClose={getTopics} modal closeOnDocumentClick={false} trigger={<Button size="sm" color="info"><Edit></Edit></Button>}>
                        {close =>
                          <ModalUpdateTopic
                            close={close}
                            dataParentToChild={row}
                          />}
                      </Popup>
                    </TableCell>
                    <TableCell style={{ width: 100 }} align="center">
                      <Button size="sm" color="danger"
                        onClick={() => {
                          let temp = '';
                          if (row.active == 'Đang mở đăng ký') {
                            temp = 'ngưng chuyên đề ' + row.topicName + ' không cho đăng ký?'
                          } else {
                            temp = 'mở lại chuyên đề ' + row.topicName + ' cho đăng ký?'
                          }
                          setConfirmDialog(
                            {
                              isOpen: true,
                              title: 'Bạn có chắc muốn ' + temp,
                              onConfirm: () => {
                                setConfirmDialog({ isOpen: false })

                                handleClick(row.active, row.topicId, row.startTime, row.endTime)
                              }
                            }
                          )
                        }}>
                        <Block></Block>
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
      <Notification
        notify={notify}
        setNotify={setNotify}
      />
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </Styles>
  );
}

export default App;
