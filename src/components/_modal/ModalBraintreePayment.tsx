import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "./Modal";
import Braintree from "braintree-web";
import FormLabel from "@material-ui/core/FormLabel";
import Typography from "@material-ui/core/Typography";
import Skeleton from "@material-ui/lab/Skeleton";
import FormHelperText from "@material-ui/core/FormHelperText";
import BRAINTREE_ERROR from "../../constant/BRAINTREE_ERROR";
import DialogProcessingPayment from "../_dialog/DialogProcessingPayment";
import { makeStyles } from "@material-ui/styles";
import { useGetBraintreeClientTokenMutation } from "../../graphql/mutation/braintreeMutation/GetBraintreeClientTokenMutation";
import { getBraintreeClientTokenMutationFragments } from "../../graphql/fragment/mutation/GetBraintreeClientTokenMutationFragment";

interface IProps {
  isOpen: boolean;
  toggle: () => void;
  payButtonText?: string;
  onConfirmed: (nonce: string) => void;
}

const useStyles = makeStyles({
  buttonProgress: {
    color: '#fff'
  },
  content: {
    margin: 0
  }
});

export default function ModalBraintreePayment(props: IProps) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { payButtonText } = props;
  const [getBraintreeClientTokenMutation] = useGetBraintreeClientTokenMutation(
    getBraintreeClientTokenMutationFragments.DefaultFragment
  );

  const [modal, setModal] = useState<{
    processingPayment: boolean;
  }>({
    processingPayment: false
  });
  const [invalidFields, setInvalidFields] = useState<string[]>([]);
  const [braintreeClientToken, setBraintreeClientToken] = useState<string>('');
  const [hostedFieldsInstance, setHostedFieldsInstance] = useState<any>(null);
  const [nonce, setNonce] = useState<string>('');

  useEffect(() => {
    if (props.isOpen) {
      initBraintreePaymentForm();
    }
  }, [props.isOpen, braintreeClientToken]);

  function toggleModalProcessingPayment() {
    setModal({
      processingPayment: !modal.processingPayment
    });
  }

  async function getBraintreeClientToken() {
    let { data } = await getBraintreeClientTokenMutation();
    if (data) {
      let clientToken = data.getBraintreeClientTokenMutation.clientToken;
      setBraintreeClientToken(clientToken);
    }
  }

  function initBraintreePaymentForm() {
    if (!braintreeClientToken) {
      getBraintreeClientToken();
    } else {
      Braintree.client
        .create({
          authorization: braintreeClientToken
        })
        .then(function(clientInstance) {
          let options = {
            client: clientInstance,
            styles: {
              input: {
                'font-size': '16px',
                'font-family': 'roboto, verdana, sans-serif',
                'font-weight': 'lighter',
                color: 'black'
              },
              ':focus': {
                color: 'black'
              },
              '.valid': {
                color: 'black'
              },
              '.invalid': {
                color: 'black'
              }
            },
            fields: {
              number: {
                selector: '#card-number',
                placeholder: '4111 1111 1111 1111'
              },
              cvv: {
                selector: '#cvv',
                placeholder: '123'
              },
              expirationDate: {
                selector: '#expiration-date',
                placeholder: 'MM/YYYY'
              },
              postalCode: {
                selector: '#postal-code',
                placeholder: '11111'
              }
            }
          };

          return Braintree.hostedFields.create(options);
        })
        .then(function(newHostedFieldsInstance) {
          // Use the Hosted Fields instance here to tokenize a card
          let findLabel = (field: any) => {
            return document.querySelector(
              '.hosted-field-label[for="' + field.container.id + '"]'
            ) as HTMLInputElement;
          };

          newHostedFieldsInstance.on('focus', event => {
            let field = event.fields[event.emittedBy];
            let label = findLabel(field);
            if (label) {
              label.classList.add('label-float');
              label.classList.remove('filled');
            }
          });

          // Emulates floating label pattern
          newHostedFieldsInstance.on('blur', event => {
            let field = event.fields[event.emittedBy];
            let label = findLabel(field);
            if (label) {
              if (field.isEmpty) {
                label.classList.remove('label-float');
              } else if (field.isValid) {
                label.classList.add('filled');
              } else {
                label.classList.add('invalid');
              }
            }
          });

          newHostedFieldsInstance.on('empty', event => {
            let field = event.fields[event.emittedBy];
            let label = findLabel(field);
            if (label) {
              label.classList.remove('filled');
              label.classList.remove('invalid');
            }
          });

          newHostedFieldsInstance.on('validityChange', event => {
            let field = event.fields[event.emittedBy];
            let label = findLabel(field);

            if (label) {
              if (field.isPotentiallyValid) {
                label.classList.remove('invalid');
              } else {
                label.classList.add('invalid');
              }
            }
          });

          setHostedFieldsInstance(newHostedFieldsInstance);
        })
        .catch(function(err) {
          // Handle error in component creation
          console.log('err', err);
        });
    }
  }

  function pay() {
    if (hostedFieldsInstance) {
      setModal({
        processingPayment: true
      });
      hostedFieldsInstance.tokenize((err: any, payload: any) => {
        setModal({
          processingPayment: false
        });
        if (err) {
          console.log('err', err);
          if (err.details && err.details.invalidFieldKeys) {
            setInvalidFields(err.details.invalidFieldKeys);
          } else {
            setInvalidFields([]);
          }

          if (
            err.code ===
            BRAINTREE_ERROR.HOSTED_FIELDS.HOSTED_FIELDS_FIELDS_EMPTY
          ) {
            enqueueSnackbar(t('global$$please enter card info'), {
              variant: 'error'
            });
          }
          return;
        }
        //console.log('payload', payload);
        setNonce(payload.nonce);
        teardown();
        props.onConfirmed(payload.nonce);
        // This is where you would submit payload.nonce to your server
        //alert('Submit your nonce to your server here!');
      });
    }
  }

  function teardown(callback?: () => any) {
    if (hostedFieldsInstance) {
      hostedFieldsInstance.teardown(function(err: any) {
        if (err) {
          console.error('Could not tear down Hosted Fields!');
        } else {
          //console.log('OK')
          if (callback) {
            callback();
          }
        }
      });
    } else {
      //console.log('OK123')
      if (callback) {
        callback();
      }
    }
  }

  let isBraintreeClientTokenReady = Boolean(braintreeClientToken);

  return (
    <Modal
      disableBackdropClick
      closeAfterTransition
      disableAutoFocus
      open={props.isOpen}
      onClose={props.toggle}
      fullWidth
      maxWidth={'sm'}
    >
      <DialogProcessingPayment
        open={modal.processingPayment}
        onClose={toggleModalProcessingPayment}
      />

      <Grid
        container
        direction="row"
        justify="center"
        item
        xs={12}
        spacing={3}
        className={classes.content}
      >
        <Grid item xs={12}>
          <Typography variant="h6" color="primary" align="center" gutterBottom>
            {t('global$$card payment')}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <FormLabel className="hosted-field-label" htmlFor="card-number">
              {t('global$$card number')}
            </FormLabel>
            {isBraintreeClientTokenReady ? (
              <div id="card-number" className="hosted-field" />
            ) : (
              <Skeleton height={31} />
            )}
            {invalidFields.includes('number') && (
              <FormHelperText error>
                {t('global$$invalid')} {t(`global$$card number`)}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <FormLabel className="hosted-field-label" htmlFor="expiration-date">
              {t('global$$expiration date')}
            </FormLabel>
            {isBraintreeClientTokenReady ? (
              <div id="expiration-date" className="hosted-field" />
            ) : (
              <Skeleton height={31} />
            )}
            {invalidFields.includes('expirationDate') && (
              <FormHelperText error>
                {t('global$$invalid')} {t(`global$$expiration date`)}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <FormLabel className="hosted-field-label" htmlFor="cvv">
              {t('global$$CVV')}
            </FormLabel>
            {isBraintreeClientTokenReady ? (
              <div id="cvv" className="hosted-field" />
            ) : (
              <Skeleton height={31} />
            )}
            {invalidFields.includes('cvv') && (
              <FormHelperText error>
                {t('global$$invalid')} {t(`global$$CVV`)}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <FormLabel className="hosted-field-label" htmlFor="postal-code">
              {t('global$$postal code')}
            </FormLabel>
            {isBraintreeClientTokenReady ? (
              <div id="postal-code" className="hosted-field" />
            ) : (
              <Skeleton height={31} />
            )}
            {invalidFields.includes('postalCode') && (
              <FormHelperText error>
                {t('global$$invalid')} {t(`global$$postal code`)}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid container item xs={12} justify="flex-end" spacing={1}>
          <Grid item>
            {isBraintreeClientTokenReady ? (
              <Button
                onClick={async () => {
                  teardown(() => {
                    props.toggle();
                  });
                }}
                color="primary"
              >
                {t('global$$cancel')}
              </Button>
            ) : (
              <Skeleton height={36} width={70} />
            )}
          </Grid>
          <Grid item>
            {isBraintreeClientTokenReady ? (
              <Button variant="contained" color="primary" onClick={pay}>
                {payButtonText || t('global$$place order')}
              </Button>
            ) : (
              <Skeleton height={36} width={126} />
            )}
          </Grid>
        </Grid>
      </Grid>
    </Modal>
  );
}
