import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { AppContext } from '../../contexts/home/Context';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router';

let t;

interface IProps {
  classes: any;
  context: any;
}

interface IState {}

class Header extends React.Component<
  IProps & RouteComponentProps & WithTranslation,
  IState
> {
  constructor(props: IProps & RouteComponentProps & WithTranslation) {
    super(props);

    t = this.props.t;

    this.state = {};
  }

  render() {
    const { classes, t } = this.props;

    return (
      <AppContext.Consumer>
        {(context: any) => (
          <Grid container item className={classes.root}>
            <hr />
            <Grid container item>
              <Typography
                variant="caption"
                style={{ textTransform: 'capitalize' }}
              >
                ©&nbsp;{new Date().getFullYear()} {t('vaganda shop')}.&nbsp;
                {t('all rights reserved')}
              </Typography>
            </Grid>
          </Grid>
        )}
      </AppContext.Consumer>
    );
  }
}

export default withStyles(theme => ({
  root: {
    bottom: 0,
    color: 'grey',
    padding: '20px 30px'
  }
}))(withTranslation()(withRouter(Header)));
