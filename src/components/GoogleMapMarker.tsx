import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles/index';
import LocationOn from '@material-ui/icons/LocationOn';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { StyledComponentProps } from '@material-ui/core/styles/withStyles';
import { RouteComponentProps } from 'react-router';

interface IProps {
  lat: number;
  lng: number;
}

class GoogleMapMarker extends React.Component<
  IProps & StyledComponentProps & RouteComponentProps,
  Readonly<any>
> {
  render() {
    let classes = this.props.classes || {};
    return (
      <Grid container className={classes.root}>
        <Grid item>
          <LocationOn color="primary" className={classes.icon} />
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(theme => ({
  root: {
    position: 'absolute',
    left: -24 / 2,
    top: -48 / 2
  },
  icon: {
    fontSize: '2rem'
  }
}))(withRouter(GoogleMapMarker));
