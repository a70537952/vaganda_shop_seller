import React from 'react';
import HomeHelmet from '../../components/home/HomeHelmet';
import { AppContext } from '../../contexts/home/Context';
import { WithTranslation, withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { RouteComponentProps } from 'react-router';
import gql from 'graphql-tag';
import Grid from '@material-ui/core/Grid';
import { Query } from 'react-apollo';

interface IProps {}

interface IState {}

class Home extends React.Component<
  IProps & RouteComponentProps & WithTranslation,
  IState
> {
  render() {
    let { t } = this.props;
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
            <Grid container spacing={3}>
              <Query
                query={gql`
                  query ProductCategory {
                    productCategory {
                      items {
                        id
                        title
                        child_category {
                          id
                          title
                          child_category {
                            id
                            title
                          }
                        }
                      }
                    }
                  }
                `}
              >
                {({ loading, error, data }) => {
                  if (error) return <>Error!</>;
                  if (loading) return null;
                  let productCategories = data.productCategory.items;
                  return <React.Fragment></React.Fragment>;
                }}
              </Query>
            </Grid>
          </React.Fragment>
        )}
      </AppContext.Consumer>
    );
  }
}

export default withStyles(theme => ({
  root: {
    flexGrow: 1,
    width: '100%'
  },
  tabContent: {
    marginTop: '35px'
  }
}))(withTranslation()(withRouter(Home)));
