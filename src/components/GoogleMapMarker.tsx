import Grid from '@material-ui/core/Grid';
import {makeStyles, Theme} from '@material-ui/core/styles/index';
import LocationOn from '@material-ui/icons/LocationOn';
import React from 'react';

interface IProps {
    lat: number;
    lng: number;
}

const useStyles = makeStyles({
    root: {
        position: 'absolute',
        left: -24 / 2,
        top: -48 / 2
    },
    icon: {
        fontSize: '2rem'
    }
});

export default function GoogleMapMarker(props: IProps) {
    const classes = useStyles();

    return <Grid container className={classes.root}>
        <Grid item>
            <LocationOn color="primary" className={classes.icon}/>
        </Grid>
    </Grid>;
}