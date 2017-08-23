'use strict';

import React, {Component} from 'react';
import {UserItem} from '../components/';


export default class Users extends Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {users} = this.props;

    //console.log(users);

    const rows = [];

    users.forEach(function(user) {
      rows.push(<UserItem naam={user.name} lat={user.lat} lng={user.lng} key={user.socketId} />);
    });

    return (
      <section className='makesnosense'>
        {rows}
      </section>
    );
  }
}

Users.propTypes = {
  users: React.PropTypes.array,
  socket: React.PropTypes.object
};
