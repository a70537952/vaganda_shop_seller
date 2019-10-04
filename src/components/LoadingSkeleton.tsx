import React from "react";
import Skeleton from "@material-ui/lab/Skeleton";
import { Grid } from "@material-ui/core";

export default function LoadingSkeleton() {

  return <Grid container spacing={1}>
    <Grid item xs={6}>
      <Skeleton variant={"rect"} height={25}/>
    </Grid>
    <Grid item xs={8}>
      <Skeleton variant={"rect"} height={25}/>
    </Grid>
    <Grid item xs={12}>
      <Skeleton variant={"rect"} height={300}/>
    </Grid>
    <Grid item xs={7}>
      <Skeleton variant={"rect"} height={25}/>
    </Grid>
    <Grid container item xs={12} justify={'flex-end'} spacing={1}>
      <Grid item xs={2} md={1}>
        <Skeleton variant={"rect"} height={40}/>
      </Grid>
      <Grid item xs={2} md={1}>
        <Skeleton variant={"rect"} height={40}/>
      </Grid>
    </Grid>
  </Grid>;
}