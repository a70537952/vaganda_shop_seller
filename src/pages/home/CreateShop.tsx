import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import Stepper from '@material-ui/core/Stepper';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import update from 'immutability-helper';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import React from 'react';
import { Mutation, withApollo, WithApolloClient } from 'react-apollo';
import Geolocation from 'react-geolocation';
import { withRouter } from 'react-router-dom';
import Skeleton from '@material-ui/lab/Skeleton';
import CountryPhoneCodeSelect from '../../components/_select/CountryPhoneCodeSelect';
import CountrySelect from '../../components/_select/CountrySelect';
import CurrencySelect from '../../components/_select/CurrencySelect';
import GoogleMap from '../../components/GoogleMap';
import GoogleMapMarker from '../../components/GoogleMapMarker';
import HomeHelmet from '../../components/home/HomeHelmet';
import ShopCategorySelect from '../../components/_select/ShopCategorySelect';
import UploadImageMutation from '../../components/UploadImageMutation';
import { AppContext } from '../../contexts/home/Context';
import FormUtil from './../../utils/FormUtil';
import { WithTranslation, withTranslation } from 'react-i18next';
import gql from 'graphql-tag';
import { RouteComponentProps } from 'react-router';
import Image from '../../components/Image';

let shopSetupFields: any;
let shopInfoFields: any;
let shopAddressFields: any;
let shopContactFields: any;
let t: any;

interface IProps {
  classes: any;
}

interface IState {
  activeStep: number;
  steps: string[];
  currentSection: string;
  shopSetup: any;
  shopInfo: any;
  shopAddress: any;
  shopContact: any;
}

