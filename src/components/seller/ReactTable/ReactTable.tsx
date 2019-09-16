import Checkbox from "@material-ui/core/Checkbox";
import { withStyles } from "@material-ui/core/styles/index";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import update from "immutability-helper";
import React from "react";
import { withRouter } from "react-router-dom";
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

class ReactTable extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      selected: new Set(),
      filterFieldValue: {},
      pageSize: 10
    };
  }

  setFilterFieldValue(column: any, value: any) {
    this.setState(
      update(this.state, {
        filterFieldValue: {
          [column]: { $set: value }
        }
      })
    );
  }

  resetFilterFieldValue() {
    this.setState(
      update(this.state, {
        filterFieldValue: { $set: {} }
      })
    );
  }

  onFetchData(
    state: any = { page: 0, sorted: [], pageSize: this.state.pageSize },
    instance: any
  ) {
    if (this.props.onFetchData) {
      state.filtered = this.state.filterFieldValue;
      this.props.onFetchData(state, instance);
    }
  }

  setSelected(data: any) {
    this.setState(
      update(this.state, {
        selected: { $set: data }
      })
    );
  }

  render() {
    let {
      columns,
      classes,
      title,
      showCheckbox,
      showFilter,
      data,
      resizable,
      defaultPageSize
    } = this.props;
    // Clone array to prevent changing props columns
    columns = columns.map((column: any) => column);
    if (showCheckbox) {
      columns.unshift({
        expander: true,
        headerClassName: '-expander',
        className: '-expander',
        width: 40
      });

      columns.unshift({
        id: 'checkbox',
        sortable: false,
        Header: () => (
          <Checkbox
            color="primary"
            checked={
              data.length !== 0 && this.state.selected.size === data.length
            }
            onChange={e => {
              if (e.target.checked) {
                this.setSelected(new Set(data.map((item: any) => item.id)));
              } else {
                this.setSelected(new Set());
              }
            }}
          />
        ),
        width: 40,
        accessor: (d: any) => d,
        Cell: ({ value }: any) => (
          <Checkbox
            color="primary"
            checked={this.state.selected.has(value.id)}
            onChange={e => {
              if (e.target.checked) {
                this.setSelected(this.state.selected.add(value.id));
              } else {
                this.state.selected.delete(value.id);
                this.setSelected(this.state.selected);
              }
            }}
          />
        ),
        headerClassName: '-checkbox',
        className: '-checkbox'
      });
    }
    return (
      <React.Fragment>
        <FilterList
          {...this.props}
          filterFieldValue={this.state.filterFieldValue}
          setFilterFieldValue={this.setFilterFieldValue.bind(this)}
          resetFilterFieldValue={this.resetFilterFieldValue.bind(this)}
          selected={this.state.selected}
          setSelected={this.setSelected.bind(this)}
          onFetchData={this.onFetchData.bind(this)}
          columns={columns}
        />
        {/*
  				// @ts-ignore */}
        <RT
          style={{
            position: 'relative',
            width: '100%'
          }}
          columns={columns.filter((column: any) => !column.hide)}
          manual={this.props.manual}
          data={this.props.data}
          pages={this.props.pages ? this.props.pages : 1}
          loading={this.props.loading}
          minRows={1}
          //showPaginationBottom={false}
          showPageSizeOptions={false}
          resizable={!!resizable}
          pageSizeOptions={[5, 10, 20, 25, 50, 100]}
          showPagination={
            this.props.showPagination !== null
              ? this.props.showPagination
              : true
          }
          showPageJump={false}
          sortable={true}
          totalRow={
            this.props.totalRow ? this.props.totalRow : this.props.data.length
          }
          onFetchData={(state, instance) => {
            this.setState(
              update(this.state, {
                selected: { $set: new Set() }
              })
            );
            this.onFetchData(state, instance);
          }}
          //filterable
          defaultPageSize={defaultPageSize || 10}
          className="tablesorter table"
          NoDataComponent={props => {
            return <NoData loading={this.props.loading} {...props} />;
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
              this.setState(
                update(this.state, {
                  pageSize: { $set: pageSize }
                })
              );
              props.onPageSizeChange(pageSize);
            };

            return (
              <Pagination onPageSizeChange={onPageSizeChange} {...props} />
            );
          }}
          LoadingComponent={Loading}
          ExpanderComponent={props => {
            props = { ...props }; // clone readonly props to modify property
            delete props.classes;
            return (
              <Expander
                hasSubComponent={!!this.props.SubComponent}
                {...props}
              />
            );
          }}
          SubComponent={data => {
            if (!this.props.SubComponent || !this.props.columns) return;
            return (
              <TableRow>
                <TableCell
                  align="right"
                  colSpan={this.props.columns.length + 1}
                >
                  {this.props.SubComponent(data)}
                </TableCell>
              </TableRow>
            );
          }}
        />
      </React.Fragment>
    );
  }
}

export default withStyles(theme => ({}))(withRouter(ReactTable));
