import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import { StyledComponentProps } from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import { WithTranslation, withTranslation } from 'react-i18next';
import UserAvatar from '../../UserAvatar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import LocaleMoment from '../../LocaleMoment';
import Skeleton from '@material-ui/lab/Skeleton';
import ImagesCarousel from '../../ImagesCarousel';
import update from 'immutability-helper';
import Image from '../../Image';
import { WithSnackbarProps } from 'notistack';
import StarRating from '../../_rating/StarRating';

interface IProps extends StyledComponentProps {
  classes: any;
  userOrderDetailComment?: any;
  className?: string;
  loading?: boolean;
}

interface IState {
  lightbox: {
    isOpen: boolean;
    imgSrc: string;
    currentIndex: number;
  };
}

class UserOrderDetailCommentCard extends React.Component<
  IProps & WithTranslation,
  IState
> {
  constructor(props: IProps & WithTranslation) {
    super(props);
    this.state = {
      lightbox: {
        isOpen: false,
        imgSrc: '',
        currentIndex: 0
      }
    };
  }

  render() {
    let { classes, className, userOrderDetailComment, t, loading } = this.props;

    return (
      <Paper className={classes.userOrderDetailCommentCard} elevation={0}>
        <Grid container item spacing={1}>
          {loading ? (
            <Grid item xs={12}>
              <Skeleton variant={'rect'} height={80} />
            </Grid>
          ) : (
            <Grid container item alignItems={'center'}>
              <div className={classes.userAvatarContainer}>
                <UserAvatar
                  user={userOrderDetailComment.user}
                  className={classes.avatar}
                />
              </div>
              <div className={classes.commentInfoContainer}>
                <Typography component="p" variant="subtitle1" color="inherit">
                  {userOrderDetailComment.user.name}
                </Typography>
                <StarRating
                  size={'small'}
                  value={userOrderDetailComment.star}
                  readOnly
                />
                <Typography component="p" variant="subtitle2" color="inherit">
                  {t('variation')}:{' '}
                  {userOrderDetailComment.user_order_detail.product_type_title}
                </Typography>
              </div>
            </Grid>
          )}
          {loading ? (
            <Grid item xs={12}>
              <Skeleton height={100} />
            </Grid>
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1" color="inherit">
                {userOrderDetailComment.comment}
              </Typography>
            </Grid>
          )}
          {!loading && (
            <Grid item xs={12}>
              {Boolean(
                userOrderDetailComment.user_order_detail_comment_image.length
              ) && (
                <Grid container item xs={12} spacing={1}>
                  <ImagesCarousel
                    currentIndex={this.state.lightbox.currentIndex}
                    onClose={() => {
                      this.setState(
                        update(this.state, {
                          lightbox: {
                            isOpen: { $set: !this.state.lightbox.isOpen }
                          }
                        })
                      );
                    }}
                    views={userOrderDetailComment.user_order_detail_comment_image.map(
                      (commentImage: any) => ({
                        src: commentImage.image_original
                      })
                    )}
                    isOpen={this.state.lightbox.isOpen}
                  />
                  {userOrderDetailComment.user_order_detail_comment_image.map(
                    (commentImage: any, index: number) => (
                      <Grid key={commentImage.id} item>
                        <Image
                          src={commentImage.image_medium}
                          useLazyLoad
                          style={{ height: '65px' }}
                          alt={
                            userOrderDetailComment.user_order_detail
                              .product_type_title
                          }
                          onClick={() => {
                            this.setState(
                              update(this.state, {
                                lightbox: {
                                  isOpen: { $set: !this.state.lightbox.isOpen },
                                  currentIndex: { $set: index }
                                }
                              })
                            );
                          }}
                          className={'img pointer'}
                        />
                      </Grid>
                    )
                  )}
                </Grid>
              )}
            </Grid>
          )}
          {loading ? (
            <Grid container item xs={12} justify={'flex-end'}>
              <Skeleton height={20} width={150} />
            </Grid>
          ) : (
            <Grid container item xs={12} justify={'flex-end'}>
              <Typography variant="caption">
                <LocaleMoment showAll showTime>
                  {userOrderDetailComment.created_at}
                </LocaleMoment>
              </Typography>
            </Grid>
          )}
        </Grid>
      </Paper>
    );
  }
}

export default withStyles(theme => ({
  userOrderDetailCommentCard: {
    width: '100%',
    position: 'relative',
    padding: theme.spacing(1),
    borderBottom: '1px solid #ddd'
  },
  avatar: {
    width: 50,
    height: 50
  },
  userAvatarContainer: {
    display: 'inline-block'
  },
  commentInfoContainer: {
    display: 'inline-block',
    marginLeft: theme.spacing(2)
  }
}))(withTranslation()(UserOrderDetailCommentCard));
