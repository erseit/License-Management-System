import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { CircularProgress } from '@mui/material';
import Buttons from './LeftButtons';
import HttpError from './HttpError';
import Header from './Header';
import LoadHomeCompany from '../companies/LoadHomeCompany';
import CompaniesWithUsers from '../companies/CompaniesWithUsers';
import CompaniesWithContracts from '../companies/CompaniesWithContracts';

import '../css/style.css';

const styles = (theme) => ({
  page: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: 'fit-content',
    overflowY: 'scroll',
    overflowX: 'hidden',
  },

  main: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: '100vh',
  },

  center: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    height: '80vh',
    marginLeft: '5%',
    marginTop: '7%',
  },
});

class HomePageAdminSystem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logoutButtonShow: true,
      displayLeftButtons: 'unset',
      statusCode: '',
      statusText: '',
      showCompanies: false,
      showCompaniesWithUsers: false,
      data: '',
      loading: true,
      role: '',
      token: '',
      error: false,
      showCompaniesWithContracts: false,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ token: this.props.token });
      this.handleLoad(this.props.token);
    }, 100);
  }

  handleUpdated = () => this.handleLoad(this.state.token);
  setHttpError = (code, message) => this.setState({ statusCode: code, statusText: message });
  setSuccess = (index, message) => {
    const current = this.state.success;
    current[index] = !current[index];
    this.setState({
      ...this.state,
      success: current,
      successMessage: message,
    });
  };

  status(response) {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(new Error(response.statusText));
    }
  }

  processData = (data) => {
    if (this.state.statusCode == 0) {
      setTimeout(() => {
        this.setState({ data: data, loading: false, showCompanies: true });
      }, 1000);
    } else {
      this.setState({ loading: true });
    }
  };

  handleLoad = (token) => {
    if (this.state.statusCode == 0) {
      var formdata = JSON.stringify({ token: token });
      fetch(this.props.url + '/companies/allCompanies', {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        method: 'post',
        body: formdata,
      })
        .then((response) => {
          if (response.status >= 300) {
            this.setHttpError(response.status, response.statusText);
            this.setState({
              displayLeftButtons: 'none',
              loading: false,
              error: !this.state.error,
              showCompanies: true,
            });
          } else {
            return response.json();
          }
        })
        .then(this.processData)
        .catch(function (error) {
          console.log('Request failed', error);
        });
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.page}>
        <Header logout={this.state.logoutButtonShow}></Header>
        <div className={classes.main}>
          <Buttons
            role={this.props.role}
            displayLeftButtons={this.state.displayLeftButtons}
            homePageAdminSystem={() => {
              this.handleLoad(this.state.token);
              if (!this.state.showCompanies) {
                this.setState({
                  loading: !this.state.loading,
                  showCompaniesWithContracts: false,
                  showCompaniesWithUsers: false,
                });
              }
            }}
            companiesWithUsers={() => {
              if (!this.state.showCompaniesWithUsers) {
                this.setState({
                  showCompanies: false,
                  showCompaniesWithContracts: false,
                  showCompaniesWithUsers: !this.state.showCompaniesWithUsers,
                });
              }
            }}
            companiesWithContracts={() => {
              if (!this.state.showCompaniesWithContracts) {
                this.setState({
                  showCompanies: false,
                  showCompaniesWithContracts: !this.state.showCompaniesWithContracts,
                  showCompaniesWithUsers: false,
                });
              }
            }}
          ></Buttons>
          <div className={classes.center}>
            {this.state.loading && !this.state.error && (
              <CircularProgress style={{ marginBlockStart: '20%' }} size="50px"></CircularProgress>
            )}
            {this.state.statusCode >= 300 && (
              <HttpError code={this.state.statusCode} text={this.state.statusText} reload={this.props.authorized} />
            )}

            {this.state.showCompaniesWithContracts && (
              <CompaniesWithContracts url={this.props.url} token={this.props.token} error={this.setHttpError} />
            )}

            {this.state.showCompanies && (
              <LoadHomeCompany
                url={this.props.url}
                data={this.state.data}
                updated={this.handleUpdated}
                error={this.setHttpError}
              />
            )}
            {this.state.showCompaniesWithUsers && (
              <CompaniesWithUsers url={this.props.url} token={this.props.token} error={this.setHttpError} />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(HomePageAdminSystem);
