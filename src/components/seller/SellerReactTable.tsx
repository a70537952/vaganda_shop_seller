import { withStyles } from '@material-ui/core/styles/index';
import update from 'immutability-helper';
import React from 'react';
import { withRouter } from 'react-router-dom';
import ReactTable from './ReactTable/ReactTable';
import { RouteComponentProps } from 'react-router';
import { withApollo, WithApolloClient } from 'react-apollo';

interface IState {
  data: any;
  loading: boolean;
  subscription: any;
  tableKey?: any;
  variables: any;
}

class SellerReactTable extends React.Component<
  any & WithApolloClient<{}>,
  IState
> {
  constructor(props: any & WithApolloClient<{}>) {
    super(props);
    this.state = {
      data: null,
      loading: true,
      subscription: null,
      tableKey: null,
      variables: {}
    };
  }

  static getDerivedStateFromProps(props: any, state: IState) {
    if (props.variables) {
      let newState = { ...state };

      let propValues = Object.values(props.variables);
      let stateValues = Object.values(state.variables);

      if (
        propValues.length !== stateValues.length ||
        !propValues.every(
          (value, index) => propValues[index] === stateValues[index]
        )
      ) {
        newState.variables = props.variables;
        newState.tableKey = +new Date();
      }
      return newState;
    }
    return null;
  }

  render() {
    const {
      classes,
      limit,
      SubComponent,
      columns,
      loading,
      title,
      showCheckbox,
      showFilter,
      actionList,
      query,
      fetchPolicy,
      notifyOnNetworkStatusChange,
      showPagination,
      defaultPageSize
    } = this.props;
    // simulate query data structure
    let data = { items: [], cursor: { total: 1000, perPage: 10 } };
    if (this.state.data) {
      let dataKey = Object.keys(this.state.data)[0];
      data = this.state.data[dataKey];
    }

    return (
      <ReactTable
        showPagination={showPagination}
        defaultPageSize={defaultPageSize}
        key={this.state.tableKey}
        manual
        loading={this.state.loading}
        columns={columns}
        data={data.items}
        pages={Math.ceil(data.cursor.total / data.cursor.perPage)}
        totalRow={data.cursor.total}
        onFetchData={async (state: any, instance: any) => {
          let variables: any = {
            offset: state.page * state.pageSize,
            limit: state.pageSize
          };

          state.sorted.forEach((sort: any) => {
            variables['sort_' + sort.id] = sort.desc ? 'desc' : 'asc';
          });

          Object.keys(state.filtered).forEach(filterField => {
            if (state.filtered[filterField] !== '') {
              let columnData = columns.find(
                (column: any) => column.id === filterField
              );
              if (columnData.filterByWhere) {
                variables['where_' + filterField] = state.filtered[filterField];
              } else if (columnData.filterDirectly) {
                variables[filterField] = state.filtered[filterField];
              } else {
                variables['where_like_' + filterField] =
                  state.filtered[filterField];
              }
            }
          });

          await this.setState(
            update(this.state, {
              loading: { $set: true }
            })
          );

          if (this.state.subscription) {
            this.state.subscription.unsubscribe();
          }
          let react = this;
          let propsVariables = this.props.variables;
          if (state.sorted.length > 0) {
            Object.keys(propsVariables)
              .filter(key => key.includes('sort_'))
              .forEach(key => {
                delete propsVariables[key];
              });
          }

          let subscription = this.props.client
            .watchQuery({
              query: query,
              variables: {
                ...propsVariables,
                ...variables
              },
              fetchPolicy: fetchPolicy ? fetchPolicy : 'cache-and-network',
              notifyOnNetworkStatusChange: notifyOnNetworkStatusChange
                ? notifyOnNetworkStatusChange
                : true
            })
            .subscribe({
              next({ loading, fetchMore, error, data, refetch }: any) {
                let updateObj: any = {
                  loading: { $set: loading }
                };
                if (data) {
                  updateObj['data'] = { $set: data };
                }
                react.setState(update(react.state, updateObj));
              },
              error(err: any) {},
              complete() {}
            });

          this.setState(
            update(this.state, {
              subscription: { $set: subscription }
            })
          );
        }}
        SubComponent={SubComponent}
        title={title}
        showCheckbox={showCheckbox}
        showFilter={showFilter}
        actionList={actionList}
        resizable={false}
      />
    );
  }
}

export default withStyles(theme => ({}))(withApollo(SellerReactTable));
