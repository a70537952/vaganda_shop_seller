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
import Paper from "@material-ui/core/Paper";
import Popover from "@material-ui/core/Popover";
import { lighten } from "@material-ui/core/styles/colorManipulator";
import { withStyles } from "@material-ui/core/styles/index";
import TextField from "@material-ui/core/TextField";
import Toolbar from "@material-ui/core/Toolbar";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import FilterListIcon from "@material-ui/icons/FilterList";
import RefreshIcon from "@material-ui/icons/Refresh";
import classnames from "classnames";
import { debounce } from "debounce";
import update from "immutability-helper";
import React from "react";
import { withRouter } from "react-router-dom";
import { WithTranslation, withTranslation } from "react-i18next";
import { RouteComponentProps } from "react-router";

interface IProps {
  classes?: any;
  context?: any;
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
  onClick?: any;
  resetFilterFieldValue?: any;
}

interface IState {
  filterListAnchorEl?: any;
  isActionDialogOpen: boolean;
  performingAction: any;
  action?: any;
}

class FilterList extends React.Component<
  IProps & RouteComponentProps & WithTranslation,
  IState
> {
  onFetchData: any;

  constructor(props: IProps & RouteComponentProps & WithTranslation) {
    super(props);
    this.state = {
      filterListAnchorEl: undefined,
      isActionDialogOpen: false,
      performingAction: null,
      action: undefined
    };

    this.onFetchData = debounce(this.props.onFetchData, 350);
  }

  handleFilterListOpen(event: any) {
    this.setState({
      filterListAnchorEl: event.currentTarget
    });
  }

  handleFilterListClose() {
    this.setState({
      filterListAnchorEl: null
    });
  }

  renderFilterInput(column: any) {
    let filterType = column.filterType;
    if (filterType === 'select') {
      return (
        <FormControl margin="none" fullWidth>
          <InputLabel htmlFor={column.Header}>{column.Header}</InputLabel>
          {column.filterComponent({
            label: column.Header,
            value: this.props.filterFieldValue[column.id] || '',
            onChange: (e: any) => {
              e.persist();
              this.props.setFilterFieldValue(column.id, e.target.value);
              this.onFetchData();
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
          value={this.props.filterFieldValue[column.id] || ''}
          onChange={(e: { persist: () => void; target: { value: any } }) => {
            e.persist();
            this.props.setFilterFieldValue(column.id, e.target.value);
            this.onFetchData();
          }}
          fullWidth
        />
      );
    }
  }

  handleCancelActionDialog() {
    this.setState(
      update(this.state, {
        isActionDialogOpen: { $set: false },
        performingAction: { $set: null }
      })
    );
  }

  handleOkActionDialog() {
    if (this.state.performingAction) this.state.performingAction();
    this.setState(
      update(this.state, {
        isActionDialogOpen: { $set: false },
        performingAction: { $set: null }
      })
    );
  }

  toggleActionDialog(performingAction: any, action: any) {
    this.setState(
      update(this.state, {
        isActionDialogOpen: { $set: true },
        performingAction: { $set: performingAction },
        action: { $set: action }
      })
    );
  }

  render() {
    let {
      columns,
      classes,
      title,
      showCheckbox,
      loading,
      showFilter,
      data,
      selected,
      actionList,
      t
    } = this.props;
    let numSelected = selected.size;
    let fadeTimeout = 320;
    return (
      <React.Fragment>
        <Dialog
          maxWidth="sm"
          open={this.state.isActionDialogOpen}
          onClose={this.handleCancelActionDialog.bind(this)}
        >
          <DialogTitle>{t('confirm')}</DialogTitle>
          <DialogContent>
            {this.state.action && (
              <>
                <Typography variant="subtitle1" gutterBottom>
                  {t('are you sure {{action}} {{count}} selected?', {
                    action: this.state.action.actionName
                      ? this.state.action.actionName.toLowerCase()
                      : this.state.action.title
                      ? this.state.action.title.toLowerCase()
                      : '',
                    count: numSelected
                  })}
                </Typography>
                {this.state.action.confirmMessage && (
                  <Typography
                    variant="subtitle2"
                    className={classes.confirmMessage}
                  >
                    {this.state.action.confirmMessage}
                  </Typography>
                )}
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleCancelActionDialog.bind(this)}
              color="primary"
            >
              {t('cancel')}
            </Button>
            <Button
              onClick={this.handleOkActionDialog.bind(this)}
              color="primary"
            >
              {t('confirm')}
            </Button>
          </DialogActions>
        </Dialog>

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
                style={{ display: numSelected > 0 ? 'block' : 'none' }}
              >
                <Typography color="inherit" variant="subtitle1">
                  {numSelected} {t('selected')}
                </Typography>
              </Fade>
              <Fade
                in={numSelected === 0}
                timeout={fadeTimeout}
                style={{ display: numSelected === 0 ? 'block' : 'none' }}
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
                style={{ display: numSelected > 0 ? 'inherit' : 'none' }}
              >
                <Grid
                  container
                  item
                  spacing={1}
                  justify={'flex-end'}
                  className={classes.actionListContainer}
                >
                  {actionList &&
                    actionList.map((action: any, index: number) => {
                      let react = this;
                      let selectedIds = Array.from(selected);
                      let selectedData = data.filter((item: any) =>
                        selectedIds.includes(item.id)
                      );
                      let toggleActionDialog = this.toggleActionDialog.bind(
                        this
                      );
                      if (action.customComponent)
                        return (
                          <Grid item key={index}>
                            {action.customComponent(selectedData)}
                          </Grid>
                        );
                      if (action.component)
                        return action.component(
                          class component extends React.Component<any, any> {
                            render() {
                              return (
                                <Grid item key={action.title}>
                                  <Tooltip title={action.title}>
                                    {action.icon ? (
                                      <IconButton
                                        aria-label={action.title}
                                        onClick={() => {
                                          if (!this.props.loading) {
                                            toggleActionDialog(async () => {
                                              let isPerform = await this.props.onClick(
                                                selectedData
                                              );
                                              if (isPerform !== false) {
                                                react.props.setSelected(
                                                  new Set()
                                                );
                                              }
                                            }, action);
                                          }
                                        }}
                                      >
                                        {this.props.loading ? (
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
                                        onClick={async () => {
                                          if (!this.props.loading) {
                                            toggleActionDialog(async () => {
                                              let isPerform = await this.props.onClick(
                                                selectedData
                                              );
                                              if (isPerform !== false) {
                                                react.props.setSelected(
                                                  new Set()
                                                );
                                              }
                                            }, action);
                                          }
                                        }}
                                      >
                                        {this.props.loading ? (
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
                                </Grid>
                              );
                            }
                          }
                        );
                    })}
                </Grid>
              </Fade>
              {showFilter && (
                <Fade
                  in={numSelected === 0}
                  timeout={fadeTimeout}
                  style={{ display: numSelected === 0 ? 'inherit' : 'none' }}
                >
                  <span>
                    {!loading && (
                      <>
                        <Tooltip title={t('refresh data')}>
                          <IconButton
                            onClick={e => {
                              e.persist();
                              this.onFetchData();
                            }}
                            aria-label={t('refresh data')}
                          >
                            <RefreshIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t('filter list')}>
                          <IconButton
                            onClick={this.handleFilterListOpen.bind(this)}
                            aria-label={t('filter list')}
                          >
                            <FilterListIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                    <Popover
                      open={Boolean(this.state.filterListAnchorEl)}
                      anchorEl={this.state.filterListAnchorEl}
                      onClose={this.handleFilterListClose.bind(this)}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right'
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right'
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
                                {t('filters')}
                              </Typography>
                              <Button
                                color="primary"
                                onClick={(e: { persist: () => void }) => {
                                  e.persist();
                                  this.props.resetFilterFieldValue();
                                  this.onFetchData();
                                }}
                              >
                                {t('reset')}
                              </Button>
                            </Grid>
                          </Grid>
                          <Grid container spacing={2}>
                            {columns.map((column: any) => {
                              if (!column.filterable) return null;
                              return (
                                <Grid key={column.Header} item xs={6}>
                                  {this.renderFilterInput(column)}
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
      </React.Fragment>
    );
  }
}

export default withStyles(
  theme => ({
    root: {
      width: '100%'
    },
    highlight: {
      ...(theme.palette.type === 'light'
        ? {
            color: theme.palette.primary.main,
            backgroundColor: lighten(theme.palette.primary.light, 0.85)
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark
          }),
      ...{
        [theme.breakpoints.down('xs')]: {
          flexDirection: 'column',
          paddingTop: '10px',
          paddingBottom: '10px'
        }
      }
    },
    spacer: {
      flex: '1 1 100%'
    },
    actions: {
      color: theme.palette.text.secondary
    },
    actionListContainer: {
      [theme.breakpoints.down('xs')]: {
        justifyContent: 'center'
      }
    },
    title: {
      flex: '0 0 auto'
    },
    filterListPaper: {
      padding: theme.spacing(2),
      maxWidth: 400
    },
    filterButtonTitle: {
      display: 'unset',
      marginRight: theme.spacing(1)
    },
    actionLoading: {
      color: 'white',
      width: '22px !important',
      height: '22px !important'
    },
    confirmMessage: {
      color: 'red'
    }
  }),
  { withTheme: true }
)(withTranslation()(withRouter(FilterList)));