class CreateShop extends React.Component<
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

    shopSetupFields = [
      {
        field: 'name',
        validationField: 'shopSetupName',
        isCheckEmpty: true,
        emptyMessage: t('please enter shop name')
      },
      {
        field: 'shop_category',
        validationField: 'shopSetupShopCategory',
        isCheckEmpty: true,
        emptyMessage: t('please select shop category')
      },
      {
        field: 'shop_currency',
        validationField: 'shopSetupShopCurrency',
        value: 'MYR',
        isCheckEmpty: true,
        emptyMessage: t('please select shop currency')
      },
      {
        field: 'has_physical_shop',
        validationField: 'shopSetupHasPhysicalShop',
        value: true
      }
    ];

    shopInfoFields = [
      { field: 'summary', validationField: 'shopInfoSummary' },
      { field: 'logo', validationField: 'shopInfoLogo' },
      { field: 'banner', validationField: 'shopInfoBanner' }
    ];

    shopAddressFields = [
      {
        field: 'address_1',
        validationField: 'shopAddressAddress1',
        isCheckEmpty: true,
        emptyMessage: t('please enter shop address')
      },
      { field: 'address_2', validationField: 'shopAddressAddress2' },
      { field: 'address_3', validationField: 'shopAddressAddress3' },
      {
        field: 'city',
        validationField: 'shopAddressCity',
        isCheckEmpty: true,
        emptyMessage: t('please enter city')
      },
      {
        field: 'state',
        validationField: 'shopAddressState',
        isCheckEmpty: true,
        emptyMessage: t('please enter state')
      },
      {
        field: 'postal_code',
        validationField: 'shopAddressPostalCode',
        isCheckEmpty: true,
        emptyMessage: t('please enter postal code')
      },
      {
        field: 'country',
        validationField: 'shopAddressCountry',
        isCheckEmpty: true,
        emptyMessage: t('please select country')
      },
      {
        field: 'latitude',
        validationField: 'shopAddressLatitude',
        isCheckEmpty: true,
        emptyMessage: t('please mark your shop location')
      },
      {
        field: 'longitude',
        validationField: 'shopAddressLongitude',
        isCheckEmpty: true,
        emptyMessage: t('please mark your shop location')
      }
    ];

    shopContactFields = [
      {
        field: 'email',
        validationField: 'shopContactEmail',
        isCheckEmpty: true,
        emptyMessage: t('please enter shop email')
      },
      { field: 'website', validationField: 'shopContactWebsite' },
      {
        field: 'telephone_country_code',
        validationField: 'shopContactTelephoneCountryCode'
      },
      { field: 'telephone', validationField: 'shopContactTelephone' },
      {
        field: 'phone_country_code',
        validationField: 'shopContactPhoneCountryCode'
      },
      {
        field: 'phone',
        validationField: 'shopContactPhone',
        isCheckEmpty: true,
        emptyMessage: t('please enter shop phone')
      }
    ];

    this.state = {
      steps: ['shop setup', 'shop info', 'shop address', 'shop contact'],
      activeStep: 0,
      currentSection: 'setup',
      shopSetup: {
        ...FormUtil.generateFieldsState(shopSetupFields)
      },
      shopInfo: {
        ...FormUtil.generateFieldsState(shopInfoFields),
        uploadingLogoCount: 0,
        uploadingBannerCount: 0
      },
      shopAddress: {
        ...FormUtil.generateFieldsState(shopAddressFields)
      },
      shopContact: {
        ...FormUtil.generateFieldsState(shopContactFields)
      }
    };
  }

  setStep(step: string) {
    this.setState(
      update(this.state, {
        activeStep: { $set: this.state.steps.indexOf(step) }
      })
    );
  }

  async checkSectionSetupField(error?: any) {
    let {
      errorStateObj: emptyErrorStateObj,
      isValid: emptyIsValid
    } = FormUtil.generateFieldsEmptyError(
      shopSetupFields,
      this.state.shopSetup
    );

    let {
      errorStateObj: validationErrorStateObj,
      isValid: validationIsValid
    } = FormUtil.validationErrorHandler(shopSetupFields, error);

    let isValid = true;

    await this.setState(
      update(this.state, {
        shopSetup: {
          ...emptyErrorStateObj
        }
      })
    );
    isValid = emptyIsValid && isValid;

    if (error) {
      await this.setState(
        update(this.state, {
          shopSetup: {
            ...validationErrorStateObj
          }
        })
      );
      isValid = validationIsValid && isValid;
    }

    if (await this.isShopNameExist()) {
      await this.setState(
        update(this.state, {
          shopSetup: {
            name: {
              feedback: { $set: t('this shop name already been used') },
              is_valid: { $set: false }
            }
          }
        })
      );
      isValid = false;
    }

    if (!isValid) await this.setStep('shop setup');

    return isValid;
  }

  async checkSectionInfoField(error?: any) {
    let isValid = true;
    if (
      this.state.shopInfo.uploadingLogoCount > 0 ||
      this.state.shopInfo.uploadingBannerCount > 0
    ) {
      this.props.enqueueSnackbar(t('please wait until image upload complete'));
      isValid = false;
    }

    if (!isValid) await this.setStep('shop info');
    return isValid;
  }

  async checkSectionAddressField(error?: any) {
    if (!this.state.shopSetup.has_physical_shop.value) {
      return true;
    }
    let isValid = true;

    let {
      errorStateObj: emptyErrorStateObj,
      isValid: emptyIsValid
    } = FormUtil.generateFieldsEmptyError(
      shopAddressFields,
      this.state.shopAddress
    );

    let {
      errorStateObj: validationErrorStateObj,
      isValid: validationIsValid
    } = FormUtil.validationErrorHandler(shopAddressFields, error);

    await this.setState(
      update(this.state, {
        shopAddress: {
          ...emptyErrorStateObj
        }
      })
    );
    isValid = emptyIsValid && isValid;

    if (error) {
      await this.setState(
        update(this.state, {
          shopAddress: {
            ...validationErrorStateObj
          }
        })
      );
      isValid = validationIsValid && isValid;
    }

    if (!isValid) await this.setStep('shop address');
    return isValid;
  }

  async checkSectionContactField(error?: any) {
    let isValid = true;

    let {
      errorStateObj: emptyErrorStateObj,
      isValid: emptyIsValid
    } = FormUtil.generateFieldsEmptyError(
      shopContactFields,
      this.state.shopContact
    );

    let {
      errorStateObj: validationErrorStateObj,
      isValid: validationIsValid
    } = FormUtil.validationErrorHandler(shopContactFields, error);

    await this.setState(
      update(this.state, {
        shopContact: {
          ...emptyErrorStateObj
        }
      })
    );
    isValid = emptyIsValid && isValid;

    if (error) {
      await this.setState(
        update(this.state, {
          shopContact: {
            ...validationErrorStateObj
          }
        })
      );
      isValid = validationIsValid && isValid;
    }

    if (!isValid) await this.setStep('shop contact');
    return isValid;
  }

  async createShop(createShopMutation: any) {
    if (
      [
        await this.checkSectionContactField(),
        await this.checkSectionAddressField(),
        await this.checkSectionInfoField(),
        await this.checkSectionSetupField()
      ].every(valid => valid)
    ) {
      createShopMutation({
        variables: {
          shopSetupName: this.state.shopSetup.name.value,
          shopSetupShopCategory: this.state.shopSetup.shop_category.value,
          shopSetupShopCurrency: this.state.shopSetup.shop_currency.value,
          shopSetupHasPhysicalShop: this.state.shopSetup.has_physical_shop
            .value,

          shopInfoSummary: this.state.shopInfo.summary.value,
          shopInfoLogo: this.state.shopInfo.logo.value
            ? this.state.shopInfo.logo.value.path
            : null,
          shopInfoBanner: this.state.shopInfo.banner.value
            ? this.state.shopInfo.banner.value.path
            : null,

          shopAddressAddress1: this.state.shopAddress.address_1.value,
          shopAddressAddress2: this.state.shopAddress.address_2.value,
          shopAddressAddress3: this.state.shopAddress.address_3.value,
          shopAddressCity: this.state.shopAddress.city.value,
          shopAddressState: this.state.shopAddress.state.value,
          shopAddressPostalCode: this.state.shopAddress.postal_code.value,
          shopAddressCountry: this.state.shopAddress.country.value,
          shopAddressLatitude: this.state.shopAddress.latitude.value,
          shopAddressLongitude: this.state.shopAddress.longitude.value,

          shopContactEmail: this.state.shopContact.email.value,
          shopContactWebsite: this.state.shopContact.website.value,
          shopContactTelephoneCountryCode: this.state.shopContact
            .telephone_country_code.value,
          shopContactTelephone: this.state.shopContact.telephone.value,
          shopContactPhoneCountryCode: this.state.shopContact.phone_country_code
            .value,
          shopContactPhone: this.state.shopContact.phone.value
        }
      });
    }
  }

  createShopCompletedHandler(data: any) {
    window.location.replace('//' + process.env.REACT_APP_SELLER_DOMAIN);
  }

  async createShopErrorHandler(error: any) {
    await this.checkSectionContactField(error);
    await this.checkSectionAddressField(error);
    await this.checkSectionInfoField(error);
    await this.checkSectionSetupField(error);
  }

  async isShopNameExist() {
    let react = this;

    if (react.state.shopSetup.name.value.trim() !== '') {
      return this.props.client
        .query({
          query: gql`
            query Shop($name: String) {
              shop(name: $name) {
                items {
                  name
                }
              }
            }
          `,
          variables: { name: react.state.shopSetup.name.value }
        })
        .then((data: any) => {
          return data.data.shop.items.length > 0;
        });
    }
  }

  uploadLogo(files: any, uploadImageMutation: any) {
    if (files) {
      this.setState(
        update(this.state, {
          shopInfo: {
            uploadingLogoCount: {
              $set: this.state.shopInfo.uploadingLogoCount + 1
            }
          }
        })
      );
      uploadImageMutation({
        variables: {
          images: files
        }
      });
    }
  }

  uploadLogoCompletedHandler(data: any) {
    let tempImageData = data.uploadImageMutation;
    this.setState(
      update(this.state, {
        shopInfo: {
          uploadingLogoCount: {
            $set: this.state.shopInfo.uploadingLogoCount - tempImageData.length
          },
          logo: {
            value: { $set: tempImageData[0] }
          }
        }
      })
    );
  }

  uploadLogoErrorHandler(error: any) {
    FormUtil.getAllValidationErrorMessage(error).forEach(message => {
      this.props.enqueueSnackbar(message, {
        variant: 'error'
      });
    });

    this.setState(
      update(this.state, {
        shopInfo: {
          uploadingLogoCount: {
            $set: this.state.shopInfo.uploadingLogoCount - 1
          }
        }
      })
    );
  }

  uploadBanner(files: any, uploadImageMutation: any) {
    if (files) {
      this.setState(
        update(this.state, {
          shopInfo: {
            uploadingBannerCount: {
              $set: this.state.shopInfo.uploadingBannerCount + 1
            }
          }
        })
      );
      uploadImageMutation({
        variables: {
          images: files
        }
      });
    }
  }

  uploadBannerCompletedHandler(data: any) {
    let tempImageData = data.uploadImageMutation;
    this.setState(
      update(this.state, {
        shopInfo: {
          uploadingBannerCount: {
            $set:
              this.state.shopInfo.uploadingBannerCount - tempImageData.length
          },
          banner: {
            value: { $set: tempImageData[0] }
          }
        }
      })
    );
  }

  uploadBannerErrorHandler(error: any) {
    FormUtil.getAllValidationErrorMessage(error).forEach(message => {
      this.props.enqueueSnackbar(message, {
        variant: 'error'
      });
    });
    this.setState(
      update(this.state, {
        shopInfo: {
          uploadingBannerCount: {
            $set: this.state.shopInfo.uploadingBannerCount - 1
          }
        }
      })
    );
  }

  removeUploadedLogo() {
    this.setState(
      update(this.state, {
        shopInfo: {
          logo: {
            value: { $set: null }
          }
        }
      })
    );
  }

  removeUploadedBanner() {
    this.setState(
      update(this.state, {
        shopInfo: {
          banner: {
            value: { $set: null }
          }
        }
      })
    );
  }

  render() {
    const { classes, t } = this.props;
    const { activeStep, steps } = this.state;
    return (
      <AppContext.Consumer>
        {context => (
          <React.Fragment>
            <HomeHelmet
              title={t('create shop')}
              description={''}
              ogImage={''}
            />
            <Grid container item direction="row" justify="center" xs={12}>
              <Grid
                container
                item
                direction="row"
                justify="center"
                xs={12}
                sm={10}
              >
                <Paper className={classes.paper}>
                  <Grid container item direction="row" justify="center" xs={12}>
                    <Grid
                      container
                      item
                      direction="column"
                      justify="center"
                      xs={12}
                    >
                      <Typography
                        variant="h5"
                        component="h3"
                        gutterBottom
                        align="center"
                      >
                        {t('create your shop')}
                      </Typography>
                      <Typography component="p" gutterBottom align="center">
                        {t(
                          'all you need is just follow and complete these steps'
                        )}
                      </Typography>
                    </Grid>
                    <Stepper
                      className={classes.stepper}
                      alternativeLabel
                      nonLinear
                      activeStep={activeStep}
                    >
                      {steps.map((step, index) => (
                        <Step key={step}>
                          <StepButton
                            onClick={this.setStep.bind(this, step)}
                            completed={activeStep > index}
                          >
                            {t(step)}
                          </StepButton>
                        </Step>
                      ))}
                    </Stepper>

                    {activeStep === 0 && (
                      <React.Fragment>
                        <Grid
                          container
                          item
                          xs={12}
                          sm={8}
                          md={6}
                          lg={4}
                          spacing={3}
                        >
                          <TextField
                            required
                            error={!this.state.shopSetup.name.is_valid}
                            label={t('shop name')}
                            value={this.state.shopSetup.name.value}
                            onChange={e => {
                              this.setState(
                                update(this.state, {
                                  shopSetup: {
                                    name: { value: { $set: e.target.value } }
                                  }
                                })
                              );
                            }}
                            helperText={this.state.shopSetup.name.feedback}
                            margin="normal"
                            fullWidth
                          />
                          <ShopCategorySelect
                            margin="normal"
                            fullWidth
                            label={t('shop category')}
                            error={!this.state.shopSetup.shop_category.is_valid}
                            helperText={
                              this.state.shopSetup.shop_category.feedback
                            }
                            required
                            value={this.state.shopSetup.shop_category.value}
                            onChange={(value: unknown) => {
                              this.setState(
                                update(this.state, {
                                  shopSetup: {
                                    shop_category: { value: { $set: value } }
                                  }
                                })
                              );
                            }}
                          />
                          <FormHelperText error={false}>
                            {t(
                              'shop category wont limit your product category, you can change this in future'
                            )}
                          </FormHelperText>
                          <CurrencySelect
                            fullWidth
                            margin={'normal'}
                            label={t('shop currency')}
                            error={!this.state.shopSetup.shop_currency.is_valid}
                            helperText={
                              this.state.shopSetup.shop_currency.feedback
                            }
                            required
                            value={this.state.shopSetup.shop_currency.value}
                            onChange={(value: unknown) => {
                              this.setState(
                                update(this.state, {
                                  shopSetup: {
                                    shop_currency: { value: { $set: value } }
                                  }
                                })
                              );
                            }}
                          />
                          <FormHelperText error={false}>
                            {t(
                              "all of your product price will use this currency as price currency, you can't change this in future"
                            )}
                          </FormHelperText>
                          <FormControl
                            margin="normal"
                            fullWidth
                            error={
                              !this.state.shopSetup.has_physical_shop.is_valid
                            }
                          >
                            <FormGroup row>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={
                                      this.state.shopSetup.has_physical_shop
                                        .value
                                    }
                                    onChange={e => {
                                      this.setState(
                                        update(this.state, {
                                          shopSetup: {
                                            has_physical_shop: {
                                              value: { $set: e.target.checked }
                                            }
                                          }
                                        })
                                      );
                                    }}
                                    color="primary"
                                  />
                                }
                                label={t('do you have physical shop?')}
                              />
                            </FormGroup>
                            {this.state.shopSetup.has_physical_shop
                              .feedback && (
                              <FormHelperText>
                                {
                                  this.state.shopSetup.has_physical_shop
                                    .feedback
                                }
                              </FormHelperText>
                            )}
                            <FormHelperText error={false}>
                              {' '}
                              {t(
                                'if you have physical shop, you will need to fill up your shop address in shop address step'
                              )}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                        <Grid
                          container
                          item
                          justify="flex-end"
                          xs={12}
                          className={classes.stepButtonContainer}
                        >
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={async () => {
                              if (await this.checkSectionSetupField())
                                this.setStep('shop info');
                            }}
                          >
                            {t('next')}
                          </Button>
                        </Grid>
                      </React.Fragment>
                    )}
                    {activeStep === 1 && (
                      <React.Fragment>
                        <Grid
                          container
                          item
                          xs={12}
                          sm={8}
                          md={6}
                          lg={4}
                          spacing={3}
                        >
                          <TextField
                            error={!this.state.shopInfo.summary.is_valid}
                            label={t('shop summary')}
                            value={this.state.shopInfo.summary.value}
                            onChange={(e: { target: { value: any } }) => {
                              this.setState(
                                update(this.state, {
                                  shopInfo: {
                                    summary: { value: { $set: e.target.value } }
                                  }
                                })
                              );
                            }}
                            helperText={this.state.shopInfo.summary.feedback}
                            margin="normal"
                            placeholder={t('describe your shop...')}
                            fullWidth
                            multiline
                            rows="3"
                            rowsMax="8"
                          />
                          <Grid container spacing={1}>
                            <Grid item>
                              <FormControl
                                margin="normal"
                                error={!this.state.shopInfo.logo.is_valid}
                              >
                                <UploadImageMutation
                                  onCompleted={this.uploadLogoCompletedHandler.bind(
                                    this
                                  )}
                                  onError={this.uploadLogoErrorHandler.bind(
                                    this
                                  )}
                                  uploadImage={this.uploadLogo.bind(this)}
                                  multiple={false}
                                  id={'uploadLogo'}
                                  className={classes.inputUpload}
                                />
                                <label htmlFor="uploadLogo">
                                  <Button
                                    size={'small'}
                                    variant="contained"
                                    color="primary"
                                    component={'span'}
                                  >
                                    {t('upload shop logo')}
                                  </Button>
                                </label>
                                {this.state.shopInfo.logo.feedback && (
                                  <FormHelperText>
                                    {this.state.shopInfo.logo.feedback}
                                  </FormHelperText>
                                )}
                              </FormControl>
                            </Grid>
                            {this.state.shopInfo.uploadingLogoCount === 0 &&
                              this.state.shopInfo.logo.value && (
                                <Grid item>
                                  <FormControl margin="normal">
                                    <Button
                                      size={'small'}
                                      variant="contained"
                                      color="primary"
                                      onClick={this.removeUploadedLogo.bind(
                                        this
                                      )}
                                    >
                                      {t('remove shop logo')}
                                    </Button>
                                  </FormControl>
                                </Grid>
                              )}
                          </Grid>
                          <Paper
                            className={classes.shopLogoContainer}
                            elevation={0}
                          >
                            {this.state.shopInfo.uploadingLogoCount === 0 &&
                              this.state.shopInfo.logo.value && (
                                <GridList cols={1} cellHeight={'auto'}>
                                  <GridListTile cols={1}>
                                    <Image
                                      className={classes.shopLogo}
                                      src={
                                        this.state.shopInfo.logo.value
                                          .image_large
                                      }
                                      title={t('shop logo')}
                                    />
                                  </GridListTile>
                                </GridList>
                              )}
                          </Paper>
                          {this.state.shopInfo.uploadingLogoCount > 0 && (
                            <Grid item xs={12}>
                              <Skeleton variant={'rect'} height={160} />
                            </Grid>
                          )}
                          <Grid container spacing={1}>
                            <Grid item>
                              <FormControl
                                margin="normal"
                                error={!this.state.shopInfo.banner.is_valid}
                              >
                                <UploadImageMutation
                                  onCompleted={this.uploadBannerCompletedHandler.bind(
                                    this
                                  )}
                                  onError={this.uploadBannerErrorHandler.bind(
                                    this
                                  )}
                                  uploadImage={this.uploadBanner.bind(this)}
                                  multiple={false}
                                  id={'uploadBanner'}
                                  className={classes.inputUpload}
                                />
                                <label htmlFor="uploadBanner">
                                  <Button
                                    size={'small'}
                                    variant="contained"
                                    color="primary"
                                    component={'span'}
                                  >
                                    {t('upload shop banner')}
                                  </Button>
                                </label>
                                {this.state.shopInfo.banner.feedback && (
                                  <FormHelperText>
                                    {this.state.shopInfo.banner.feedback}
                                  </FormHelperText>
                                )}
                              </FormControl>
                            </Grid>
                            {this.state.shopInfo.uploadingBannerCount === 0 &&
                              this.state.shopInfo.banner.value && (
                                <Grid item>
                                  <FormControl margin="normal">
                                    <Button
                                      size={'small'}
                                      variant="contained"
                                      color="primary"
                                      onClick={this.removeUploadedBanner.bind(
                                        this
                                      )}
                                    >
                                      {t('remove shop banner')}
                                    </Button>
                                  </FormControl>
                                </Grid>
                              )}
                          </Grid>
                          <Paper
                            className={classes.shopBannerContainer}
                            elevation={0}
                          >
                            {this.state.shopInfo.uploadingBannerCount === 0 &&
                              this.state.shopInfo.banner.value && (
                                <GridList cols={1} cellHeight={'auto'}>
                                  <GridListTile cols={1}>
                                    <Image
                                      className={classes.shopBanner}
                                      src={
                                        this.state.shopInfo.banner.value
                                          .image_large
                                      }
                                      title={t('shop banner')}
                                    />
                                  </GridListTile>
                                </GridList>
                              )}
                          </Paper>
                          {this.state.shopInfo.uploadingBannerCount > 0 && (
                            <Grid item xs={12}>
                              <Skeleton variant={'rect'} height={160} />
                            </Grid>
                          )}
                        </Grid>
                        <Grid
                          container
                          justify="flex-end"
                          className={classes.stepButtonContainer}
                          spacing={1}
                        >
                          <Grid item>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => {
                                this.setStep('shop setup');
                              }}
                            >
                              {t('back')}
                            </Button>
                          </Grid>
                          <Grid item>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={async () => {
                                if (await this.checkSectionInfoField())
                                  this.setStep('shop address');
                              }}
                            >
                              {t('next')}
                            </Button>
                          </Grid>
                        </Grid>
                      </React.Fragment>
                    )}
                    {activeStep === 2 && (
                      <React.Fragment>
                        <Grid
                          container
                          item
                          xs={12}
                          sm={8}
                          md={6}
                          lg={4}
                          spacing={3}
                        >
                          {!this.state.shopSetup.has_physical_shop.value && (
                            <Grid item xs={12}>
                              <Typography component="p">
                                {t(
                                  "from your shop setup, seems like you don't have a physical shop, you could continue to the next step"
                                )}
                              </Typography>
                            </Grid>
                          )}
                          <Grid item xs={12}>
                            <TextField
                              required={
                                this.state.shopSetup.has_physical_shop.value
                              }
                              error={!this.state.shopAddress.address_1.is_valid}
                              label={t('address 1')}
                              value={this.state.shopAddress.address_1.value}
                              onChange={(e: { target: { value: any } }) => {
                                this.setState(
                                  update(this.state, {
                                    shopAddress: {
                                      address_1: {
                                        value: { $set: e.target.value }
                                      }
                                    }
                                  })
                                );
                              }}
                              helperText={
                                this.state.shopAddress.address_1.feedback
                              }
                              margin="normal"
                              disabled={
                                !this.state.shopSetup.has_physical_shop.value
                              }
                              fullWidth
                            />
                            <TextField
                              error={!this.state.shopAddress.address_2.is_valid}
                              label={t('address 2')}
                              value={this.state.shopAddress.address_2.value}
                              onChange={(e: { target: { value: any } }) => {
                                this.setState(
                                  update(this.state, {
                                    shopAddress: {
                                      address_2: {
                                        value: { $set: e.target.value }
                                      }
                                    }
                                  })
                                );
                              }}
                              helperText={
                                this.state.shopAddress.address_2.feedback
                              }
                              margin="normal"
                              disabled={
                                !this.state.shopSetup.has_physical_shop.value
                              }
                              fullWidth
                            />
                            <TextField
                              error={!this.state.shopAddress.address_3.is_valid}
                              label={t('address 3')}
                              value={this.state.shopAddress.address_3.value}
                              onChange={(e: { target: { value: any } }) => {
                                this.setState(
                                  update(this.state, {
                                    shopAddress: {
                                      address_3: {
                                        value: { $set: e.target.value }
                                      }
                                    }
                                  })
                                );
                              }}
                              helperText={
                                this.state.shopAddress.address_3.feedback
                              }
                              margin="normal"
                              disabled={
                                !this.state.shopSetup.has_physical_shop.value
                              }
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              required={
                                this.state.shopSetup.has_physical_shop.value
                              }
                              error={!this.state.shopAddress.city.is_valid}
                              label={t('city')}
                              value={this.state.shopAddress.city.value}
                              onChange={(e: { target: { value: any } }) => {
                                this.setState(
                                  update(this.state, {
                                    shopAddress: {
                                      city: { value: { $set: e.target.value } }
                                    }
                                  })
                                );
                              }}
                              helperText={this.state.shopAddress.city.feedback}
                              margin="normal"
                              disabled={
                                !this.state.shopSetup.has_physical_shop.value
                              }
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              required={
                                this.state.shopSetup.has_physical_shop.value
                              }
                              error={!this.state.shopAddress.state.is_valid}
                              label={t('state')}
                              value={this.state.shopAddress.state.value}
                              onChange={(e: { target: { value: any } }) => {
                                this.setState(
                                  update(this.state, {
                                    shopAddress: {
                                      state: { value: { $set: e.target.value } }
                                    }
                                  })
                                );
                              }}
                              helperText={this.state.shopAddress.state.feedback}
                              margin="normal"
                              disabled={
                                !this.state.shopSetup.has_physical_shop.value
                              }
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              required={
                                this.state.shopSetup.has_physical_shop.value
                              }
                              error={
                                !this.state.shopAddress.postal_code.is_valid
                              }
                              label={t('postal code')}
                              value={this.state.shopAddress.postal_code.value}
                              onChange={(e: { target: { value: any } }) => {
                                this.setState(
                                  update(this.state, {
                                    shopAddress: {
                                      postal_code: {
                                        value: { $set: e.target.value }
                                      }
                                    }
                                  })
                                );
                              }}
                              helperText={
                                this.state.shopAddress.postal_code.feedback
                              }
                              margin="normal"
                              disabled={
                                !this.state.shopSetup.has_physical_shop.value
                              }
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <CountrySelect
                              required={
                                this.state.shopSetup.has_physical_shop.value
                              }
                              label={t('country')}
                              error={!this.state.shopAddress.country.is_valid}
                              helperText={
                                this.state.shopAddress.country.feedback
                              }
                              value={this.state.shopAddress.country.value}
                              onChange={(value: unknown) => {
                                this.setState(
                                  update(this.state, {
                                    shopAddress: {
                                      country: { value: { $set: value } }
                                    }
                                  })
                                );
                              }}
                              margin="normal"
                              fullWidth
                              disabled={
                                !this.state.shopSetup.has_physical_shop.value
                              }
                            />
                          </Grid>
                        </Grid>
                        <Grid container item xs={12} spacing={3}>
                          <Grid item xs={12}>
                            {this.state.shopSetup.has_physical_shop.value && (
                              <FormControl margin="normal" fullWidth>
                                <div style={{ height: '400px', width: '100%' }}>
                                  <Geolocation
                                    render={(geoData: any) => {
                                      let {
                                        fetchingPosition,
                                        position,
                                        error,
                                        getCurrentPosition
                                      } = geoData;

                                      let latitude =
                                        position &&
                                        position.coords &&
                                        position.coords.latitude
                                          ? position.coords.latitude
                                          : null;

                                      let longitude =
                                        position &&
                                        position.coords &&
                                        position.coords.longitude
                                          ? position.coords.longitude
                                          : null;

                                      return (
                                        <GoogleMap
                                          latitude={latitude}
                                          longitude={longitude}
                                          onClick={(data: any) => {
                                            let {
                                              x,
                                              y,
                                              lat,
                                              lng,
                                              event
                                            } = data;

                                            this.setState(
                                              update(this.state, {
                                                shopAddress: {
                                                  latitude: {
                                                    value: { $set: lat }
                                                  },
                                                  longitude: {
                                                    value: { $set: lng }
                                                  }
                                                }
                                              })
                                            );
                                          }}
                                        >
                                          {this.state.shopAddress.latitude
                                            .value !== '' &&
                                            this.state.shopAddress.longitude
                                              .value !== '' && (
                                              <GoogleMapMarker
                                                lat={
                                                  this.state.shopAddress
                                                    .latitude.value
                                                }
                                                lng={
                                                  this.state.shopAddress
                                                    .longitude.value
                                                }
                                              />
                                            )}
                                        </GoogleMap>
                                      );
                                    }}
                                  />
                                </div>
                              </FormControl>
                            )}
                            <div>
                              {this.state.shopAddress.latitude.is_valid ===
                                false &&
                                this.state.shopAddress.latitude.feedback !==
                                  '' && (
                                  <FormHelperText error>
                                    {this.state.shopAddress.latitude.feedback}
                                  </FormHelperText>
                                )}
                            </div>
                          </Grid>
                        </Grid>
                        <Grid
                          container
                          justify="flex-end"
                          className={classes.stepButtonContainer}
                          spacing={1}
                        >
                          <Grid item>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => {
                                this.setStep('shop info');
                              }}
                            >
                              {t('back')}
                            </Button>
                          </Grid>
                          <Grid item>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={async () => {
                                if (await this.checkSectionAddressField())
                                  this.setStep('shop contact');
                              }}
                            >
                              {t('next')}
                            </Button>
                          </Grid>
                        </Grid>
                      </React.Fragment>
                    )}
                    {activeStep === 3 && (
                      <React.Fragment>
                        <Grid
                          container
                          item
                          xs={12}
                          sm={8}
                          md={6}
                          lg={4}
                          spacing={3}
                        >
                          <Grid item>
                            <TextField
                              required
                              error={!this.state.shopContact.email.is_valid}
                              label={t('shop email')}
                              value={this.state.shopContact.email.value}
                              onChange={(e: { target: { value: any } }) => {
                                this.setState(
                                  update(this.state, {
                                    shopContact: {
                                      email: { value: { $set: e.target.value } }
                                    }
                                  })
                                );
                              }}
                              helperText={this.state.shopContact.email.feedback}
                              margin="normal"
                              fullWidth
                            />
                            <TextField
                              error={!this.state.shopContact.website.is_valid}
                              label={t('shop website')}
                              value={this.state.shopContact.website.value}
                              onChange={(e: { target: { value: any } }) => {
                                this.setState(
                                  update(this.state, {
                                    shopContact: {
                                      website: {
                                        value: { $set: e.target.value }
                                      }
                                    }
                                  })
                                );
                              }}
                              helperText={
                                this.state.shopContact.website.feedback
                              }
                              margin="normal"
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={12} sm={12} md={6}>
                            <CountryPhoneCodeSelect
                              label={t('shop telephone code')}
                              error={
                                !this.state.shopContact.telephone_country_code
                                  .is_valid
                              }
                              helperText={
                                this.state.shopContact.telephone_country_code
                                  .feedback
                              }
                              value={
                                this.state.shopContact.telephone_country_code
                                  .value
                              }
                              onChange={(value: unknown) => {
                                this.setState(
                                  update(this.state, {
                                    shopContact: {
                                      telephone_country_code: {
                                        value: { $set: value }
                                      }
                                    }
                                  })
                                );
                              }}
                              margin="normal"
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={12} sm={12} md={6}>
                            <TextField
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    {
                                      this.state.shopContact
                                        .telephone_country_code.value
                                    }
                                  </InputAdornment>
                                )
                              }}
                              error={!this.state.shopContact.telephone.is_valid}
                              label={t('shop telephone')}
                              value={this.state.shopContact.telephone.value}
                              onChange={(e: { target: { value: any } }) => {
                                this.setState(
                                  update(this.state, {
                                    shopContact: {
                                      telephone: {
                                        value: { $set: e.target.value }
                                      }
                                    }
                                  })
                                );
                              }}
                              helperText={
                                this.state.shopContact.telephone.feedback
                              }
                              margin="normal"
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={12} sm={12} md={6}>
                            <CountryPhoneCodeSelect
                              required
                              label={t('shop phone code')}
                              error={
                                !this.state.shopContact.phone_country_code
                                  .is_valid
                              }
                              helperText={
                                this.state.shopContact.phone_country_code
                                  .feedback
                              }
                              value={
                                this.state.shopContact.phone_country_code.value
                              }
                              onChange={(value: unknown) => {
                                this.setState(
                                  update(this.state, {
                                    shopContact: {
                                      phone_country_code: {
                                        value: { $set: value }
                                      }
                                    }
                                  })
                                );
                              }}
                              margin="normal"
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={12} sm={12} md={6}>
                            <TextField
                              required
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    {
                                      this.state.shopContact.phone_country_code
                                        .value
                                    }
                                  </InputAdornment>
                                )
                              }}
                              error={!this.state.shopContact.phone.is_valid}
                              label={t('shop phone')}
                              value={this.state.shopContact.phone.value}
                              onChange={(e: { target: { value: any } }) => {
                                this.setState(
                                  update(this.state, {
                                    shopContact: {
                                      phone: { value: { $set: e.target.value } }
                                    }
                                  })
                                );
                              }}
                              helperText={this.state.shopContact.phone.feedback}
                              margin="normal"
                              fullWidth
                            />
                          </Grid>
                        </Grid>
                        <Grid
                          container
                          justify="flex-end"
                          className={classes.stepButtonContainer}
                          spacing={1}
                        >
                          <Grid item>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => {
                                this.setStep('shop address');
                              }}
                            >
                              {t('back')}
                            </Button>
                          </Grid>
                          <Grid item>
                            <Mutation
                              mutation={gql`
                                mutation CreateShopMutation(
                                  $shopSetupName: String
                                  $shopSetupShopCategory: String
                                  $shopSetupShopCurrency: String
                                  $shopSetupHasPhysicalShop: Boolean
                                  $shopInfoSummary: String
                                  $shopInfoLogo: String
                                  $shopInfoBanner: String
                                  $shopAddressAddress1: String
                                  $shopAddressAddress2: String
                                  $shopAddressAddress3: String
                                  $shopAddressCity: String
                                  $shopAddressState: String
                                  $shopAddressPostalCode: String
                                  $shopAddressCountry: String
                                  $shopAddressLatitude: String
                                  $shopAddressLongitude: String
                                  $shopContactEmail: String
                                  $shopContactWebsite: String
                                  $shopContactTelephoneCountryCode: String
                                  $shopContactTelephone: String
                                  $shopContactPhoneCountryCode: String
                                  $shopContactPhone: String
                                ) {
                                  createShopMutation(
                                    shopSetupName: $shopSetupName
                                    shopSetupShopCategory: $shopSetupShopCategory
                                    shopSetupShopCurrency: $shopSetupShopCurrency
                                    shopSetupHasPhysicalShop: $shopSetupHasPhysicalShop
                                    shopInfoSummary: $shopInfoSummary
                                    shopInfoLogo: $shopInfoLogo
                                    shopInfoBanner: $shopInfoBanner
                                    shopAddressAddress1: $shopAddressAddress1
                                    shopAddressAddress2: $shopAddressAddress2
                                    shopAddressAddress3: $shopAddressAddress3
                                    shopAddressCity: $shopAddressCity
                                    shopAddressState: $shopAddressState
                                    shopAddressPostalCode: $shopAddressPostalCode
                                    shopAddressCountry: $shopAddressCountry
                                    shopAddressLatitude: $shopAddressLatitude
                                    shopAddressLongitude: $shopAddressLongitude
                                    shopContactEmail: $shopContactEmail
                                    shopContactWebsite: $shopContactWebsite
                                    shopContactTelephoneCountryCode: $shopContactTelephoneCountryCode
                                    shopContactTelephone: $shopContactTelephone
                                    shopContactPhoneCountryCode: $shopContactPhoneCountryCode
                                    shopContactPhone: $shopContactPhone
                                  ) {
                                    id
                                  }
                                }
                              `}
                              onCompleted={data => {
                                this.createShopCompletedHandler.bind(this)(
                                  data
                                );
                                context.getContext();
                              }}
                              onError={error => {
                                this.createShopErrorHandler.bind(this)(error);
                              }}
                            >
                              {(
                                createShopMutation,
                                { data, loading, error }
                              ) => {
                                if (loading) {
                                  return (
                                    <Button variant="contained" color="primary">
                                      <CircularProgress
                                        size={20}
                                        className={classes.buttonCreateProgress}
                                      />
                                    </Button>
                                  );
                                }

                                return (
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={async () => {
                                      if (await this.checkSectionContactField())
                                        this.createShop.bind(this)(
                                          createShopMutation
                                        );
                                    }}
                                  >
                                    {t('create')}
                                  </Button>
                                );
                              }}
                            </Mutation>
                          </Grid>
                        </Grid>
                      </React.Fragment>
                    )}
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </React.Fragment>
        )}
      </AppContext.Consumer>
    );
  }
}

export default withStyles(theme => ({
  paper: {
    width: '100%',
    padding: theme.spacing(3)
  },
  stepper: {
    width: '100%',
    marginTop: theme.spacing(1)
  },
  stepButtonContainer: {
    marginTop: theme.spacing(2)
  },
  inputUpload: {
    display: 'none'
  },
  shopLogoContainer: {
    marginTop: theme.spacing(2)
  },
  shopLogo: {
    width: '100%'
  },
  shopBannerContainer: {
    marginTop: theme.spacing(2)
  },
  shopBanner: {
    width: '100%'
  },
  buttonCreateProgress: {
    color: '#fff'
  }
}))(withSnackbar(withTranslation()(withRouter(withApollo(CreateShop)))));
