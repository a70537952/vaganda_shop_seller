import { Theme } from '@material-ui/core/styles';
import React from 'react';
import Rating, { RatingProps } from '@material-ui/lab/Rating';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'inline-flex',
    color: theme.palette.primary.main
  }
}));

export default function StarRating(props: RatingProps) {
  const classes = useStyles();
  let { onChange, value, size, readOnly, precision } = props;

  return (
    <Rating
      classes={{ root: classes.root }}
      size={size}
      value={value}
      onChange={onChange}
      precision={precision}
      readOnly={readOnly}
    />
  );
}
