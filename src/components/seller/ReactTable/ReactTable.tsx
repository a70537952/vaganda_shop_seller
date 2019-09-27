import Checkbox from "@material-ui/core/Checkbox";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import update from "immutability-helper";
import React, { useEffect, useState } from "react";
import RT from "react-table";
import Expander from "./Expander";
import FilterList from "./FilterList";
import Loading from "./Loading";
import NoData from "./NoData";
import Pagination from "./Pagination";
import Resizer from "./Resizer";
import Table from "./Table";
import Tbody from "./Tbody";
import Td from "./Td";
import Th from "./Th";
import Thead from "./Thead";
import Tr from "./Tr";
import TrGroup from "./TrGroup";
import { useDebouncedCallback } from "use-debounce";


export default function ReactTable(props: any) {
  const [debounceOnFetchData] = useDebouncedCallback(onFetchData, 500);
  // const debounceOnFetchData = debounce(onFetchData, 500);
  const [selected, setSelected] = useState<any>(new Set());
  const [filterFieldValue, setFilterFieldValue] = useState<any>({});
  const [pageSize, setPageSize] = useState<number>(10);

  useEffect(() => {
    debounceOnFetchData();
  }, [filterFieldValue]);

  function setNewFilterFieldValue(column: any, value: any) {
    setFilterFieldValue(
      update(filterFieldValue, {
        [column]: { $set: value }
      })
    );
  }

  function resetFilterFieldValue() {
    setFilterFieldValue({});
  }

  function onFetchData(
    state: any = { page: 0, sorted: [], pageSize: pageSize },
    instance?: any
  ) {
    if (props.onFetchData) {
      state.filtered = filterFieldValue;
      props.onFetchData(state, instance);
    }
  }

  let {
    columns,
    showCheckbox,
    data,
    resizable,
    defaultPageSize
  } = props;

  columns = columns.map((column: any) => column);
  if (showCheckbox) {
    columns.unshift({
      expander: true,
      headerClassName: "-expander",
      className: "-expander",
      width: 40
    });

    columns.unshift({
      id: "checkbox",
      sortable: false,
      Header: () => (
        <Checkbox
          color="primary"
          checked={
            data.length !== 0 && selected.size === data.length
          }
          onChange={e => {
            if (e.target.checked) {
              setSelected(new Set(data.map((item: any) => item.id)));
            } else {
              setSelected(new Set());
            }
          }}
        />
      ),
      width: 40,
      accessor: (d: any) => d,
      Cell: ({ value }: any) => (
        <Checkbox
          color="primary"
          checked={selected.has(value.id)}
          onChange={e => {
            let selectedSet = new Set(Array.from(selected));
            if (e.target.checked) {
              setSelected(selectedSet.add(value.id));
            } else {
              selectedSet.delete(value.id);
              setSelected(selectedSet);
            }
          }}
        />
      ),
      headerClassName: "-checkbox",
      className: "-checkbox"
    });
  }
  return <React.Fragment>
    <FilterList
      {...props}
      filterFieldValue={filterFieldValue}
      setFilterFieldValue={setNewFilterFieldValue}
      resetFilterFieldValue={resetFilterFieldValue}
      selected={selected}
      setSelected={setSelected}
      onFetchData={onFetchData}
      columns={columns}
    />
    {/*
  				// @ts-ignore */}
    <RT
      style={{
        position: "relative",
        width: "100%"
      }}
      columns={columns.filter((column: any) => !column.hide)}
      manual={props.manual}
      data={props.data}
      pages={props.pages ? props.pages : 1}
      loading={props.loading}
      minRows={1}
      //showPaginationBottom={false}
      showPageSizeOptions={false}
      resizable={!!resizable}
      pageSizeOptions={[5, 10, 20, 25, 50, 100]}
      showPagination={
        props.showPagination !== null
          ? props.showPagination
          : true
      }
      showPageJump={false}
      sortable={true}
      totalRow={
        props.totalRow ? props.totalRow : props.data.length
      }
      onFetchData={(state, instance) => {
        setSelected(new Set());
        onFetchData(state, instance);
      }}
      //filterable
      defaultPageSize={defaultPageSize || 10}
      className="tablesorter table"
      NoDataComponent={props => {
        return <NoData loading={props.loading} {...props} />;
      }}
      TableComponent={Table}
      TheadComponent={Thead}
      TbodyComponent={Tbody}
      TrGroupComponent={TrGroup}
      TrComponent={Tr}
      ThComponent={Th}
      TdComponent={Td}
      ResizerComponent={Resizer}
      PaginationComponent={props => {
        let onPageSizeChange = (pageSize: number) => {
          setPageSize(pageSize);
          props.onPageSizeChange(pageSize);
        };

        return (
          <Pagination onPageSizeChange={onPageSizeChange} {...props} />
        );
      }}
      LoadingComponent={Loading}
      ExpanderComponent={(expanderProps) => {
        expanderProps = { ...expanderProps }; // clone readonly props to modify property
        delete expanderProps.classes;
        return (
          <Expander
            hasSubComponent={!!props.SubComponent}
            {...expanderProps}
          />
        );
      }}
      SubComponent={data => {
        if (!props.SubComponent || !props.columns) return;
        return (
          <TableRow>
            <TableCell
              align="right"
              colSpan={props.columns.length + 1}
            >
              {props.SubComponent(data)}
            </TableCell>
          </TableRow>
        );
      }}
    />
  </React.Fragment>;
}