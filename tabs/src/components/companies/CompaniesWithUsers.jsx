import React from 'react';
import { CircularProgress } from '@mui/material';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ArrowDropDown from '@mui/icons-material/ArrowDropDownCircleOutlined';
import Avatar from '@mui/material/Avatar';
import Alert from '@mui/material/Alert';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import { blue, red, green, yellow } from '@mui/material/colors';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import UpdateUser from '../users/UpdateUser';
import DeleteUser from '../users/DeleteUser';
import HttpError from '../main/HttpError';

const styles = (theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  textField: {
    width: '90%',
    padding: '1px',
  },
});

class CompaniesWithUsers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showUsers: false,
      showButtons: {},
      showEditForm: {},
      showDeleteForm: {},
      success: {},
      successMessage: '',
      filter: '',
      data: '',
      statusCode: '',
      statusText: '',
      loading: true,
      error: false,
      token: '',
      companyID: '',
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
  setLoading = () => this.setState({ loading: !this.state.loading });
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
        this.setState({
          data: data,
          loading: false,
          showUsers: true,
        });
      }, 1000);
    } else {
      this.setState({ loading: true });
    }
  };
  handleLoad = (token) => {
    if (this.state.statusCode == 0) {
      var formdata = JSON.stringify({ token: token });
      fetch(this.props.url + '/companies/allCompanies/users', {
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
            this.setState({ loading: false, error: !this.state.error });
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
  setSuccess = (index, message) => {
    const current = this.state.success;
    current[index] = !current[index];
    this.setState({
      ...this.state,
      success: current,
      successMessage: message,
    });
  };

  setResearch = () => this.setState({ showSearchResults: !this.state.showSearchResults });

  toggleButtons = (index) => {
    const current = this.state.showButtons;
    current[index] = !current[index];
    this.setState({
      ...this.state,
      showButtons: current,
    });
  };

  toggleEditForm = (index) => {
    const current = this.state.showEditForm;
    current[index] = !current[index];
    this.setState({
      ...this.state,
      showEditForm: current,
    });
  };

  toggleDeleteForm = (index) => {
    const current = this.state.showDeleteForm;
    current[index] = !current[index];
    this.setState({
      ...this.state,
      showDeleteForm: current,
    });
  };

  stringToColor = (firstname, lastname) => {
    let string = firstname + lastname;
    let hash = 0;
    let i;
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  };

  stringAvatar = (firstname, lastname) => {
    return {
      sx: {
        bgcolor: this.stringToColor(firstname, lastname),
      },
      children: `${firstname.charAt(0)}${lastname.charAt(0)}`,
    };
  };

  render() {
    const companies = [];
    const keys = Object.keys(this.state.data);

    for (let a = 0; a < keys.length; a++) {
      const users = [];
      for (let b = 0; b < this.state.data[keys[a]].length; b++) {
        let userName = this.state.data[keys[a]][b].firstname + ' ' + this.state.data[keys[a]][b].lastname;
        users.push(
          <>
            <div className="divUserWithCompanies">
              {this.state.success[b] && <Alert severity="success">{this.state.successMessage}</Alert>}
              <TableContainer>
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell
                      style={{
                        fontSize: '20px',
                        color: '#25265e',
                        width: '35%',
                      }}
                    >
                      User
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: '20px',
                        color: '#25265e',
                        width: '15%',
                      }}
                    >
                      Role
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: '20px',
                        color: '#25265e',
                        width: '20%',
                      }}
                    >
                      Email
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: '20px',
                        color: '#25265e',
                        width: '15%',
                      }}
                    >
                      Phone
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: '20px',
                        color: '#25265e',
                        width: '15%',
                      }}
                    >
                      Mobile
                    </TableCell>
                    <TableCell>
                      <ArrowDropDown
                        onClick={() => {
                          this.toggleButtons(b);
                          this.setState({ companyID: this.state.data[keys[a]][b].companyID });
                        }}
                        style={{
                          width: '40px',
                          height: '30px',
                          color: '#25265e',
                          cursor: 'pointer',
                        }}
                      ></ArrowDropDown>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={userName}>
                    <TableCell>
                      <Avatar
                        {...this.stringAvatar(
                          this.state.data[keys[a]][b].firstname,
                          this.state.data[keys[a]][b].lastname,
                        )}
                      ></Avatar>
                    </TableCell>
                    <TableCell>{userName}</TableCell>
                    <TableCell>{this.state.data[keys[a]][b].role == 'user' ? 'User' : 'Admin'}</TableCell>
                    <TableCell>{this.state.data[keys[a]][b].email}</TableCell>
                    {!this.state.data[keys[a]][b].phone == '' ? (
                      <TableCell>
                        {'+'}
                        {this.state.data[keys[a]][b].phone}
                      </TableCell>
                    ) : (
                      <TableCell></TableCell>
                    )}
                    {!this.state.data[keys[a]][b].mobile == '' ? (
                      <TableCell>
                        {'+'}
                        {this.state.data[keys[a]][b].mobile}
                      </TableCell>
                    ) : (
                      <TableCell></TableCell>
                    )}
                    {this.state.showButtons[b] && this.state.companyID == this.state.data[keys[a]][b].companyID && (
                      <TableCell>
                        <EditIcon
                          style={{ color: blue[500], cursor: 'pointer' }}
                          onClick={() => {
                            this.toggleEditForm(b);
                          }}
                        ></EditIcon>
                        <DeleteIcon
                          style={{ color: red[500], cursor: 'pointer' }}
                          onClick={() => {
                            this.toggleDeleteForm(b);
                          }}
                        ></DeleteIcon>
                      </TableCell>
                    )}
                  </TableRow>
                </TableBody>
              </TableContainer>
              {this.state.showEditForm[b] && this.state.companyID == this.state.data[keys[a]][b].companyID && (
                <UpdateUser
                  url={this.props.url}
                  updated={this.handleUpdated}
                  index={b}
                  toggleEditForm={this.toggleEditForm}
                  toggleButtons={this.toggleButtons}
                  setSuccess={this.setSuccess}
                  userID={this.state.data[keys[a]][b].id}
                  companyID={this.state.data[keys[a]][b].companyID}
                  username={this.state.data[keys[a]][b].username}
                  password={this.state.data[keys[a]][b].password}
                  firstname={this.state.data[keys[a]][b].firstname}
                  lastname={this.state.data[keys[a]][b].lastname}
                  email={this.state.data[keys[a]][b].email}
                  phone={this.state.data[keys[a]][b].phone}
                  mobile={this.state.data[keys[a]][b].mobile}
                  error={this.props.error}
                ></UpdateUser>
              )}
              {this.state.showDeleteForm[b] && this.state.companyID == this.state.data[keys[a]][b].companyID && (
                <DeleteUser
                  url={this.props.url}
                  updated={this.handleUpdated}
                  index={b}
                  toggleDeleteForm={this.toggleDeleteForm}
                  toggleButtons={this.toggleButtons}
                  userID={this.state.data[keys[a]][b].id}
                  username={userName}
                  error={this.props.error}
                />
              )}
            </div>
          </>,
        );
      }
      if (keys[a].toLowerCase().includes(this.state.filter.toLowerCase())) {
        companies.push(
          <>
            <div className="divCompaniesWithUsers">
              <div className="divCompanyNameWithUsers">{keys[a]}</div>
              <div>{users}</div>
            </div>
          </>,
        );
      }
    }

    return (
      <>
        {this.state.loading && !this.state.error && (
          <CircularProgress style={{ marginBlockStart: '20%' }} size="50px"></CircularProgress>
        )}
        {this.state.statusCode >= 300 && <HttpError code={this.state.statusCode} text={this.state.statusText} />}
        {!this.state.error && !this.state.loading && this.state.showUsers && (
          <div className="divContracts">
            <div
              style={{
                display: 'flex',
                width: '80%',
                marginTop: '18px',
                marginBottom: '10px',
                borderRadius: '10px',
                border: '1px solid gray',
                alignItems: 'center',
                marginRight :'4%'
              }}
            >
              <SearchIcon style={{ opacity: '0.5', paddingLeft: '10px' }}></SearchIcon>
              <form>
                <TextField
                  id="searchBar"
                  placeholder="Search a company name"
                  variant="standard"
                  size="small"
                  style={{ width: '100%', marginTop: '14px', marginLeft: '14px', borderColor: 'red' }}
                  onChange={(event) => this.setState({ filter: event.target.value })}
                  InputProps={{
                    disableUnderline: true,
                  }}
                ></TextField>
              </form>
            </div>
            {companies}
          </div>
        )}
      </>
    );
  }
}

export default CompaniesWithUsers;
