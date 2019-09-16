import { withStyles } from '@material-ui/core/styles/index';
import React, { ErrorInfo } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Link, withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { RouteComponentProps } from 'react-router';
import { homePath } from '../../utils/RouteUtil';

interface IProps {
  t: (key: string) => string;
  classes: any;
  isOpen: boolean;
  toggle: () => void;
}

interface IState {
  hasError: boolean;
  error?: Error;
  info?: ErrorInfo;
}

class ErrorBoundary extends React.Component<
  IProps & RouteComponentProps & WithTranslation & any,
  IState
> {
  constructor(props: IProps & RouteComponentProps & WithTranslation) {
    super(props);
    this.state = {
      hasError: false,
      error: undefined,
      info: undefined
    };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // You can also log the error to an error reporting service
    this.setState({
      error: error,
      info: info
    });
  }

  render() {
    const { classes, t } = this.props;

    if (this.state.hasError) {
      return (
        <Grid
          container
          item
          direction="row"
          justify="center"
          alignItems="center"
          className={classes.cardContainer}
          xs={12}
        >
          <Grid item xs={10} sm={8} md={6} lg={5} xl={4}>
            <Card className={classes.card}>
              <CardContent>
                <Typography variant="h5" component="h2">
                  {t('something went wrong.')}
                </Typography>
                <br />
                <Typography component="p" gutterBottom paragraph>
                  {t('please contact us with the following error message')}:
                </Typography>
                <Typography component="h6" className={classes.errorMessage}>
                  {this.state.error && this.state.error.message}
                </Typography>
                <Typography component="h6" className={classes.errorMessage}>
                  error occur url: {window.location.href}
                </Typography>
              </CardContent>
              <Grid container justify="flex-end">
                <CardActions>
                  <Button
                    size="small"
                    {...({ component: Link, to: homePath('home') } as any)}
                    color="primary"
                  >
                    {t('back to home')}
                  </Button>
                </CardActions>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      );
    }

    return this.props.children;
  }
}

export default withStyles(theme => ({
  cardContainer: {
    minHeight: '50vh'
  },
  errorMessage: {
    fontStyle: 'italic',
    color: 'red'
  }
}))(withTranslation()(withRouter(ErrorBoundary))) as any;
