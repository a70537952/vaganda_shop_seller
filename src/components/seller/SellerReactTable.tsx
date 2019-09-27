import React, { useEffect, useState } from "react";
import ReactTable from "./ReactTable/ReactTable";
import { useApolloClient } from "react-apollo";
import { Pagination } from "../../graphql/query/Query";

export default function SellerReactTable(props: any) {
  const client = useApolloClient();

  const [data, setData] = useState<{
    items: any[],
    cursor: Pagination
  }>({ items: [], cursor: { total: 1000, perPage: 10, currentPage: 1, hasPages: false } });
  const [loading, setLoading] = useState<boolean>(true);
  const [subscription, setSubscription] = useState<any>(null);
  const [tableKey, setTableKey] = useState<any>(null);

  const {
    limit,
    SubComponent,
    columns,
    title,
    showCheckbox,
    showFilter,
    actionList,
    query,
    fetchPolicy,
    notifyOnNetworkStatusChange,
    showPagination,
    defaultPageSize
  } = props;

  useEffect(() => {
    setTableKey(+new Date());
  }, [props.variables]);


  return <ReactTable
    showPagination={showPagination}
    defaultPageSize={defaultPageSize}
    key={tableKey}
    manual
    loading={loading}
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
        variables["sort_" + sort.id] = sort.desc ? "desc" : "asc";
      });

      Object.keys(state.filtered).forEach(filterField => {
        if (state.filtered[filterField] !== "") {
          let columnData = columns.find(
            (column: any) => column.id === filterField
          );
          if (columnData.filterByWhere) {
            variables["where_" + filterField] = state.filtered[filterField];
          } else if (columnData.filterDirectly) {
            variables[filterField] = state.filtered[filterField];
          } else {
            variables["where_like_" + filterField] =
              state.filtered[filterField];
          }
        }
      });

      await setLoading(true);
      if (subscription) {
        subscription.unsubscribe();
      }

      let propsVariables = props.variables;
      if (state.sorted.length > 0) {
        Object.keys(propsVariables)
          .filter(key => key.includes("sort_"))
          .forEach(key => {
            delete propsVariables[key];
          });
      }

      let newSubscription = client
        .watchQuery({
          query: query,
          variables: {
            ...propsVariables,
            ...variables
          },
          fetchPolicy: fetchPolicy ? fetchPolicy : "cache-and-network",
          notifyOnNetworkStatusChange: notifyOnNetworkStatusChange
            ? notifyOnNetworkStatusChange
            : true
        })
        .subscribe({
          next({ loading, fetchMore, error, data, refetch }: any) {
            setLoading(loading);
            if (data) {
              let dataKey = Object.keys(data)[0];
              setData(data[dataKey]);
            }
          },
          error(err: any) {
          },
          complete() {
          }
        });

      setSubscription(newSubscription);
    }}
    SubComponent={SubComponent}
    title={title}
    showCheckbox={showCheckbox}
    showFilter={showFilter}
    actionList={actionList}
    resizable={false}
  />;
}