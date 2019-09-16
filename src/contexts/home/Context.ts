import React from 'react';

export interface IContext {
  user: any;
  getContext: () => void;
}

export const AppContext = React.createContext<any>({
  user: {},
  getContext: () => {}
});
