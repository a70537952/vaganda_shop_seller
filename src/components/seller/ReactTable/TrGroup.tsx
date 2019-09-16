import React from "react";

export default class ReactTableTrGroup extends React.Component<any, any> {
  render() {
    const { children, className, style } = this.props;
    return children;
  }
}
