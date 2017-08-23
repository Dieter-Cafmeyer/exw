'use strict';

import React, {Component} from 'react';
import {isEmpty} from 'lodash';

export default class UserItem extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {naam} = this.props;

    return (
      <div>
        <h3>{naam}</h3>
      </div>
    );
  }
}

UserItem.propTypes = {
  naam: React.PropTypes.string
};
