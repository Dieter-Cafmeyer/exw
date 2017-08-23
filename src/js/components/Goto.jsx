`use strict`;
import fetch from 'isomorphic-fetch';
import React, {Component, PropTypes} from 'react';

import annyang from 'annyang';
import {isEmpty} from 'lodash';
import {Link} from 'react-router';

import Modal from 'react-awesome-modal';
import io from 'socket.io-client';

const socket = ``;

let map;
let panorama;

export default class Goto extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      currentLocation: ``,
      lat: ``,
      lng: ``
    };
  }

  componentDidMount() {

    this.setState({
      lat: this.props.lat,
      lng: this.props.lng
    });

    if (isEmpty(this.state.currentLocation)) {
      this.showInitial();
    }
  }

  showInitial() {
    this.annyangInit();
  }

  annyangInit = () => {
    if (annyang) {
      const commands = {
        'go to *tag': this.setLocation,
      };

      annyang.addCommands(commands);

      annyang.addCallback(`result`, function(userSaid) {
        //console.log(`User said: ${userSaid}`);
        annyang.pause();
      });
    }
  }


  setLocation = name => {
    const errorvoorview = document.querySelector(`.errorvoorview`);
    errorvoorview.style.display = `none`;

    this.setState({
      currentLocation: name
    });

    console.log(name);

    this.getBestHit(name);
  }

  getBestHit = loc => {
    const postuitleg = document.querySelector(`.postuitleg`);
    postuitleg.style.display = `block`;

    const micro = document.querySelector(`.postmicro`);
    micro.src = `/assets/img/micro.png`;

    const micro1 = document.querySelector(`.micro`);
    micro1.src = `/assets/img/micro.png`;

    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({address: loc}, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results.length > 0) {
        let location = results[0].geometry.location,
          lat  = location.lat(),
          lng  = location.lng();

        google.maps.event.addDomListener(window, `load`, this.initMap(lat, lng));
      }
    });
  }

  initMap = (lat, lng) => {
    this.insertData(lat, lng);

    localStorage.setItem(`lat`, lat);
    localStorage.setItem(`lng`, lng);

    const myLatlng = new google.maps.LatLng(lat, lng);
    const sv = new google.maps.StreetViewService();

    panorama = new google.maps.StreetViewPanorama(document.getElementById(`pano`));

    map = new google.maps.Map(document.getElementById(`map`), {
      center: myLatlng,
      zoom: 10,
      disableDefaultUI: true,
      streetViewControl: false
    });

    sv.getPanorama({
      location: myLatlng,
      radius: 1100,
      source: google.maps.StreetViewSource.OUTDOOR
    }, this.processSVData);

    map.addListener(`click`, function(event) {
      sv.getPanorama({
        location: event.latLng,
        radius: 1100
      }, this.processSVData);
    });
  }

  processSVData = (data, status) => {
    if (status === google.maps.StreetViewStatus.OK) {
      const marker = new google.maps.Marker({
        position: data.location.latLng,
        map: map,
        title: data.location.description
      });

      panorama.setPano(data.location.pano);

      panorama.setPov({
        heading: 270,
        pitch: 0
      });

      panorama.setVisible(true);

      marker.addListener(`click`, function() {
        const markerPanoID = data.location.pano;
        panorama.setPano(markerPanoID);

        panorama.setPov({
          heading: 270,
          pitch: 0
        });

        panorama.setVisible(true);
      });
    } else {
      const errorvoorview = document.querySelector(`.errorvoorview`);
      errorvoorview.style.display = `block`;

      const panocontent = document.getElementById(`pano`);
      panocontent.style.display = `none`;

      const postuitleg = document.querySelector(`.postuitleg`);
      postuitleg.style.display = `none`;

      console.error(`Street View data not found for this location.`);
    }
  }

  handleClick() {
    const panocontent = document.getElementById(`pano`);
    panocontent.style.display = `block`;

    const listeningtext = document.querySelector(`.listeningtext`);
    listeningtext.style.display = `block`;

    const micro = document.querySelector(`.micro`);
    micro.src = `/assets/img/listening.png`;

    annyang.start();
  }

  handleClick2() {
    const micro = document.querySelector(`.postmicro`);
    micro.src = `/assets/img/listening.png`;

    annyang.start();
  }

  inputMain(e) {
    e.preventDefault();

    const maininput = document.querySelector(`.maininput`);
    const location = maininput.value;

    maininput.value = ``;

    this.setLocation(location);

    const panocontent = document.getElementById(`pano`);
    panocontent.style.display = `block`;
  }

  inputSecond(e) {
    e.preventDefault();

    const secondinput = document.querySelector(`.secondinput`);
    const location = secondinput.value;

    secondinput.value = ``;

    this.setLocation(location);
  }

  closeGoto() {
    const gotopageview = document.querySelector(`.gotopageview`);
    gotopageview.style.display = `none`;
  }

  insertData(lat, lng) {
    this.props.insertData(lat, lng);
  }

  render() {

    return (
      <section className='game-page'>
       <img className='backbtn' onClick={this.closeGoto} src={`/assets/img/backbtn.png`} />


        <div className='uitleg'>
          <h1>Click the button below and say<br />'Go to ... ' and your destination!</h1>
          <img className='micro' src={`/assets/img/micro.png`} onClick={this.handleClick} />
          <h4 className='listeningtext'>Listening...</h4>
          <h2>or enter the location below.</h2>
          <form onSubmit={this.inputMain.bind(this)} ><input className='maininput' type='text' placeholder='Enter a destination' /></form>
        </div>

        <div className='postuitleg'>
          <img className='postmicro' src={`/assets/img/micro.png`} onClick={this.handleClick2} />
          <form onSubmit={this.inputSecond.bind(this)} ><input className='secondinput' type='text' placeholder='Enter another destination' /></form>
        </div>

        <div className='errorvoorview'>
          <h1>Street View is not possible in this location, please try something else.</h1>
        </div>

        <div id='pano'></div>
        <div id='map'></div>

      </section>

    );
  }
}
