import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { sellerPath } from "../../utils/RouteUtil";
import Helmet from "./Helmet";


const useStyles = makeStyles({
  cardContainer: {
    minHeight: "50vh"
  }
});

export default function Error404() {
  const classes = useStyles();
  const { t } = useTranslation();

  return <React.Fragment>
    <Helmet title={t("page not found")}/>
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
      className={classes.cardContainer}
    >
      <Grid item xs={10} sm={8} md={6} lg={5} xl={4}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2">
              {t("page not found")}
            </Typography>
            <br/>
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
                  to: sellerPath("dashboard")
                } as any)}
                color="primary"
              >
                {t("back to dashboard")}
              </Button>
            </CardActions>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  </React.Fragment>;
}
