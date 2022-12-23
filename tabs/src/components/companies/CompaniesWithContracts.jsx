import React from 'react';
import { CircularProgress } from '@mui/material';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ArrowDropDown from '@mui/icons-material/ArrowDropDownCircleOutlined';
import Button from "@material-ui/core/Button";
import Alert from '@mui/material/Alert';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import UpdateIcon from "@mui/icons-material/Update";
import EditIcon from '@mui/icons-material/Edit';
import { blue, red, green, yellow } from '@mui/material/colors';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import CircleIcon from "@mui/icons-material/Circle";

import HttpError from '../main/HttpError';
import UpdateContract from "../contracts/UpdateContract";
import DeleteContract from "../contracts/DeleteContract"

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

class CompaniesWithContracts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showContracts: false,
      showButtons: {},
      showEditForm: {},
      showDeleteForm: {},
      showDetails: {},
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
          showContracts: true,
        });
      }, 1000);
    } else {
      this.setState({ loading: true });
    }
  };
  handleLoad = (token) => {
    if (this.state.statusCode == 0) {
      var formdata = JSON.stringify({ token: token });
      fetch(this.props.url + '/companies/allCompanies/contracts', {
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

  toggleDetails = (index) => {
    const current = this.state.showDetails;
    current[index] = !current[index];
    this.setState({
      ...this.state,
      showDetails: current,
    });
  };

  updateKeySubmit = (id, index) => {
    this.setLoading();
    var formdata = JSON.stringify({ id: id });
    fetch(this.props.url + "/contracts/updateKey", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      method: "post",
      body: formdata,
    })
      .then((response) => {
        if (response.status >= 300) {
          this.setHttpError(response.status, response.statusText);
          this.setState({
            showContracts: !this.state.showContracts,
            loading: !this.state.loading,
          });
        } else {
          setTimeout(() => {
            this.setLoading();
          }, 1000);
        }
      })
      .then(() => {
        this.handleUpdated();
        this.setSuccess(index, "License Key successfully updated");
        setTimeout(() => {
          this.setSuccess(index);
        }, 3000);
      })
      .catch(function (error) {
        console.log("Request failed", error);
      });
  };

  render() {
    const companies = [];
    const keys = Object.keys(this.state.data);

    for (let a = 0; a < keys.length; a++) {
      const contracts = [];
      for (let b = 0; b < this.state.data[keys[a]].length; b++) {
          const date = new Date(this.state.data[keys[a]][b].startDate).toString();
          const template = date.split(' ');
          const newDate = template[2] + '.' + template[1] + '.' + template[3];
          const date2 = new Date(this.state.data[keys[a]][b].endDate);
          const template2 = date2.toString().split(' ');
          const newDate2 = template2[2] + '.' + template2[1] + '.' + template2[3];
          const validity = newDate + ' - ' + newDate2;
          let today = new Date();
          contracts.push(
            <>
              {!this.state.error && !this.state.loading && (
                <div className="divContractWithCompanies">
                  {this.state.success[b] && <Alert severity="success">{this.state.successMessage}</Alert>}
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
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow key={this.state.data[keys[a]][b].id}>
                        <TableCell>{this.state.data[keys[a]][b].id}</TableCell>
                        <TableCell>{validity}</TableCell>
                        {today.getTime() < date2.getTime() &&
                          (today.getFullYear() != date2.getFullYear() ||
                            (today.getFullYear() == date2.getFullYear() &&
                              date2.getMonth() - today.getMonth() > 2)) && (
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
                        <TableCell>{this.state.data[keys[a]][b].version}</TableCell>
                        <TableCell style={{ width: '1%' }}>
                          {' '}
                          <ArrowDropDown
                            onClick={() => {
                              this.setState({ companyID: this.state.data[keys[a]][b].companyID });
                              this.toggleDetails(b)
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
                    </TableBody>
                  </TableContainer>
                  {!this.state.showEditForm[b] && (
                    <>
                      {this.state.showDetails[b] && (
                        <>
                          <div className="divDetails">
                            <div className="divDetailsLeft">
                              <div>
                                <strong>Responsable: </strong>
                                {this.state.data[keys[a]][b].responsable}
                              </div>
                              <div>
                                <strong>IPv4: </strong>
                                {this.state.data[keys[a]][b].firstIP}
                              </div>
                              <div>
                                <strong>IPv4 (Optional): </strong>
                                {this.state.data[keys[a]][b].secondIP}
                              </div>
                              <div>
                                <strong>IPv6: </strong>
                                {this.state.data[keys[a]][b].ipSechs}
                              </div>
                              <div>
                                <strong>License Key: </strong>
                              </div>
                            </div>
                            <div className="divDetailsRight">
                              <div>
                                <strong>Responsable (2): </strong>
                                {this.state.data[keys[a]][b].secondResponsable}
                              </div>
                              <div>
                                <strong>Port: </strong>
                                {this.state.data[keys[a]][b].port}
                              </div>
                              <div>
                                <strong>Issuer-ID: </strong>
                                {this.state.data[keys[a]][b].issuerID}
                              </div>
                              <div>
                                <strong>Serial No: </strong>
                                {this.state.data[keys[a]][b].serialNo}
                              </div>
                            </div>
                            <div className="divContractRight">
                              <div className="divContractRightButtons">
                                <EditIcon
                                  style={{ color: blue[500], cursor: 'pointer' }}
                                  onClick={() => {
                                    this.setState({ dataUsers  :this.state.data[keys[a]][b].allUsers })
                                    this.toggleEditForm(b)}}
                                ></EditIcon>
                                <DeleteIcon
                                  style={{ color: red[500], cursor: 'pointer' }}
                                  onClick={() => this.toggleDeleteForm(b)}
                                ></DeleteIcon>
                              </div>
                            </div>
                          </div>
                          <textarea className="divKey" maxLength={50}>
                            {this.state.data[keys[a]][b].keyToken}
                          </textarea>
                          <Button
                            color="primary"
                            endIcon={<UpdateIcon />}
                            onClick={() => {
                              this.toggleDetails(b);
                              this.updateKeySubmit(this.state.data[keys[a]][b].id, b);
                            }}
                          >
                            Update Key
                          </Button>
                        </>
                      )}
                    </>
                  )}
                  {this.state.showEditForm[b] && (
                    <UpdateContract
                      url={this.props.url}
                      updated={this.handleUpdated}
                      index={b}
                      toggleEditForm={this.toggleEditForm}
                      toggleDetails={this.toggleDetails}
                      setSuccess={this.setSuccess}
                      contractID={this.state.data[keys[a]][b].id}
                      start={this.state.data[keys[a]][b].startDate}
                      end={this.state.data[keys[a]][b].endDate}
                      responsable={this.state.data[keys[a]][b].responsable}
                      secondResponsable={this.state.data[keys[a]][b].secondResponsable}
                      firstIP={this.state.data[keys[a]][b].firstIP}
                      secondIP={this.state.data[keys[a]][b].secondIP}
                      ipSechs={this.state.data[keys[a]][b].ipSechs}
                      port={this.state.data[keys[a]][b].port}
                      issuerID={this.state.data[keys[a]][b].issuerID}
                      serialNo={this.state.data[keys[a]][b].serialNo}
                      dataUsers={this.state.dataUsers}
                      error={this.props.error}
                    />
                  )}
                  {this.state.showDeleteForm[b] && (
                    <DeleteContract
                      url={this.props.url}
                      updated={this.handleUpdated}
                      index={b}
                      toggleDeleteForm={this.toggleDeleteForm}
                      toggleDetails={this.toggleDetails}
                      contractID={this.state.data[keys[a]][b].id}
                      error={this.props.error}
                    />
                  )}
                </div>
              )}
            </>,
          );
      }

      if (keys[a].toLowerCase().includes(this.state.filter.toLowerCase())) {
        companies.push(
          <>
            <div className="divCompaniesWithUsers">
              <div className="divCompanyNameWithUsers">{keys[a]}</div>
              <div>{contracts}</div>
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
        {!this.state.error && !this.state.loading && this.state.showContracts && (
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

export default CompaniesWithContracts;
