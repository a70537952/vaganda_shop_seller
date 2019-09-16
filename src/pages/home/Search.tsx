import React from 'react';
import HomeHelmet from '../../components/home/HomeHelmet';
import { AppContext } from '../../contexts/home/Context';
import { WithTranslation, withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { RouteComponentProps } from 'react-router';
import Grid from '@material-ui/core/Grid';
import ProductList from '../../components/home/Product/ProductList';
import ShopList from '../../components/home/Shop/ShopList';

let t;

interface IProps {
  classes: any;
  setSearchValue: (value: string) => void;
  setSearchType: (type: 'product' | 'shop') => void;
}

interface IState {
  searchType: 'product' | 'shop';
  searchValue: string;
}

class Search extends React.Component<
  IProps & RouteComponentProps & WithTranslation,
  IState
> {
  constructor(props: IProps & RouteComponentProps & WithTranslation) {
    super(props);

    t = this.props.t;

    this.state = {
      searchValue: '',
      searchType: 'product'
    };
  }

  componentDidMount() {
    // do not know why not working without set timeout
    setTimeout(() => {
      this.props.setSearchValue(this.state.searchValue);
      this.props.setSearchType(this.state.searchType);
    }, 100);
  }

  componentDidUpdate(prevProps: any, prevState: IState, snapshot: any) {
    if (prevState.searchValue !== this.state.searchValue) {
      this.props.setSearchValue(this.state.searchValue);
    }

    if (prevState.searchType !== this.state.searchType) {
      this.props.setSearchType(this.state.searchType);
    }
  }

  componentWillUnmount() {
    this.props.setSearchValue('');
    this.props.setSearchType('product');
  }

  static getDerivedStateFromProps(props: any, state: any) {
    if (
      props.match.params.searchValue !== state.searchValue ||
      props.match.params.searchType !== state.searchType
    ) {
      let newState = state;
      newState.searchValue = props.match.params.searchValue;
      newState.searchType = props.match.params.searchType;

      return newState;
    }
    return null;
  }

  render() {
    let { searchType, searchValue } = this.state;
    let { t, classes } = this.props;

    return (
      <AppContext.Consumer>
        {context => (
          <React.Fragment>
            <HomeHelmet
              title={t('')}
              description={''}
              keywords={t('')}
              ogImage="/images/favicon-228.png"
            />
            <Grid container spacing={1} className={classes.root}>
              {searchType === 'product' && (
                <ProductList
                  variables={{
                    where_like_title: searchValue,
                    sort_created_at: 'desc'
                  }}
                />
              )}

              {searchType === 'shop' && (
                <ShopList
                  variables={{
                    where_like_name: searchValue
                  }}
                />
              )}
            </Grid>
          </React.Fragment>
        )}
      </AppContext.Consumer>
    );
  }
}

export default withStyles(theme => ({
  root: {
    padding: '0 16px'
  }
}))(withTranslation()(withRouter(Search)));
