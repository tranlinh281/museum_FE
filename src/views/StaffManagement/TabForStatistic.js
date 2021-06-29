import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import StatisticTopic from './StatisticTopic';
import Statistic from './Statistic';
import Button from 'components/CustomButtons/Button';
import { createBrowserHistory } from 'history';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `scrollable-auto-tab-${index}`,
        'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    indicator: {
        backgroundColor: 'white',
    },
}));

export default function ScrollableTabsButtonAuto() {
    if (sessionStorage.getItem('jwtToken') === null) {
        hist.push('/login')
        location.reload();
    } else {
        const classes = useStyles();
        const [value, setValue] = React.useState(0);

        const handleChange = (event, newValue) => {
            setValue(newValue);
        };

        const hist = createBrowserHistory();
        function logoutHandle() {
            sessionStorage.removeItem('jwtToken')
            sessionStorage.removeItem('phone')
            hist.push('/login')
            window.location.reload();
        }
        return (

            <div className={classes.root}>
                {/* <Button color="primary" style={{ float: 'right' }} onClick={logoutHandle}>Đăng xuất</Button> */}
                <AppBar position="static" color="primay" style={{ backgroundColor: "#9c27b0" }}>
                    <Tabs classes={{
                        indicator: classes.indicator
                    }}
                        value={value}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        // variant="scrollable"
                        scrollButtons="auto"
                        aria-label="scrollable auto tabs example"
                        centered
                    >
                        <Tab style={{ color: "white" }} label="Trạng thái đoàn" {...a11yProps(0)} />
                        <Tab style={{ color: "white" }} label="chuyên đề & sự kiện" {...a11yProps(1)} />
                    </Tabs>
                </AppBar>
                <TabPanel value={value} index={0}>
                    <Statistic />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <StatisticTopic />
                </TabPanel>
            </div>
        );
    }
}

