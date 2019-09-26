import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import Modal from "../../_modal/Modal";
import Paper from "@material-ui/core/Paper";
import { makeStyles, Theme } from "@material-ui/core/styles/index";
import update from "immutability-helper";
import React, { useContext, useEffect, useState } from "react";
import { ApolloConsumer, useApolloClient } from "react-apollo";
import Skeleton from "@material-ui/lab/Skeleton";
import { AppContext } from "../../../contexts/Context";
import FormUtil, { Fields } from "../../../utils/FormUtil";
import { useTranslation } from "react-i18next";
import gql from "graphql-tag";
import Autosuggest from "react-autosuggest";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import FormHelperText from "@material-ui/core/FormHelperText";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import UserAvatar from "../../../components/UserAvatar";
import ShopAdminRoleSelect from "../../_select/ShopAdminRoleSelect";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Typography from "@material-ui/core/Typography";
import { shopAdminFragments } from "../../../graphql/fragment/query/ShopAdminFragment";
import { WithPagination } from "../../../graphql/query/Query";
import useToast from "../../_hook/useToast";
import { shopAdminQuery, ShopAdminVars } from "../../../graphql/query/ShopAdminQuery";
import { IShopAdminFragmentModalCreateEditShopAdmin } from "../../../graphql/fragmentType/query/ShopAdminFragmentInterface";
import { useCreateShopAdminMutation } from "../../../graphql/mutation/shopAdminMutation/CreateShopAdminMutation";
import { useEditShopAdminMutation } from "../../../graphql/mutation/shopAdminMutation/EditShopAdminMutation";

interface IProps {
  shopAdminId?: string;
  shopId: string;
  disabled?: boolean;
  refetchData: any;
  toggle: () => void;
  isOpen: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  actionButtonContainer: {
    marginTop: theme.spacing(2)
  },
  suggestionsContainerOpen: {
    position: "absolute",
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0
  },
  suggestion: {
    display: "block"
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: "none"
  },
  contentContainer: {
    margin: 0
  }
}));

