import Grid from '@material-ui/core/Grid';
import Modal from '../../_modal/Modal';
import { withStyles } from '@material-ui/core/styles/index';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { AppContext } from '../../../contexts/home/Context';
import { RouteComponentProps } from 'react-router';
import { Mutation, withApollo, WithApolloClient } from 'react-apollo';
import FormUtil from '../../../utils/FormUtil';
import update from 'immutability-helper';
import gql from 'graphql-tag';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Skeleton from '@material-ui/lab/Skeleton';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import UploadImageMutation from '../../UploadImageMutation';
import FormHelperText from '@material-ui/core/FormHelperText';
import RemovableImage from '../../RemovableImage';
import Image from '../../Image';
import AddIcon from '@material-ui/icons/Add';
import StarRating from '../../_rating/StarRating';
import DefaultImage from '../../../image/default-image.jpg';

let addUserOrderDetailCommentFields: any;
let t: any;

interface IProps {
  userOrderDetailId: string;
  t: (key: string) => string;
  classes: any;
  isOpen: boolean;
  toggle: () => void;
}

interface IState {
  isCloseDialogOpen: boolean;
  dataLoaded: boolean;
  userOrderDetail: any;
  addUserOrderDetailComment: any;
}

class ModalAddUserOrderDetailComment extends React.Component<
  IProps &
    RouteComponentProps &
    WithTranslation &
    WithSnackbarProps &
    WithApolloClient<IProps>,
  IState
