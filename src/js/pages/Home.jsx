`use strict`;

import React, {Component, PropTypes} from 'react';
import {isEmpty} from 'lodash';

export default class Home extends Component {

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      name: ``,
      error: ``
    };

    localStorage.removeItem(`name`);
    localStorage.removeItem(`user`);
  }

  validate() {
    const {name} = this.state;

    let error = ``;

    if (!name) {
      error = `enter a username`;
    }

    return error;
  }

  submitHandler(e) {

    e.preventDefault();

    const error = this.validate();

    if (isEmpty(error)) {
      localStorage.setItem(`name`, this.state.name);
      this.context.router.transitionTo(`/overview`);

    } else {
      this.setState({error, name: ``});
      document.querySelector(`.name-input`).classList.add(`input-error`);
    }
  }

  changeHandler() {

    const name = document.querySelector(`.name-input`);

    this.setState({
      name: name.value,
    });
  }

  render() {

    const {name, error} = this.state;

    return (
        <div className='login-page'>
          <img src={`/assets/img/logo.png`} className='logo' />
          <div className='login-field'>
           <form action='' method='post' acceptCharset='utf-8' onSubmit={e => this.submitHandler(e)}>
              <p className='naam-form'>What is your name?</p>
              <input type='text' name='name' className='name-input' maxLength='15' placeholder='Username' value={name} onChange={() => this.changeHandler()}  />
              <div className='error'>{error}</div>

              <button type='submit' value='Verder'>Continue</button>
              <p className='enter-to-enter'>or press enter</p>
            </form>
          </div>
        </div>

    );
  }
}