export default function ModalCreateEditShopAdmin(props: IProps) {
  const classes = useStyles();
  const context = useContext(AppContext);
  const { t } = useTranslation();
  const { toast } = useToast();
  const client = useApolloClient();
  const {
    shopAdminId,
    shopId,
    disabled,
    refetchData,
    toggle,
    isOpen
  } = props;

  let shopAdminFields = [
    "shop_admin_role_title",
    "is_shop_owner_role",
    "selectedShopAdminRole",
    {
      field: "user",
      value: null
    },
    {
      field: "username",
      isCheckEmpty: true,
      emptyMessage: t("please enter username and select user"),
      value: "",
      validationField: "user_id"
    },
    {
      field: "shop_admin_role_id",
      isCheckEmpty: true,
      emptyMessage: t("please select shop admin role"),
      value: ""
    }
  ];

  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(true);
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState<boolean>(false);
  const [shopAdmin, setShopAdmin] = useState<Fields>(FormUtil.generateFieldsState(shopAdminFields));
  const [searchInputData, setSearchInputData] = useState<{
    suggestionSearch: any[]
  }>({
    suggestionSearch: []
  });

  const [
    createShopAdminMutation,
    { loading: isCreatingShopAdminMutation }
  ] = useCreateShopAdminMutation<IShopAdminFragmentModalCreateEditShopAdmin>(shopAdminFragments.ModalCreateEditShopAdmin, {
    onCompleted: () => {
      toast.default(
        t("{{title}} successfully created", {
          title: shopAdmin.username.value
        })
      );
      handleOkCloseDialog();
      refetchData();
    },
    onError: async (error) => {
      await checkShopAdminForm(error);
    }
  });

  const [
    editShopAdminMutation,
    { loading: isEditingShopAdminMutation }
  ] = useEditShopAdminMutation<IShopAdminFragmentModalCreateEditShopAdmin>(shopAdminFragments.ModalCreateEditShopAdmin, {
    onCompleted: () => {
      toast.default(
        t("{{title}} successfully updated", {
          title: shopAdmin.username.value
        })
      );
      handleOkCloseDialog();
    },
    onError: async (error) => {
      await checkShopAdminForm(error);
    }
  });

  useEffect(() => {
    resetStateData();
    getShopAdmin();
  }, [shopAdminId, shopId]);

  async function getShopAdmin() {
    if (shopAdminId && shopId) {
      setIsDataLoaded(false);
      let { data } = await client.query<{ shopAdmin: WithPagination<IShopAdminFragmentModalCreateEditShopAdmin> },
        ShopAdminVars>({
        query: shopAdminQuery(shopAdminFragments.ModalCreateEditShopAdmin),
        variables: {
          id: shopAdminId
        }
      });

      let shopAdminData = data.shopAdmin.items[0];
      let isDisabled = disabled;

      setShopAdmin(
        update(shopAdmin, {
          shop_admin_role_title: {
            value: { $set: shopAdminData.shop_admin_role.title },
            disabled: { $set: isDisabled }
          },
          is_shop_owner_role: {
            value: { $set: shopAdminData.shop_admin_role.is_shop_owner_role },
            disabled: { $set: isDisabled }
          },
          username: {
            value: { $set: shopAdminData.user.username },
            disabled: { $set: isDisabled }
          },
          user: {
            value: { $set: shopAdminData.user },
            disabled: { $set: isDisabled }
          },
          shop_admin_role_id: {
            value: { $set: shopAdminData.shop_admin_role_id },
            disabled: { $set: isDisabled }
          }
        })
      );

      setIsDataLoaded(true);
    }
  }

  function resetStateData() {
    setIsDataLoaded(true);
    setShopAdmin((shopAdmin: any) => FormUtil.generateResetFieldsStateHook(shopAdminFields, shopAdmin));
  }

  function handleCancelCloseDialog() {
    setIsCloseDialogOpen(false);
  }

  async function handleOkCloseDialog() {
    await resetStateData();
    setIsCloseDialogOpen(false);
    await toggle();
  }

  function toggleCloseDialog() {
    setIsCloseDialogOpen(true);
  }

  async function checkShopAdminForm(error?: any) {
    let {
      state: checkedEmptyState,
      isValid: emptyIsValid
    } = FormUtil.generateFieldsEmptyErrorHook(
      shopAdminFields,
      shopAdmin
    );

    let {
      state: checkedErrorState,
      isValid: validationIsValid
    } = FormUtil.validationErrorHandlerHook(
      shopAdminFields,
      error,
      checkedEmptyState
    );

    setShopAdmin(checkedErrorState);

    return emptyIsValid && validationIsValid;
  }

  async function createShopAdmin() {
    if (await checkShopAdminForm()) {
      createShopAdminMutation({
        variables: {
          shop_id: shopId,
          user_id: shopAdmin.user.value.id,
          shop_admin_role_id: shopAdmin.shop_admin_role_id.value
        }
      });
    }
  }

  async function editShopAdmin() {
    if (shopAdminId && await checkShopAdminForm()) {
      editShopAdminMutation({
        variables: {
          shop_admin_id: shopAdminId,
          shop_id: shopId,
          user_id: shopAdmin.user.value.id,
          shop_admin_role_id: shopAdmin.shop_admin_role_id.value
        }
      });
    }
  }

  return <>
    <Dialog
      maxWidth="sm"
      open={isCloseDialogOpen}
      onClose={handleCancelCloseDialog}
    >
      <DialogTitle>
        {shopAdminId
          ? t("cancel edit admin")
          : t("cancel add admin")}
      </DialogTitle>
      <DialogContent>
        {shopAdminId
          ? t("are you sure cancel edit admin?")
          : t("are you sure cancel add admin?")}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleCancelCloseDialog}
          color="primary"
        >
          {t("cancel")}
        </Button>
        <Button
          onClick={handleOkCloseDialog}
          color="primary"
        >
          {t("ok")}
        </Button>
      </DialogActions>
    </Dialog>
    <Modal
      disableAutoFocus
      open={isOpen}
      onClose={toggleCloseDialog}
      maxWidth={"md"}
      fullWidth
    >
      <Grid
        container
        direction="row"
        item
        xs={12}
        spacing={1}
        className={classes.contentContainer}
      >
        {isDataLoaded ? (
          <>
            <Grid item xs={12}>
              <ApolloConsumer>
                {client => (
                  <Autosuggest
                    theme={{
                      suggestionsList: classes.suggestionsList,
                      suggestion: classes.suggestion
                    }}
                    suggestions={
                      searchInputData.suggestionSearch
                    }
                    renderInputComponent={(inputProps: any) => {
                      const {
                        classes,
                        inputRef = () => {
                        },
                        ref,
                        ...other
                      } = inputProps;

                      return (
                        <>
                          <TextField
                            fullWidth
                            InputProps={{
                              inputRef: (node: any) => {
                                ref(node);
                                inputRef(node);
                              },
                              classes: {
                                input: classes.input
                              }
                            }}
                            {...other}
                          />
                          <FormHelperText>
                            {t("username of user")}
                          </FormHelperText>
                        </>
                      );
                    }}
                    onSuggestionsFetchRequested={({ value }: any) => {
                      client
                        .query({
                          query: gql`
                                    query User(
                                      $where_like_username: String
                                      $limit: Int!
                                    ) {
                                      user(
                                        where_like_username: $where_like_username
                                        limit: $limit
                                      ) {
                                        items {
                                          id
                                          username
                                          name
                                          user_info {
                                            id
                                            gender
                                            avatar
                                          }
                                        }
                                      }
                                    }
                                  `,
                          variables: {
                            limit: 10,
                            where_like_username: value
                          }
                        })
                        .then((data: any) => {
                          setSearchInputData(
                            update(searchInputData, {
                              suggestionSearch: {
                                $set: data.data.user.items
                              }
                            })
                          );
                        });
                    }}
                    onSuggestionsClearRequested={() => {
                      // setSearchInputData(
                      //   update(searchInputData, {
                      //     suggestionSearch: {
                      //       $set: []
                      //     }
                      //   })
                      // );
                    }}
                    inputProps={{
                      disabled:
                        !!shopAdmin.is_shop_owner_role
                          .value ||
                        shopAdmin.username.disabled,
                      error: !shopAdmin.username.is_valid,
                      helperText: shopAdmin.username
                        .feedback,
                      classes,
                      placeholder: t(
                        "please enter username and select user"
                      ),
                      label: t("username"),
                      value: shopAdmin.username.value,
                      onChange: (e: any) => {
                        setShopAdmin(
                          update(shopAdmin, {
                            username: {
                              value: { $set: e.target.value }
                            },
                            user: { value: { $set: null } }
                          })
                        );
                      },
                      onBlur: () => {
                        if (!shopAdmin.user.value) {
                          setShopAdmin(
                            update(shopAdmin, {
                              username: { value: { $set: "" } }
                            })
                          );
                        }
                      },
                      InputLabelProps: {
                        shrink: true
                      }
                    }}
                    getSuggestionValue={suggestion => suggestion}
                    renderSuggestion={(
                      suggestion,
                      { query, isHighlighted }
                    ) => {
                      const matches = match(suggestion.username, query);
                      const parts = parse(suggestion.username, matches);

                      return (
                        <MenuItem
                          selected={isHighlighted}
                          component="div"
                        >
                          <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                              <UserAvatar user={suggestion}/>
                            </ListItemAvatar>
                            <ListItemText
                              primary={suggestion.name}
                              secondary={
                                <>
                                  {parts.map(
                                    (part: any, index: number) =>
                                      part.highlight ? (
                                        <span
                                          key={String(index)}
                                          style={{ fontWeight: 500 }}
                                        >
                                                  {part.text}
                                                </span>
                                      ) : (
                                        <strong
                                          key={String(index)}
                                          style={{ fontWeight: 300 }}
                                        >
                                          {part.text}
                                        </strong>
                                      )
                                  )}
                                </>
                              }
                            />
                          </ListItem>
                        </MenuItem>
                      );
                    }}
                    renderSuggestionsContainer={options => (
                      <Paper {...options.containerProps} square>
                        {options.children}
                      </Paper>
                    )}
                    onSuggestionSelected={(
                      event,
                      {
                        suggestion
                        // suggestionValue,
                        // suggestionIndex,
                        // sectionIndex,
                        // method
                      }
                    ) => {
                      setShopAdmin(
                        update(shopAdmin, {
                          username: {
                            value: { $set: suggestion.username }
                          },
                          user: { value: { $set: suggestion } }
                        })
                      );
                    }}
                  />
                )}
              </ApolloConsumer>
              {!!shopAdmin.is_shop_owner_role.value && (
                <Typography variant="overline" color={"primary"}>
                  {t(
                    "this is shop owner admin, you can not modify this shop admin"
                  )}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              {!!shopAdmin.is_shop_owner_role.value ? (
                <>
                  <TextField
                    required
                    disabled
                    label={t("shop admin role")}
                    value={
                      shopAdmin.shop_admin_role_title.value
                    }
                    fullWidth
                  />
                  <Typography variant="overline" color={"primary"}>
                    {t(
                      "this is shop owner admin, you can not modify this shop admin"
                    )}
                  </Typography>
                </>
              ) : (
                <ShopAdminRoleSelect
                  fullWidth
                  margin="normal"
                  label={t("shop admin role")}
                  error={
                    !shopAdmin.shop_admin_role_id.is_valid
                  }
                  helperText={
                    shopAdmin.shop_admin_role_id.feedback
                  }
                  disabled={
                    !!shopAdmin.is_shop_owner_role.value ||
                    shopAdmin.shop_admin_role_id.disabled
                  }
                  required
                  value={shopAdmin.shop_admin_role_id.value}
                  onChange={(
                    value: unknown,
                    selectedShopAdminRole: any
                  ) => {
                    setShopAdmin(
                      update(shopAdmin, {
                        shop_admin_role_id: {
                          value: { $set: value }
                        },
                        selectedShopAdminRole: {
                          value: { $set: selectedShopAdminRole }
                        }
                      })
                    );
                  }}
                  variables={{
                    shop_id: context.shop.id,
                    is_shop_owner_role: 0
                  }}
                />
              )}
            </Grid>
            <Grid container item xs={12}>
              {shopAdmin.selectedShopAdminRole.value &&
              shopAdmin.selectedShopAdminRole.value
                .permission && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="h6">
                      {t("permission")}
                    </Typography>
                  </Grid>
                  {shopAdmin.selectedShopAdminRole.value.permission.map(
                    (permission: string) => (
                      <Grid
                        item
                        xs={6}
                        sm={4}
                        md={3}
                        key={permission}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              disabled={true}
                              checked={true}
                              value={permission}
                              color="primary"
                            />
                          }
                          label={t("permission$$" + permission)}
                        />
                      </Grid>
                    )
                  )}
                </>
              )}
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
                  onClick={toggleCloseDialog}
                  color="primary"
                >
                  {t("cancel")}
                </Button>
              </Grid>
              <Grid item>
                {!shopAdmin.is_shop_owner_role.value && (
                  <>
                    {context.permission.includes(
                      "CREATE_SHOP_ADMIN"
                    ) && !shopAdminId && (
                      <>
                        {isCreatingShopAdminMutation ?
                          <Button
                            disabled
                            variant="contained"
                            color="primary"
                          >
                            {t("creating...")}
                          </Button>
                          :
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={async () => {
                              if (await checkShopAdminForm())
                                createShopAdmin();
                            }}
                          >
                            {t("create shop admin")}
                          </Button>
                        }
                      </>
                    )}
                    {context.permission.includes(
                      "UPDATE_SHOP_ADMIN"
                    ) && shopAdminId && (
                      <>
                        {isEditingShopAdminMutation ?
                          <Button
                            disabled
                            variant="contained"
                            color="primary"
                          >
                            {t("editing...")}
                          </Button>
                          :
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={async () => {
                              if (await checkShopAdminForm())
                                editShopAdmin();
                            }}
                          >
                            {t("edit shop admin")}
                          </Button>
                        }
                      </>
                    )}
                  </>
                )}
              </Grid>
            </Grid>
          </>
        ) : (
          <React.Fragment>
            {new Array(4).fill(6).map((ele, index) => {
              return (
                <Grid key={index} item xs={12}>
                  <Skeleton variant={"rect"} height={50}/>
                </Grid>
              );
            })}
          </React.Fragment>
        )}
      </Grid>
    </Modal>
  </>;
}