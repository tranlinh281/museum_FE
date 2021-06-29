import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { GridList, GridListTile, Checkbox } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        width: '100%',
        height: '100%',
        maxHeight: 300
    },
    gridTitle: {
        fontSize: '1.5em'
    },
}));


export default function GridListCheckboxBooking(props) {
    const classes = useStyles();
    const { label, nameCheckbox, items, height, size, color, handleChange, maxheight, ...rest } = props;
    return (
        <div className={classes.root} >
            <p className={classes.gridTitle}>{label}</p>
            <GridList cellHeight={height} className={classes.gridList} cols={1}>
                {items.map((val, index) => (
                    <GridListTile key={index} rows={1} >
                        <Checkbox
                            id={index}
                            size={size}
                            color={color}
                            name={nameCheckbox}
                            value={val.topicId}
                            onChange={handleChange}
                        />
                        <label for={index}>{val.topicName} ({val.startTime + " - " + val.endTime})</label>
                    </GridListTile>
                ))}
            </GridList>
        </div>
    );
}

GridListCheckboxBooking.propTypes = {
    label: PropTypes.string,
    nameCheckbox: PropTypes.string,
    size: PropTypes.oneOf(["small", "medium"]),
    color: PropTypes.oneOf([
        "primary",
        "info",
        "success",
        "warning",
        "danger",
        "rose",
        "white",
        "transparent"
    ]),
    handleChange: PropTypes.func
};