import React from 'react';
import classNames from 'classnames';
/* CSS */
import './__COMPONENT_NAME__.scss';
/* CSS-END */

export default class __COMPONENT_NAME__PASCAL_CASE extends React.Component {
  componentWillMount() {}
  componentDidMount() {}
  componentWillReceiveProps() {}
  shouldComponentUpdate() { return true; }
  componentWillUpdate() {}
  componentDidUpdate() {}
  componentWillUnmount() {}

  render() {
    const classes = classNames('__COMPONENT_NAME__', this.props.classes);

    return (
      <div className={classes}>
        <h1>My Component</h1>
      </div>
    );
  }
}

__COMPONENT_NAME__PASCAL_CASE.propTypes = {
  classes: React.PropTypes.string
};
