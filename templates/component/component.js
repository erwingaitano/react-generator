import React from 'react';
import classNames from 'classnames';
/* CSS */
import './__COMPONENT_NAME__.scss';
/* CSS-END */

export default class Component extends React.Component {
  render() {
    const classes = classNames('list', this.props.classes);

    return (
      <div className={classes}>
        <h1>My Component</h1>
      </div>
    );
  }
}

Component.propTypes = {
  classes: React.PropTypes.string
};
