import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { Link, withRouter } from "react-router-dom";
import { AppContext } from "../../contexts/Context";
import Helmet from "../Helmet";
import { WithTranslation, withTranslation } from "react-i18next";
import { RouteComponentProps } from "react-router";
import { sellerPath } from "../../utils/RouteUtil";

interface IProps {
  t: (key: string) => string;
  classes: any;
}

class Error404 extends React.Component<
  IProps & RouteComponentProps & WithTranslation,
  Readonly<any>
> {
  render() {
    const { classes, t } = this.props;

    return (
      <AppContext.Consumer>
        {context => (
          <React.Fragment>
            <Helmet title={t('page not found')} />
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
              className={classes.cardContainer}
            >
              <Grid item xs={10} sm={8} md={6} lg={5} xl={4}>
                <Card className={classes.card}>
                  <CardContent>
                    <Typography variant="h5" component="h2">
                      {t('page not found')}
                    </Typography>
                    <br />
                    <Typography component="p">
                      {t("we can't find the page you're looking for.")}
                    </Typography>
                  </CardContent>
                  <Grid container justify="flex-end">
                    <CardActions>
                      <Button
                        size="small"
                        {...({
                          component: Link,
                          to: sellerPath('dashboard')
                        } as any)}
                        color="primary"
                      >
                        {t('back to dashboard')}
                      </Button>
                    </CardActions>
                  </Grid>
                </Card>
              </Grid>
            </Grid>
          </React.Fragment>
        )}
      </AppContext.Consumer>
    );
  }
}

export default withStyles(theme => ({
  root: {},
  cardContainer: {
    minHeight: '50vh'
  },
  card: {
    // marginTop: theme.spacing(5),
  }
}))(withTranslation()(withRouter(Error404)));
