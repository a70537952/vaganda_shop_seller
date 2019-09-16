import React from 'react';
import { Route, withRouter } from 'react-router-dom';
import { AppContext } from '../../contexts/home/Context';
import { RouteComponentProps } from 'react-router';

const RedirectToLogin: any = withRouter(
  class RedirectToLogin extends React.Component<
    RouteComponentProps,
    Readonly<any>
  > {
    render() {
      this.props.history.push('/');
      return <React.Fragment />;
    }
  } as any
);

const AuthRoute: React.FunctionComponent<any> = ({
  component: Component,
  ...rest
}) => (
  <AppContext.Consumer>
    {context => (
      <Route
        {...rest}
        render={props =>
          context.user ? (
            <Component {...props} {...rest} />
          ) : (
            <RedirectToLogin context={context} />
          )
        }
      />
    )}
  </AppContext.Consumer>
);

export default AuthRoute;
