import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Fade from "@material-ui/core/Fade";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import InputLabel from "@material-ui/core/InputLabel";
import { lighten } from "@material-ui/core/styles/colorManipulator";
import { makeStyles, Theme } from "@material-ui/core/styles/index";
import TextField from "@material-ui/core/TextField";
import Toolbar from "@material-ui/core/Toolbar";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import FilterListIcon from "@material-ui/icons/FilterList";
import RefreshIcon from "@material-ui/icons/Refresh";
import classnames from "classnames";
import { debounce } from "debounce";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Popover } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";

interface IProps {
  onFetchData?: any;
  filterFieldValue?: any;
  setFilterFieldValue?: any;
  columns?: any;
  title?: any;
  showCheckbox?: boolean;
  showFilter?: boolean;
  data?: any;
  selected?: any;
  actionList?: any;
  loading?: boolean;
  setSelected?: any;
  resetFilterFieldValue?: any;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%"
  },
  highlight: {
    ...(theme.palette.type === "light"
      ? {
        color: theme.palette.primary.main,
        backgroundColor: lighten(theme.palette.primary.light, 0.85)
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark
      }),
    ...{
      [theme.breakpoints.down("xs")]: {
        flexDirection: "column",
        paddingTop: "10px",
        paddingBottom: "10px"
      }
    }
  },
  spacer: {
    flex: "1 1 100%"
  },
  actions: {
    color: theme.palette.text.secondary
  },
  actionListContainer: {
    [theme.breakpoints.down("xs")]: {
      justifyContent: "center"
    }
  },
  title: {
    flex: "0 0 auto"
  },
  filterListPaper: {
    padding: theme.spacing(2),
    maxWidth: 400
  },
  filterButtonTitle: {
    display: "unset",
    marginRight: theme.spacing(1)
  },
  actionLoading: {
    color: "white",
    width: "22px !important",
    height: "22px !important"
  },
  confirmMessage: {
    color: "red"
  }
}));

export default function FilterList(props: IProps) {
  const classes = useStyles();
  const { t } = useTranslation();
  const [filterListAnchorEl, setFilterListAnchorEl] = useState<any>(undefined);
  const onFetchData = debounce(props.onFetchData, 350);

  const {
    filterFieldValue,
    setFilterFieldValue,
    columns,
    title,
    showFilter,
    data,
    selected,
    actionList,
    loading,
    setSelected,
    resetFilterFieldValue
  } = props;

  function handleFilterListOpen(event: any) {
    setFilterListAnchorEl(event.currentTarget);
  }

  function handleFilterListClose() {
    setFilterListAnchorEl(null);
  }

  function renderFilterInput(column: any) {
    let filterType = column.filterType;
    if (filterType === "select") {
      return (
        <FormControl margin="none" fullWidth>
          <InputLabel htmlFor={column.Header}>{column.Header}</InputLabel>
          {column.filterComponent({
            label: column.Header,
            value: filterFieldValue[column.id] || "",
            onChange: (e: any) => {
              e.persist();
              setFilterFieldValue(column.id, e.target.value);
              onFetchData();
            },
            fullWidth: true,
            inputProps: {
              name: column.Header,
              id: column.Header
            }
          })}
        </FormControl>
      );
    } else {
      return (
        <TextField
          label={column.Header}
          value={filterFieldValue[column.id] || ""}
          onChange={(e: { persist: () => void; target: { value: any } }) => {
            e.persist();
            setFilterFieldValue(column.id, e.target.value);
            onFetchData();
          }}
          fullWidth
        />
      );
    }
  }

  let numSelected = selected.size;
  let fadeTimeout = 320;
  return <>

    {(title || showFilter) && (
      <Toolbar
        className={classnames(classes.root, {
          [classes.highlight]: numSelected > 0
        })}
      >
        <div className={classes.title}>
          <Fade
            in={numSelected > 0}
            timeout={fadeTimeout}
            style={{ display: numSelected > 0 ? "block" : "none" }}
          >
            <Typography color="inherit" variant="subtitle1">
              {numSelected} {t("selected")}
            </Typography>
          </Fade>
          <Fade
            in={numSelected === 0}
            timeout={fadeTimeout}
            style={{ display: numSelected === 0 ? "block" : "none" }}
          >
            <Typography variant="h6" id="tableTitle">
              {title}
            </Typography>
          </Fade>
        </div>
        <Grid
          container
          justify="flex-end"
          spacing={1}
          className={classes.actions}
        >
          <Fade
            in={numSelected > 0}
            timeout={fadeTimeout}
            style={{ display: numSelected > 0 ? "inherit" : "none" }}
          >
            <Grid
              container
              item
              spacing={1}
              justify={"flex-end"}
              className={classes.actionListContainer}
            >
              {actionList &&
              actionList.map((action: any, index: number) => {
                let selectedIds = Array.from(selected);
                let selectedData = data.filter((item: any) =>
                  selectedIds.includes(item.id)
                );

                if (action.customComponent)
                  return (
                    <Grid item key={index}>
                      {action.customComponent(selectedData)}
                    </Grid>
                  );
                if (action.component)
                  return action.component(ActionComponent(action, selectedData, setSelected, numSelected));
              })}
            </Grid>
          </Fade>
          {showFilter && (
            <Fade
              in={numSelected === 0}
              timeout={fadeTimeout}
              style={{ display: numSelected === 0 ? "inherit" : "none" }}
            >
                <span>
                {!loading && (
                  <>
                    <Tooltip title={t("refresh data")}>
                      <IconButton
                        onClick={e => {
                          e.persist();
                          onFetchData();
                        }}
                        aria-label={t("refresh data")}
                      >
                        <RefreshIcon/>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t("filter list")}>
                      <IconButton
                        onClick={handleFilterListOpen}
                        aria-label={t("filter list")}
                      >
                        <FilterListIcon/>
                      </IconButton>
                    </Tooltip>
                  </>
                )}
                  <Popover
                    open={Boolean(filterListAnchorEl)}
                    anchorEl={filterListAnchorEl}
                    onClose={handleFilterListClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right"
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right"
                    }}
                  >
                    <Paper className={classes.filterListPaper} elevation={0}>
                  <Grid container>
                  <Grid container>
                  <Grid item xs={12}>
                  <Typography
                    variant="button"
                    className={classes.filterButtonTitle}
                  >
                  {t("filters")}
                  </Typography>
                  <Button
                    color="primary"
                    onClick={(e: { persist: () => void }) => {
                      e.persist();
                      resetFilterFieldValue();
                      onFetchData();
                    }}
                  >
                  {t("reset")}
                  </Button>
                  </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                  {columns.map((column: any) => {
                    if (!column.filterable) return null;
                    return (
                      <Grid key={column.Header} item xs={6}>
                        {renderFilterInput(column)}
                      </Grid>
                    );
                  })}
                  </Grid>
                  </Grid>
                </Paper>
                </Popover>
              </span>
            </Fade>
          )}
        </Grid>
      </Toolbar>
    )}
  </>;
}

