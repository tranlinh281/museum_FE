import React, { useEffect } from "react";
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Hidden from "@material-ui/core/Hidden";
import Poppers from "@material-ui/core/Popper";
// @material-ui/icons
import Notifications from "@material-ui/icons/Notifications";
// core components
import Button from "components/CustomButtons/Button.js";
import './style.css'
import styles from "assets/jss/material-dashboard-react/components/headerLinksStyle.js";
import { createBrowserHistory } from "history";
import Axios from "axios";
import { ExitToApp } from "@material-ui/icons";

const useStyles = makeStyles(styles);

export default function AdminNavbarLinks() {

  const classes = useStyles();
  const [openNotification, setOpenNotification] = React.useState(null);
  const [openProfile, setOpenProfile] = React.useState(null);
  const [infor, setInfor] = React.useState({})
  const [listNoti, setListNoti] = React.useState([])
  const [notiUnread, setNotiUnread] = React.useState([])
  var notiUnreadTmp = 0;
  const [state, setState] = React.useState([]);
  const [updateRead, setUpdateRead] = React.useState('')
  // var aMinuteLess = new Date( someDate.getTime() - 1000 * 60 );

  var BASE_URL = "http://localhost:8080"
  var userName = sessionStorage.getItem('usernameStaff')
  
  useEffect(() => {
    URL = BASE_URL + "/api/v1/accounts/viewdetail/" + userName;
    Axios.get(URL)
      .then(function (response) {
        const data = response.data
        setInfor(data);
      })

    Axios.get(BASE_URL + "/api/v1/firebase/getNotifications/" + userName)
      .then(function (response) {
        const notifications = response.data.map(key => {
          if (key.read == false) {
            notiUnreadTmp++;
          }
          return ({
            id: key.id,
            content: key.content,
            username: key.username,
            time: key.time,
            read: key.read
          })
        }
        )
        setNotiUnread(notiUnreadTmp);
        setListNoti(notifications);
        setUpdateRead()
      })
  },
    [userName]);

  const handleClickNotification = event => {
    if (openNotification && openNotification.contains(event.target)) {
      setOpenNotification(null);
    } else {
      setOpenNotification(event.currentTarget);
    }
  };

  const handleCloseNotification = () => {
    setOpenNotification(null);
  };

  const handleClickProfile = event => {
    if (openProfile && openProfile.contains(event.target)) {
      setOpenProfile(null);
    } else {
      setOpenProfile(event.currentTarget);
    }
  };

  const handleCloseProfile = () => {

  };

  async function readNotiHandle(notiId) {
    await Axios.post(BASE_URL + "/api/v1/firebase/readNotification/" + notiId)
      .then(res => {
        Axios.get(BASE_URL + "/api/v1/firebase/getNotifications/" + userName)
          .then(function (response) {
            const notifications = response.data.map(key => {
              if (key.read == false) {
                notiUnreadTmp++;
              }
              return ({
                id: key.id,
                content: key.content,
                username: key.username,
                time: key.time,
                read: key.read
              })
            }
            )
            setNotiUnread(notiUnreadTmp);
            setListNoti(notifications);
          })
      })
  }

  const hist = createBrowserHistory();

  async function logoutHandle() {
    sessionStorage.removeItem('jwtToken')
    sessionStorage.removeItem('phone')
    
    sessionStorage.removeItem('infor')
    var usernameStaff = sessionStorage.getItem("usernameStaff");
    await deleteToken(usernameStaff);
    sessionStorage.removeItem('usernameStaff')
    hist.push('/login')
    window.location.reload();
  }

  async function deleteToken(usernameStaff) {
    var fetchData = await fetch('http://localhost:8080/api/v1/firebase/update-null-noti?username=' + usernameStaff, 
    {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json, text/plain, /",
      },
    })
  }

  const renderNotification = () => {
    let codeData = listNoti.map((e, index) => {
      var show;
      if (e.read == true) {
        show = <li >
          <p style={{padding: "0", margin: "0"}}>{e.content}</p>
          <p style={{fontSize: ".7rem", marginLeft: "5px", padding: "0", marginTop: "5px"}}>{e.time}</p>
        </li>
      } else {
        show = <li style={{fontWeight: "bold",backgroundColor: "gainsboro"}}>
          <p>{e.content}</p>
          <p>{e.time}</p>
        </li>
      }

      return (
        <p style={{backgroundColor: "gainsboro"}}
          key={index}
          onClick={() => {
            setNotiUnread(notiUnread);
            readNotiHandle(e.id)
            setOpenNotification(null)
          }}
          className={classes.dropdownItem}
          value={show}
        >
          {show}
        </p>
      )
    });
    return (
      <>
        {codeData}

      </>
    )
  }

  return (
    <div>
      <div className={classes.manager}>
        <Button
          color={window.innerWidth > 959 ? "transparent" : "white"}
          justIcon={window.innerWidth > 959}
          simple={!(window.innerWidth > 959)}
          aria-owns={openNotification ? "notification-menu-list-grow" : null}
          aria-haspopup="true"
          onClick={handleClickNotification}
          className={classes.buttonLink}
        >
          <Notifications className={classes.icons} style={{ width: "30px", height: "35px", paddingTop: "2px" }} />
          {/* số lượng noti */}
          <span className={classes.notifications}>{notiUnread}</span>

          <Hidden mdUp implementation="css">
            <p onClick={handleCloseNotification} className={classes.linkText}>
              Thông báo
            </p>
          </Hidden>
        </Button>
        <Poppers style={{ top: "3px", overflowY: "scroll", overflow: "auto", maxHeight: "50vh", maxWidth: "500px" }} id="style-1"
          modifiers={{
            flip: {
              enabled: true,
            },
            preventOverflow: {
              enabled: true,
              boundariesElement: 'scrollParent',
            },

          }}
          open={Boolean(openNotification)}
          anchorEl={openNotification}
          transition
          disablePortal
          className={
            classNames({ [classes.popperClose]: !openNotification }) +
            " " +
            classes.popperNav
          }
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id="notification-menu-list-grow"
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom"
              }}
            >
              <Paper >
                {/* hiển thị thông tin noti */}
                <ClickAwayListener onClickAway={handleCloseNotification}>
                  {/* <InfiniteList state={state} setState={setState}/> */}
                  <MenuList role="menu" tabIndex="1000" styles={{ width: "30px", height: "20px",backgroundColor: "gainsboro"}}>
                    {renderNotification()}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Poppers>
      </div>

      <div className={classes.manager}>
        <Button
          color={window.innerWidth > 959 ? "transparent" : "white"}
          justIcon={window.innerWidth > 959}
          simple={!(window.innerWidth > 959)}
          aria-owns={openProfile ? "profile-menu-list-grow" : null}
          aria-haspopup="true"
          onClick={handleClickProfile}
          className={classes.buttonLink}
        >
          <ExitToApp className={classes.icons} style={{ width: "30px", height: "35px", paddingTop: "2px" }} />
          <Hidden mdUp implementation="css">
            <p className={classes.linkText}>Đăng xuất</p>
          </Hidden>
        </Button>
        <Poppers
          open={Boolean(openProfile)}
          anchorEl={openProfile}
          transition
          disablePortal
          className={
            classNames({ [classes.popperClose]: !openProfile }) +
            " " +
            classes.popperNav
          }
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id="profile-menu-list-grow"
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom"
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleCloseProfile}>
                  <MenuList role="menu">
                    <MenuItem
                      onClick={logoutHandle}
                      className={classes.dropdownItem}
                    >
                      Đăng xuất
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Poppers>
      </div>

    </div>
  );
}
