import React from 'react';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import LoginIcon from '@mui/icons-material/Login';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Alert from '@mui/material/Alert';
import HttpError from './HttpError';
import Header from './Header';

const styles = (theme) => ({
  page: {
    display: 'flex',
    flexDirection: 'column',
    background: 'ghostwhite',
  },

  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  },
  loginbox: {
    textAlign: 'center',
    width: '50ch',
    border: '1px solid gray',
    borderRadius: '10px',
    padding: '10px',
    background: 'white',
  },
  buttonRightAlign: {
    padding: '20px',
    textAlign: 'right',
  },
  margin: {
    margin: theme.spacing(1),
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  textField: {
    width: '40ch',
    padding: '1px',
  },
});

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      username: '',
      showPassword: false,
      loginButtonDisabled: true,
      statusCode: '',
      statusText: '',
      showLoginBox: 'unset',
    };

    this.changeName = this.changeName.bind(this);
    this.changePassword = this.changePassword.bind(this);
  }

  changeName = (event) => {
    let s = true;
    if (this.state.password.length >= 5 && event.target.value.length) {
      s = false;
    }
    this.setState({ username: event.target.value, loginButtonDisabled: s });
  };

  changePassword = (event) => {
    let s = true;
    if (this.state.username.length && event.target.value.length >= 5) {
      s = false;
    }
    this.setState({ password: event.target.value, loginButtonDisabled: s });
  };

  handleClickShowPassword = () => this.setState({ showPassword: !this.state.showPassword });
  handleShowLoginBox = () => this.setState({ showLoginBox: !this.state.showPassword });

  processData = (data) => {
    let tid = data.id;
    if (tid !== 0) {
      this.props.authorized();
      this.props.role(data.role);
      this.props.token(data.token);
      this.props.companyID(data.companyID);
    }
  };

  handleLoginSubmit = (event) => {
    var formdata = JSON.stringify({
      username: this.state.username,
      password: this.state.password,
    });
    fetch(this.props.url + '/login', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      method: 'post',
      body: formdata,
    })
      .then((response) => {
        if (response.status >= 300 && response.status !== 403) {
          this.setState({
            statusCode: response.status,
            statusText: response.statusText,
            showLoginBox: 'none',
          });
        } else if (response.status === 403) {
          this.setState({
            statusCode: response.status,
            statusText: response.statusText,
          });
        } else {
          return response.json();
        }
      })
      .then(this.processData)
      .catch(function (error) {
        console.log('Request failed', error);
      });
    event.preventDefault();
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.page}>
        <Header></Header>
        <div className={classes.center}>
          {this.state.statusCode !== 403 && this.state.statusCode >= 300 ? (
            <>
              <HttpError code={this.state.statusCode} text={this.state.statusText}></HttpError>
            </>
          ) : null}
          <div className={classes.loginbox} style={{ display: this.state.showLoginBox }}>
            {this.state.statusCode === 403 ? (
              <>
                <Alert severity="error"> User Name or Password false!</Alert>
              </>
            ) : null}
            <form onSubmit={this.handleLoginSubmit}>
              <FormControl className={clsx(classes.margin, classes.textField)}>
                <InputLabel htmlFor="username">Username</InputLabel>
                <Input id="username" type="text" value={this.state.username} onChange={this.changeName} />
              </FormControl>
              <FormControl className={clsx(classes.margin, classes.textField)}>
                <InputLabel htmlFor="password">Password</InputLabel>
                <Input
                  id="password"
                  type={this.state.showPassword ? 'text' : 'password'}
                  value={this.state.password}
                  onChange={this.changePassword}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton aria-label="toggle password visibility" onClick={this.handleClickShowPassword}>
                        {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              <div className={classes.buttonRightAlign}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  value="submit"
                  endIcon={<LoginIcon />}
                  disabled={this.state.loginButtonDisabled}
                >
                  Login
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Login);
