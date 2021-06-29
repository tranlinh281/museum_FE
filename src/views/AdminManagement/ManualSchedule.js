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
import Axios from 'axios';


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
        marginTop: "5px",
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

export default function ManualSchedule() {
    const classes = useStyles2();

    async function manualSchedule() {
        Axios.post("http://localhost:8080/api/v1/manual/schedule" )
            .then(res => {
                Swal.fire({
                    title: "Thành công",
                    text: 'Xác nhận xếp lịch thủ công thành công!',
                    icon: "success",
                }).then(() => {
                    return;
                })

            })
            .catch(e => {
                let errMes = '';
                if (e.response.status === 400) {
                    errMes = e.response.data.message
                } else if (e.response.status === 404) {
                    errMes = e.response.data.message
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
            <Card>
                <CardHeader color="primary">
                    <h4 className={classes.cardTitleWhite}>Xếp lịch thủ công</h4>
                    <p className={classes.cardCategoryWhite}>
                        Xếp lịch thủ công khi hệ thống tự động xếp lịch không hoạt động
            </p>
                </CardHeader>
                <CardBody>
                    <Button color="primary" onClick={manualSchedule}>Xác nhận xếp lịch thủ công</Button>
                </CardBody>
            </Card>
        </Styles>
    );
}
