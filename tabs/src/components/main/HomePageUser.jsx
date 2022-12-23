import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Alert from '@mui/material/Alert';
import { CircularProgress } from '@mui/material';
import { blue, red, green, yellow } from '@mui/material/colors';
import CircleIcon from '@mui/icons-material/Circle';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ArrowDropDown from '@mui/icons-material/ArrowDropDownCircleOutlined';
import EditIcon from '@mui/icons-material/Edit';
import AccountIcon from '@material-ui/icons/AccountCircle';
import UpdateUser from '../users/UpdateUser';
import UpdateContract from '../contracts/UpdateContract';
import Header from './Header';

import HttpError from './HttpError';
import '../css/style.css';

const styles = () => ({
  page: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: 'fit-content',
  },

  main: {
    display: 'flex',
    flexDirection: 'row',
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
    marginLeft: '4%',
    marginTop: '5%',
  },
});

class HomePageUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logoutButtonShow: true,
      statusCode: '',
      statusText: '',
      token: '',
      data: '',
      dataContracts: '',
      error: false,
      loading: true,
      showEditUserButton: false,
      showEditUserForm: false,
      showDetails: {},
      showEditContract: {},
      success: {},
      successUser: false,
      showEditContractButton: false,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ token: this.props.token });
      this.handleLoad(this.state.token);
    }, 100);
  }
  handleUpdated = () => this.handleLoad(this.state.token);
  setHttpError = (code, message) => this.setState({ statusCode: code, statusText: message });
  toggleDetails = (index) => {
    const current = this.state.showDetails;
    current[index] = !current[index];
    this.setState({
      ...this.state,
      showDetails: current,
      showEditContractButton: !this.state.showEditContractButton,
    });
  };
  toggleEditContract = (index) => {
    const current = this.state.showEditContract;
    current[index] = !current[index];

    this.setState({
      ...this.state,
      showEditContract: current,
    });
  };

  setEditUserButton = () => this.setState({ showEditUserButton: !this.state.showEditUserButton });
  setEditUserForm = () => this.setState({ showEditUserForm: !this.state.showEditUserForm });

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
        this.setState({
          data: data,
          dataContracts: data.allContracts,
          loading: false,
        });
      }, 1000);
    }
  };

  handleLoad = (token) => {
    if (this.state.statusCode == 0) {
      var formdata = JSON.stringify({ token: token });
      fetch(this.props.url + '/getuser', {
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
            this.setState({ error: !this.state.error });
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
    let userName = this.state.data.firstname + ' ' + this.state.data.lastname;
    const contracts = [];

    for (let j = 0; j < this.state.dataContracts.length; j++) {
      const date = new Date(this.state.dataContracts[j].startDate).toString();
      const template = date.split(' ');
      const newDate = template[2] + '.' + template[1] + '.' + template[3];
      const date2 = new Date(this.state.dataContracts[j].endDate);
      const template2 = date2.toString().split(' ');
      const newDate2 = template2[2] + '.' + template2[1] + '.' + template2[3];
      const validity = newDate + ' - ' + newDate2;
      let today = new Date();
      contracts.push(
        <>
          <div className="divContract" style={{ width: '80%', marginBottom: '3%' }}>
            {this.state.success[j] && <Alert severity="success">{this.state.successMessage}</Alert>}
            <TableContainer>
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{
                      fontSize: '20px',
                      color: '#25265e',
                    }}
                  >
                    No
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: '20px',
                      color: '#25265e',
                      width: '45%',
                    }}
                  >
                    Validity Date
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: '20px',
                      color: '#25265e',
                      width: '35%',
                    }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: '20px',
                      color: '#25265e',
                      width: '25%',
                    }}
                  >
                    Version
                  </TableCell>
                  <TableCell>
                    <ArrowDropDown
                      onClick={() => {
                        this.toggleDetails(j);
                      }}
                      style={{
                        width: '40px',
                        height: '30px',
                        color: '#25265e',
                      }}
                    ></ArrowDropDown>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow key={this.state.dataContracts[j].id}>
                  <TableCell>{this.state.dataContracts[j].id}</TableCell>
                  <TableCell>{validity}</TableCell>
                  {today.getTime() < date2.getTime() &&
                    (today.getFullYear() != date2.getFullYear() ||
                      (today.getFullYear() == date2.getFullYear() && date2.getMonth() - today.getMonth() > 2)) && (
                      <TableCell>
                        <CircleIcon
                          sx={{
                            color: green[500],
                            paddingRight: '2px',
                            height: '12px',
                          }}
                        />
                        Aktiv
                      </TableCell>
                    )}
                  {today.getTime() > date2.getTime() && (
                    <TableCell>
                      <CircleIcon
                        sx={{
                          color: red[500],
                          paddingRight: '2px',
                          height: '12px',
                        }}
                      />
                      Expired
                    </TableCell>
                  )}
                  {date2.getMonth() - today.getMonth() <= 2 &&
                    date2.getMonth() - today.getMonth() >= 0 &&
                    date2.getFullYear() == today.getFullYear() &&
                    today.getTime() < date2.getTime() && (
                      <TableCell>
                        <CircleIcon
                          sx={{
                            color: yellow[700],
                            paddingRight: '2px',
                            height: '12px',
                          }}
                        />
                        Expires Shortly
                      </TableCell>
                    )}
                  <TableCell>{this.state.dataContracts[j].version}</TableCell>
                  {this.state.showEditContractButton && (
                    <TableCell>
                      <EditIcon style={{ color: blue[500] }} onClick={() => this.toggleEditContract(j)}></EditIcon>
                    </TableCell>
                  )}
                </TableRow>
              </TableBody>
            </TableContainer>
            {!this.state.showEditContract[j] && this.state.showDetails[j] && (
              <>
                <div className="divDetails">
                  <div className="divDetailsLeft">
                    <div>
                      <strong>Responsable: </strong>
                      {this.state.dataContracts[j].responsable}
                    </div>
                    <div>
                      <strong>IPv4: </strong>
                      {this.state.dataContracts[j].firstIP}
                    </div>
                    <div>
                      <strong>IPv4 (Optional): </strong>
                      {this.state.dataContracts[j].secondIP}
                    </div>

                    <div>
                      <strong>IPv6: </strong>
                      {this.state.dataContracts[j].ipSechs}
                    </div>
                    <div>
                      <strong>License Key: </strong>
                    </div>
                  </div>
                  <div className="divDetailsRight">
                    <div>
                      <strong>Responsable (2): </strong>
                      {this.state.dataContracts[j].secondResponsable}
                    </div>
                    <div>
                      <strong>Port: </strong>
                      {this.state.dataContracts[j].port}
                    </div>
                    <div>
                      <strong>Issuer-ID: </strong>
                      {this.state.dataContracts[j].issuerID}
                    </div>
                    <div>
                      <strong>Serial No: </strong>
                      {this.state.dataContracts[j].serialNo}
                    </div>
                  </div>
                </div>
                <textarea className="divKey" maxLength={50}>
                  {this.state.dataContracts[j].keyToken}
                </textarea>
              </>
            )}
            {this.state.showEditContract[j] && (
              <UpdateContract
                url={this.props.url}
                role={this.props.role}
                updated={this.handleUpdated}
                index={j}
                toggleEditForm={this.toggleEditContract}
                toggleDetails={this.toggleDetails}
                setSuccess={this.setSuccess}
                contractID={this.state.dataContracts[j].id}
                companyID={this.state.data.companyID}
                start={this.state.dataContracts[j].startDate}
                end={this.state.dataContracts[j].endDate}
                responsable={this.state.dataContracts[j].responsable}
                secondResponsable={this.state.dataContracts[j].secondResponsable}
                firstIP={this.state.dataContracts[j].firstIP}
                secondIP={this.state.dataContracts[j].secondIP}
                ipSechs={this.state.dataContracts[j].ipSechs}
                port={this.state.dataContracts[j].port}
                issuerID={this.state.dataContracts[j].issuerID}
                serialNo={this.state.dataContracts[j].serialNo}
                error={this.props.error}
              />
            )}
          </div>
        </>,
      );
    }

    const { classes } = this.props;
    return (
      <div className={classes.page}>
        <Header logout={this.state.logoutButtonShow}></Header>
        <div className={classes.main}>
          <div className={classes.center}>
            {this.state.statusCode >= 300 && (
              <HttpError code={this.state.statusCode} text={this.state.statusText} reload={this.props.authorized} />
            )}
            {this.state.loading && !this.state.error && (
              <CircularProgress style={{ marginBlockStart: '20%' }} size="50px"></CircularProgress>
            )}
            {!this.state.error && !this.state.loading && (
              <div className="divUser">
                <TableContainer>
                  <TableHead>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell
                        style={{
                          fontSize: '20px',
                          color: '#25265e',
                          width: '30%',
                        }}
                      >
                        User
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: '20px',
                          color: '#25265e',
                          width: '30%',
                        }}
                      >
                        Email
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: '20px',
                          color: '#25265e',
                          width: '20%',
                        }}
                      >
                        Phone
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: '20px',
                          color: '#25265e',
                          width: '20%',
                        }}
                      >
                        Mobile
                      </TableCell>
                      <TableCell>
                        <ArrowDropDown
                          onClick={this.setEditUserButton}
                          style={{
                            width: '40px',
                            height: '30px',
                            color: '#25265e',
                          }}
                        ></ArrowDropDown>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow key={userName}>
                      <TableCell>
                        <AccountIcon fontSize="large" style={{ color: '#193058' }}></AccountIcon>
                      </TableCell>
                      <TableCell>{userName}</TableCell>
                      <TableCell>{this.state.data.email}</TableCell>
                      {!this.state.data.phone == '' ? (
                        <TableCell>
                          {'+'}
                          {this.state.data.phone}
                        </TableCell>
                      ) : (
                        <TableCell></TableCell>
                      )}
                      {!this.state.data.mobile == '' ? (
                        <TableCell>
                          {'+'}
                          {this.state.data.mobile}
                        </TableCell>
                      ) : (
                        <TableCell></TableCell>
                      )}
                      {this.state.showEditUserButton && (
                        <TableCell>
                          <EditIcon style={{ color: blue[500] }} onClick={this.setEditUserForm}></EditIcon>
                        </TableCell>
                      )}
                    </TableRow>
                  </TableBody>
                </TableContainer>
                {this.state.showEditUserForm && (
                  <UpdateUser
                    url={this.props.url}
                    role={this.props.role}
                    updated={this.handleUpdated}
                    toggleEditForm={this.setEditUserForm}
                    toggleButtons={this.setEditUserForm}
                    setSuccess={this.setSuccess}
                    userID={this.state.data.id}
                    companyID={this.state.data.companyID}
                    username={this.state.data.username}
                    password={this.state.data.password}
                    firstname={this.state.data.firstname}
                    lastname={this.state.data.lastname}
                    email={this.state.data.email}
                    phone={this.state.data.phone}
                    mobile={this.state.data.mobile}
                    error={this.props.error}
                    onlyUserRole={this.state.data.role}
                  ></UpdateUser>
                )}
              </div>
            )}
            {this.state.dataContracts.length != 0 && this.state.data.role == 'user' && (
              <>
                <h3 style={{ color: '#193058', textAlign: 'center' }}>Related Contracts</h3>
                {contracts}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(HomePageUser);
