`use strict`;

import React, {Component, PropTypes} from 'react';
import {isEmpty} from 'lodash';

import {Users, Goto} from '../components/';

import io from 'socket.io-client';

let map;
let socket = ``;

export default class Overview extends Component {

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      users: [],
      me: [],
      name: ``,
      lat: ``,
      lng: ``,
      showModal: false
    };
  }

  componentDidMount() {

    if (isEmpty(localStorage.name)) {
      this.context.router.transitionTo(`/`);
    } else {
      const name = localStorage.getItem(`name`);
      socket = io(`/`, {query: `name=${name}`});
      socket.on(`init`, this.handleWSInit);
      socket.on(`join`, this.handleWSJoin);
      socket.on(`leave`, this.handleWSLeave);
      socket.on(`updateUsers`, this.handleWSUpdateUsers);
    }

    this.initMap();
  }

  handleWSInit = data => {

    this.renderMarkers(data.users);

    this.setState({users: data.users, me: data.user});

    if (!localStorage.getItem(`modal`)) {
      this.setState({
        showModal: true
      });

      localStorage.setItem(`modal`, 1);
    }
  }

  handleWSJoin = user => {
    const {users} = this.state;
    users.push(user);
    this.setState({users});
    this.renderMarkers(users);
  }

  handleWSLeave = socketId => {
    let {users} = this.state;
    users = users.filter(u => u.socketId !== socketId);
    this.setState({users});
    this.renderMarkers(users);
  }

  handleWSUpdateUsers = users => {
    this.setState({
      users: users
    });

    this.renderMarkers(users);
  }

  initMap = () => {
    map = new google.maps.Map(document.getElementById(`userMap`), {
      zoom: 3,
      center: new google.maps.LatLng(50.276654, 4.123604),
      mapTypeId: `terrain`,
      styles: [{featureType: `administrative`, elementType: `all`, stylers: [{visibility: `off`}]}, {featureType: `landscape`, elementType: `all`, stylers: [{visibility: `simplified`}, {hue: `#0066ff`}, {saturation: 74}, {lightness: 100}]}, {featureType: `poi`, elementType: `all`, stylers: [{visibility: `simplified`}]}, {featureType: `road`, elementType: `all`, stylers: [{visibility: `simplified`}]}, {featureType: `road.highway`, elementType: `all`, stylers: [{visibility: `off`}, {weight: 0.6}, {saturation: - 85}, {lightness: 61}]}, {featureType: `road.highway`, elementType: `geometry`, stylers: [{visibility: `on`}]}, {featureType: `road.arterial`, elementType: `all`, stylers: [{visibility: `off`}]}, {featureType: `road.local`, elementType: `all`, stylers: [{visibility: `on`}]}, {featureType: `transit`, elementType: `all`, stylers: [{visibility: `simplified`}]}, {featureType: `water`, elementType: `all`, stylers: [{visibility: `simplified`}, {color: `#5f94ff`}, {lightness: 26}, {gamma: 5.86}]}]
    });
  }

  showGoto() {
    const gotopageview = document.querySelector(`.gotopageview`);
    gotopageview.style.display = `block`;
  }

  insertData(lat, lng) {
    const {me} = this.state;
    if (lat && lng) {
      socket.emit(`userLoc`, {
        socketId: me.socketId,
        lat: lat,
        lng: lng
      });
    }
  }

  renderMarkers(users) {

    for (let i = 0;i < users.length;i ++) {
      const myLat = users[i].lat;
      const myLng = users[i].lng;

      if (myLng === 0 && myLat === 0) {
      } else {
        const latlng = {lat: myLat, lng: myLng};
        const marker = new google.maps.Marker({
          position: latlng,
          map: map,
          icon: `../assets/img/marker.png`
        });

        const infowindow = new google.maps.InfoWindow();

        google.maps.event.addListener(marker, `click`, (function(marker, i) {
          return function() {
            infowindow.setContent(`User: ${  users[i].name}`);
            infowindow.open(map, marker);
          };
        })(marker, i));
      }
    }
  }

  render() {
    const {users, me, lng, lat} = this.state;

    return (
        <div className='login-page'>

          <div className='gotopageview'>
            <Goto insertData={(lat, lng) => this.insertData(lat, lng)} />
          </div>

          <div className='sidebar'>

            <div className='logoSide'>
              <img src={`/assets/img/logo.png`} onClick={this.showGoto} />
            </div>

            <div className='link' onClick={this.showGoto}>
              <p><img src={`/assets/img/logo2.png`} width='30' />Go to a location!</p>
            </div>

            <h2>Travelers</h2>

            <Users users={users} socket={socket} />

          </div>

          <div id='userMap'>

          </div>
          <h1 className='titleVisiting'>People are visiting these locations at the moment</h1>
        </div>

    );
  }
}