> {
  constructor(
    props: IProps &
      RouteComponentProps &
      WithTranslation &
      WithSnackbarProps &
      WithApolloClient<IProps>
  ) {
    super(props);

    t = this.props.t;

    addUserOrderDetailCommentFields = [
      {
        field: 'comment',
        isCheckEmpty: true,
        emptyMessage: t('please enter comment'),
        value: ''
      },
      {
        field: 'star',
        isCheckEmpty: true,
        emptyMessage: t('please rate your star'),
        value: 0
      },
      {
        field: 'uploadedImages',
        value: []
      }
    ];

    this.state = {
      isCloseDialogOpen: false,
      dataLoaded: false,
      userOrderDetail: null,
      addUserOrderDetailComment: {
        ...FormUtil.generateFieldsState(addUserOrderDetailCommentFields),
        uploadingImageCount: 0
      }
    };
  }

  async componentDidMount() {
    await this.getUserOrderDetailData();
  }

  async getUserOrderDetailData() {
    await this.setState(
      update(this.state, {
        dataLoaded: { $set: false }
      })
    );

    let { data } = await this.props.client.query({
      query: gql`
        query userOrderDetail($id: ID) {
          userOrderDetail(id: $id) {
            items {
              id
              user_id
              product_title
              product_type_title
              is_commented
            }
          }
        }
      `,
      variables: {
        id: this.props.userOrderDetailId
      }
    });

    let userOrderDetail = data.userOrderDetail.items[0];
    this.setState(
      update(this.state, {
        dataLoaded: { $set: true },
        userOrderDetail: { $set: userOrderDetail },
        addUserOrderDetailComment: {
          comment: { value: { $set: '' } },
          star: { value: { $set: 0 } },
          uploadedImages: { value: { $set: [] } }
        }
      })
    );
  }

  async componentDidUpdate(prevProps: IProps, prevState: IState) {
    if (
      this.props.userOrderDetailId &&
      prevProps.userOrderDetailId !== this.props.userOrderDetailId
    ) {
      this.getUserOrderDetailData();
    }
  }

  handleCancelCloseDialog() {
    this.setState(
      update(this.state, {
        isCloseDialogOpen: { $set: false }
      })
    );
  }

  async handleOkCloseDialog() {
    await this.setState(
      update(this.state, {
        isCloseDialogOpen: { $set: false }
      })
    );
    await this.props.toggle();
  }

  toggleCloseDialog() {
    this.setState(
      update(this.state, {
        isCloseDialogOpen: { $set: true }
      })
    );
  }

  async addUserOrderDetailCommentCompletedHandler(data: any) {
    await this.props.enqueueSnackbar(t('rate product successfully'));
    await this.handleOkCloseDialog();
  }

  async addUserOrderDetailCommentErrorHandler(error: any) {
    await this.checkAddUserOrderDetailCommentForm(error);
  }

  async checkAddUserOrderDetailCommentForm(error?: any) {
    let {
      errorStateObj: emptyErrorStateObj,
      isValid: emptyIsValid
    } = FormUtil.generateFieldsEmptyError(
      addUserOrderDetailCommentFields,
      this.state.addUserOrderDetailComment
    );

    let {
      errorStateObj: validationErrorStateObj,
      isValid: validationIsValid
    } = FormUtil.validationErrorHandler(addUserOrderDetailCommentFields, error);

    let isValid = true;

    await this.setState(
      update(this.state, {
        addUserOrderDetailComment: {
          ...emptyErrorStateObj
        }
      })
    );

    if (this.state.addUserOrderDetailComment.star.value === 0) {
      isValid = false;
      await this.setState(
        update(this.state, {
          addUserOrderDetailComment: {
            star: {
              feedback: { $set: t('please rate star') },
              is_valid: { $set: false }
            }
          }
        })
      );
    }

    isValid = emptyIsValid && isValid;

    if (error) {
      await this.setState(
        update(this.state, {
          addUserOrderDetailComment: {
            ...validationErrorStateObj
          }
        })
      );
      isValid = validationIsValid && isValid;
    }

    if (await this.isCommentImageUploading()) {
      isValid = false;
    }

    return isValid;
  }

  isCommentImageUploading() {
    if (this.state.addUserOrderDetailComment.uploadingImageCount > 0) {
      this.props.enqueueSnackbar(
        t('please wait until the upload image complete')
      );
      return true;
    }
    return false;
  }

  async addUserOrderDetailComment(addUserOrderDetailCommentMutation: any) {
    if (await this.checkAddUserOrderDetailCommentForm()) {
      addUserOrderDetailCommentMutation({
        variables: {
          userOrderDetailId: this.props.userOrderDetailId,
          comment: this.state.addUserOrderDetailComment.comment.value,
          star: this.state.addUserOrderDetailComment.star.value,
          commentImages: this.state.addUserOrderDetailComment.uploadedImages.value.map(
            (uploadedImage: any) => uploadedImage.path
          )
        }
      });
    }
  }

  uploadProductImage(images: any, uploadImageMutation: any) {
    if (images.length > 0) {
      this.setState(
        update(this.state, {
          addUserOrderDetailComment: {
            uploadingImageCount: {
              $set:
                this.state.addUserOrderDetailComment.uploadingImageCount +
                images.length
            }
          }
        })
      );
      Array.prototype.forEach.call(images, (image: any) => {
        uploadImageMutation({
          variables: {
            images: [image]
          }
        });
      });
    }
  }

  uploadProductImageCompletedHandler(data: any) {
    let tempImageData = data.uploadImageMutation;
    this.setState(
      update(this.state, {
        addUserOrderDetailComment: {
          uploadingImageCount: {
            $set:
              this.state.addUserOrderDetailComment.uploadingImageCount -
              tempImageData.length
          },
          uploadedImages: { value: { $push: [tempImageData[0]] } }
        }
      })
    );
  }

  uploadProductImageErrorHandler(error: any) {
    this.setState(
      update(this.state, {
        addUserOrderDetailComment: {
          uploadingImageCount: {
            $set: this.state.addUserOrderDetailComment.uploadingImageCount - 1
          }
        }
      })
    );
    let errorMessage = FormUtil.getValidationErrorByField('images.0', error);
    this.props.enqueueSnackbar(errorMessage, {
      variant: 'error'
    });
  }

  removeUploadedProductImage(removeUploadedImage: any) {
    let removingIndex = this.state.addUserOrderDetailComment.uploadedImages.value.findIndex(
      (uploadedImage: any) => {
        return removeUploadedImage.id === uploadedImage.id;
      }
    );
    this.setState(
      update(this.state, {
        addUserOrderDetailComment: {
          uploadedImages: { value: { $splice: [[removingIndex, 1]] } }
        }
      })
    );
  }

  render() {
    let { userOrderDetail } = this.state;
    const { classes, t, toggle, isOpen } = this.props;

    let productImageUrl: string =
      userOrderDetail &&
      userOrderDetail.product &&
      userOrderDetail.product.product_image.length
        ? userOrderDetail.product.product_image[0].image_medium
        : DefaultImage;

    return (
      <AppContext.Consumer>
        {context => (
          <React.Fragment>
            <Dialog
              maxWidth="sm"
              open={this.state.isCloseDialogOpen}
              onClose={this.handleCancelCloseDialog.bind(this)}
            >
              <DialogTitle>{t('cancel rate product')}</DialogTitle>
              <DialogContent>
                {t('are you sure cancel rate product?')}
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={this.handleCancelCloseDialog.bind(this)}
                  color="primary"
                >
                  {t('cancel')}
                </Button>
                <Button
                  onClick={this.handleOkCloseDialog.bind(this)}
                  color="primary"
                >
                  {t('ok')}
                </Button>
              </DialogActions>
            </Dialog>
            <Modal
              open={isOpen}
              onClose={() => {
                this.toggleCloseDialog();
              }}
              fullWidth
            >
              <Grid
                container
                direction="row"
                item
                xs={12}
                spacing={2}
                className={classes.content}
              >
                {this.state.dataLoaded ? (
                  <>
                    <Grid item xs={12}>
                      <Typography variant="h6" color="inherit">
                        {t('rate product')}
                      </Typography>
                    </Grid>
                    <Grid container item xs={12} spacing={1}>
                      <Grid item>
                        <Image
                          className={classes.productImage}
                          useLazyLoad
                          alt={userOrderDetail.product_title}
                          src={productImageUrl}
                        />
                      </Grid>
                      <Grid item>
                        <Typography variant="subtitle1" display="inline">
                          {this.state.userOrderDetail.product_title}
                        </Typography>
                        <Typography variant="subtitle2">
                          {t('variation')}:{' '}
                          {this.state.userOrderDetail.product_type_title}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container item xs={12}>
                      <Typography variant="subtitle1">
                        {t('star count')}
                      </Typography>
                    </Grid>
                    <Grid container item xs={12} justify={'center'}>
                      <FormControl margin="none">
                        <StarRating
                          size={'large'}
                          value={
                            this.state.addUserOrderDetailComment.star.value
                          }
                          onChange={(
                            event: React.ChangeEvent<{}>,
                            value: number
                          ) => {
                            this.setState(
                              update(this.state, {
                                addUserOrderDetailComment: {
                                  star: { value: { $set: value } }
                                }
                              })
                            );
                          }}
                        />
                        {this.state.addUserOrderDetailComment.star.feedback && (
                          <FormHelperText error>
                            {this.state.addUserOrderDetailComment.star.feedback}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required={
                          this.state.addUserOrderDetailComment.comment.value
                        }
                        error={
                          !this.state.addUserOrderDetailComment.comment.is_valid
                        }
                        label={t('your comment')}
                        value={
                          this.state.addUserOrderDetailComment.comment.value
                        }
                        onChange={(e: { target: { value: any } }) => {
                          this.setState(
                            update(this.state, {
                              addUserOrderDetailComment: {
                                comment: { value: { $set: e.target.value } }
                              }
                            })
                          );
                        }}
                        helperText={
                          this.state.addUserOrderDetailComment.comment.feedback
                        }
                        margin="normal"
                        disabled={
                          this.state.addUserOrderDetailComment.comment.disabled
                        }
                        fullWidth
                        multiline
                        rows={5}
                        rowsMax={6}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl margin="normal">
                        <UploadImageMutation
                          onCompleted={this.uploadProductImageCompletedHandler.bind(
                            this
                          )}
                          onError={this.uploadProductImageErrorHandler.bind(
                            this
                          )}
                          uploadImage={this.uploadProductImage.bind(this)}
                          multiple
                          id={'uploadCommentImage'}
                          className={classes.inputUpload}
                        />
                        <label htmlFor="uploadCommentImage">
                          <Button
                            variant="outlined"
                            color="primary"
                            component={'span'}
                          >
                            <AddIcon fontSize={'small'} color="primary" />
                            {t('image')}
                          </Button>
                        </label>
                        {this.state.addUserOrderDetailComment.uploadedImages
                          .feedback && (
                          <FormHelperText error>
                            {
                              this.state.addUserOrderDetailComment
                                .uploadedImages.feedback
                            }
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid container item spacing={1} xs={12}>
                      {this.state.addUserOrderDetailComment.uploadedImages.value.map(
                        (uploadedImage: any) => (
                          <Grid
                            key={uploadedImage.id}
                            item
                            xs={6}
                            sm={4}
                            md={3}
                            lg={3}
                          >
                            <RemovableImage
                              className={classes.commentImage}
                              remove={this.removeUploadedProductImage.bind(
                                this,
                                uploadedImage
                              )}
                              src={uploadedImage.image_medium}
                            />
                          </Grid>
                        )
                      )}

                      {new Array(
                        this.state.addUserOrderDetailComment.uploadingImageCount
                      )
                        .fill(6)
                        .map((ele, index) => {
                          return (
                            <Grid key={ele} item xs={12} sm={6} md={6} lg={4}>
                              <Skeleton variant={'rect'} height={150} />
                            </Grid>
                          );
                        })}
                    </Grid>
                    <Grid
                      container
                      item
                      justify="flex-end"
                      xs={12}
                      spacing={1}
                      className={classes.actionButtonContainer}
                    >
                      <Grid item>
                        <Button
                          onClick={this.toggleCloseDialog.bind(this)}
                          color="primary"
                        >
                          {t('cancel')}
                        </Button>
                      </Grid>
                      <Grid item>
                        <Mutation
                          mutation={gql`
                            mutation AddUserOrderDetailCommentMutation(
                              $userOrderDetailId: String!
                              $comment: String!
                              $star: Int!
                              $commentImages: [String]
                            ) {
                              addUserOrderDetailCommentMutation(
                                userOrderDetailId: $userOrderDetailId
                                comment: $comment
                                star: $star
                                commentImages: $commentImages
                              ) {
                                id
                                is_commented
                                order_detail_comment {
                                  id
                                  comment
                                  star
                                  user_order_detail_comment_image {
                                    id
                                    path
                                    image_medium
                                    image_original
                                  }
                                }
                              }
                            }
                          `}
                          onCompleted={data => {
                            this.addUserOrderDetailCommentCompletedHandler.bind(
                              this
                            )(data);
                          }}
                          onError={error => {
                            this.addUserOrderDetailCommentErrorHandler.bind(
                              this
                            )(error);
                          }}
                        >
                          {(
                            addUserOrderDetailCommentMutation,
                            { data, loading, error }
                          ) => {
                            if (loading) {
                              return (
                                <Button
                                  disabled
                                  variant="contained"
                                  color="primary"
                                >
                                  {t('submitting...')}
                                </Button>
                              );
                            }

                            return (
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                  this.addUserOrderDetailComment(
                                    addUserOrderDetailCommentMutation
                                  );
                                }}
                              >
                                {t('submit')}
                              </Button>
                            );
                          }}
                        </Mutation>
                      </Grid>
                    </Grid>
                  </>
                ) : (
                  <React.Fragment>
                    {new Array(4).fill(6).map((ele, index) => {
                      return (
                        <Grid key={index} item xs={12}>
                          <Skeleton variant={'rect'} height={50} />
                        </Grid>
                      );
                    })}
                  </React.Fragment>
                )}
              </Grid>
            </Modal>
          </React.Fragment>
        )}
      </AppContext.Consumer>
    );
  }
}

export default withStyles(theme => ({
  productImage: {
    height: '100px',
    width: '140px'
  },
  commentImage: {
    height: '100px',
    width: '140px'
  },
  inputUpload: {
    display: 'none'
  },
  content: {
    margin: 0
  }
}))(
  withSnackbar(
    withTranslation()(withRouter(withApollo(ModalAddUserOrderDetailComment)))
  )
);