let ActionComponent = (action: any, selectedData: any, setSelected: any, numSelected: any) => function ActionComponent(props: { onClick: (selectedData: any[]) => void | boolean, loading: boolean }) {
  const { loading } = props;
  const { t } = useTranslation();
  const classes = useStyles();
  const [isActionDialogOpen, setIsActionDialogOpen] = useState<boolean>(false);

  function actionOnClick() {
    if (!loading) {
      toggleActionDialog();
    }
  }

  function handleCancelActionDialog() {
    setIsActionDialogOpen(false);
  }

  async function handleOkActionDialog() {
    setIsActionDialogOpen(false);
    let isPerform = await props.onClick(selectedData);
    if (isPerform !== false) {
      setSelected(new Set());
    }
  }

  function toggleActionDialog() {
    setIsActionDialogOpen(isActionDialogOpen => !isActionDialogOpen);
  }

  return <Grid item key={action.title}>
    <Dialog
      maxWidth="sm"
      open={isActionDialogOpen}
      onClose={handleCancelActionDialog}
    >
      <DialogTitle>{t("confirm")}</DialogTitle>
      <DialogContent>
        {action && (
          <>
            <Typography variant="subtitle1" gutterBottom>
              {t("are you sure {{action}} {{count}} selected?", {
                action: action.actionName
                  ? action.actionName.toLowerCase()
                  : action.title
                    ? action.title.toLowerCase()
                    : "",
                count: numSelected
              })}
            </Typography>
            {action.confirmMessage && (
              <Typography
                variant="subtitle2"
                className={classes.confirmMessage}
              >
                {action.confirmMessage}
              </Typography>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleCancelActionDialog}
          color="primary"
        >
          {t("cancel")}
        </Button>
        <Button
          onClick={handleOkActionDialog}
          color="primary"
        >
          {t("confirm")}
        </Button>
      </DialogActions>
    </Dialog>
    <Tooltip title={action.title}>
      {action.icon ? (
        <IconButton
          aria-label={action.title}
          onClick={actionOnClick}
        >
          {loading ? (
            <CircularProgress
              className={classes.actionLoading}
            />
          ) : (
            <React.Fragment>
              {action.icon}
            </React.Fragment>
          )}
        </IconButton>
      ) : (
        <Button
          variant="contained"
          size="small"
          color="primary"
          onClick={actionOnClick}
        >
          {loading ? (
            <CircularProgress
              className={classes.actionLoading}
            />
          ) : (
            <React.Fragment>
              {action.title}
            </React.Fragment>
          )}
        </Button>
      )}
    </Tooltip>
  </Grid>;
};
