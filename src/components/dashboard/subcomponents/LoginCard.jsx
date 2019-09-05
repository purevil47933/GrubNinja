import React, { useState } from 'react';
import PropTypes from 'prop-types';

const LoginCard = props => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [loginLoading, setLoginLoading] = useState(false);

  const { username, password } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const login = async (username, password) => {
    try {
      setLoginLoading(true);
      await props.handleLogin(username, password);
      setLoginLoading(false);
    } catch (error) {
      // let the user know that there was a login error
      setLoginLoading(false);
      console.log(error);
    }
  };

  return (
    <div className='row'>
      <div className='col'>
        <div className='card login-card mb-4'>
          <div className='card-body'>
            <div className='row mb-3'>
              <div className='col'>
                <h5 className='card-title text-uppercase text-muted mb-0'>
                  Login
                </h5>
              </div>
            </div>
            <div className='row'>
              <div className='col'>
                <div className='form-group'>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='Username'
                    name='username'
                    value={username}
                    onChange={e => onChange(e)}
                  />
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col'>
                <div className='form-group'>
                  <input
                    type='password'
                    className='form-control'
                    placeholder='Password'
                    name='password'
                    value={password}
                    onChange={e => onChange(e)}
                  />
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col'>
                <div className='custom-control custom-checkbox mb-3'>
                  <input
                    className='remember-me custom-control-input'
                    type='checkbox'
                    id='remember-account'
                  />
                  <label
                    className='custom-control-label'
                    htmlFor='remember-account'
                  >
                    Remember Me
                  </label>
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col'>
                <button
                  className='btn btn-primary btn-block '
                  disabled={
                    !(username.length > 0 && password.length > 0) ||
                    loginLoading
                  }
                  onClick={() => login(username, password)}
                >
                  {loginLoading ? (
                    <i className='fas fa-circle-notch fa-spin'></i>
                  ) : (
                    'Login'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

LoginCard.propTypes = {};

export default LoginCard;
