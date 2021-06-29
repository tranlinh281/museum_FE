import React, { useState } from "react";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import Swal from "sweetalert2";
import bgr from "assets/img/bgr.jpg";
import login from "assets/img/logologin.jpg";

import CardAvatar from "components/Card/CardAvatar";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      jwtToken: "",
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      username: this.username,
      password: this.password,
    };

    axios
      .post("http://localhost:8080/api/v1/authenticate", data)
      .then((res) => {
        sessionStorage.setItem("jwtToken", res.data.jwtToken)
        sessionStorage.setItem("usernameStaff", data.username);

        // localStorage.setItem("jwtToken", res.data.jwtToken);
        // localStorage.setItem("usernameStaff", data.username);
        const headers = {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: "Bearer " + sessionStorage.getItem("jwtToken"),
        };

        axios
          .get(
            "http://localhost:8080/api/v1/accounts/viewdetail/" + this.username,
            { headers: headers }
          )
          .then((res) => {
            sessionStorage.setItem("infor", JSON.stringify(res.data));
            sessionStorage.setItem('roleLogin', res.data.roleId)
            sessionStorage.setItem('phone', '')

            // localStorage.setItem("infor", JSON.stringify(res.data));
            if (res.data.roleId === 1) {
              this.props.history.push("/admin/staff");
            }
            else if (res.data.roleId === 2 && res.data.active == true) {
              this.props.history.push("/staff/workingSchedule");
            } else {
              Swal.fire({
                title: "Thất bại",
                text: "Tài khoản không có quyền hoặc bị khóa!",
                icon: "warning",
              }).then(() => {
                return false;
              })
            }
          })
          .catch((err) => {
            console.log(headers);
          });
      })
      .catch((err) => {
        Swal.fire({
          title: "Thất bại",
          text: "Sai tài khoản hoặc mật khẩu",
          icon: "warning",
        }).then(() => {
          return false;
        })
      });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div style={{overflow: "hidden"}}>
          <GridContainer>
            {/* <GridItem md={0.5} /> */}
            <GridItem xs={12} sm={12} md={8} style={{backgroundImage: "url(assets/img/bgr.jpg)"}}>
              <img src={bgr} xs={12} sm={12} md={12} style={{  opacity: "0.6", filter: "alpha(opacity=40)", width: "100%"}} />
            </GridItem>
            <GridItem md={0.5} />
            <GridItem xs={12} sm={12} md={3} style={{ marginTop: "15%" }}>
              <Card>
                <CardAvatar profile style={{ marginBottom: "30px" }}>
                  <img src={login} ></img>
                </CardAvatar>
                <CardBody profile>
                  <GridContainer>
                    <GridItem md={2} />
                    <GridItem xs={12} sm={12} md={8}>
                      <TextField
                        inputProps={{ minLength: 5, maxLength: 20 }}
                        placeholder="Tên đăng nhập"
                        id="username"
                        value={this.username}
                        fullWidth={true}
                        required
                        onChange={(e) => (this.username = e.target.value)}
                      />
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem md={2} />
                    <GridItem xs={12} sm={12} md={8}>
                      <TextField
                        placeholder="Mật khẩu"
                        type="password"
                        value={this.password}
                        fullWidth={true}
                        required
                        onChange={(e) => (this.password = e.target.value)}
                      />
                    </GridItem>
                  </GridContainer>
                </CardBody>
                <CardFooter>
                  <Button
                    color="primary"
                    round
                    type="submit"
                    style={{ margin: "auto" }}
                  >
                    Đăng nhập
                  </Button>
                </CardFooter>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
      </form >
    );
  }
}

export default Login;

