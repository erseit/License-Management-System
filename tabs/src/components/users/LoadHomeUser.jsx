import React from "react";
import { CircularProgress } from "@mui/material";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import ArrowDropDown from "@mui/icons-material/ArrowDropDownCircleOutlined";
import Avatar from '@mui/material/Avatar';
import Alert from "@mui/material/Alert";
import DeleteIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit"
import { blue, red, green, yellow } from "@mui/material/colors";
import CircleIcon from "@mui/icons-material/Circle";
import TextField from "@mui/material/TextField";
import SearchIcon from '@mui/icons-material/Search'

import AddUser from "./AddUser";
import UpdateUser from "./UpdateUser";
import DeleteUser from "./DeleteUser";
import HttpError from "../main/HttpError";

const styles = (theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  textField: {
    width: "90%",
    padding: "1px",
  },
});

class LoadHomeUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      statusCode: "",
      statusText: "",
      showUsers: false,
      data: "",
      loading: true,
      error: false,
      companyID: "",
      companyName: this.props.companyName,
      showButtons: {},
      showEditForm: {},
      showDeleteForm: {},
      showDetails: {},
      success: {},
      successMessage: '',
      filter: '',
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ companyID: this.props.companyID });
      this.handleLoad(this.props.companyID);
    }, 200);
  }

  handleUpdated = () => this.handleLoad(this.state.companyID);
  setHttpError = (code, message) =>
    this.setState({ statusCode: code, statusText: message });
  setLoading = () => this.setState({ loading: !this.state.loading });
  setSuccess = (index, message) => {
    const current = this.state.success;
    current[index] = !current[index];
    this.setState({
      ...this.state,
      success: current,
      successMessage: message
    })
  }

  setResearch = () => this.setState({ showSearchResults: !this.state.showSearchResults })

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
      showEditForm: current
    });
  };

  toggleDeleteForm = (index) => {
    const current = this.state.showDeleteForm;
    current[index] = !current[index];
    this.setState({
      ...this.state,
      showDeleteForm: current
    });
  }

  toggleDetails = (index) => {
    const current = this.state.showDetails;
    current[index] = !current[index];
    this.setState({
      ...this.state,
      showDetails: current
    })
  }
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
  }

  stringAvatar = (firstname, lastname) => {
    return {
      sx: {
        bgcolor: this.stringToColor(firstname, lastname),
      },
      children: `${firstname.charAt(0)}${lastname.charAt(0)}`,
    };
  }

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
  handleLoad = (id) => {
    if (this.state.statusCode == 0) {
      var formdata = JSON.stringify({ companyID: id });
      fetch(this.props.url + "/allusers", {
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
            this.setState({ loading: false, error: !this.state.error });
          } else {
            return response.json();
          }
        })
        .then(this.processData)
        .catch(function (error) {
          console.log("Request failed", error);
        });
    }
  };

  render() {
    const users = []
    for (let i = 0; i < this.state.data.length; i++) {
      const contracts = []
      let userName = this.state.data[i].firstname + " " + this.state.data[i].lastname
      for (let j = 0; j < this.state.data[i].allContracts.length; j++) {
        const date = new Date(this.state.data[i].allContracts[j].startDate).toString();
        const template = date.split(" ");
        const newDate = template[2] + "." + template[1] + "." + template[3];
        const date2 = new Date(this.state.data[i].allContracts[j].endDate);
        const template2 = date2.toString().split(" ");
        const newDate2 = template2[2] + "." + template2[1] + "." + template2[3];
        const validity = newDate + " - " + newDate2;
        let today = new Date();
        contracts.push(
          <>
            <div className="divContract" style={{ width: '97%', marginBottom: '3%' }}>
              <TableContainer >
                <TableHead>
                  <TableRow>
                    <TableCell
                      style={{
                        fontSize: "20px",
                        color: "#25265e",
                      }}
                    >
                      No
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: "20px",
                        color: "#25265e",
                        width: "45%",
                      }}
                    >
                      Validity Date
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: "20px",
                        color: "#25265e",
                        width: "35%",
                      }}
                    >
                      Status
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: "20px",
                        color: "#25265e",
                        width: "25%",
                      }}
                    >
                      Version
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={this.state.data[i].allContracts[j].id}>
                    <TableCell>{this.state.data[i].allContracts[j].id}</TableCell>
                    <TableCell>{validity}</TableCell>
                    {today.getTime() < date2.getTime() &&
                      (today.getFullYear() != date2.getFullYear() ||
                        (today.getFullYear() == date2.getFullYear() && date2.getMonth() - today.getMonth() > 2)) && (
                        <TableCell>
                          <CircleIcon
                            sx={{
                              color: green[500],
                              paddingRight: "2px",
                              height: "12px",
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
                            paddingRight: "2px",
                            height: "12px",
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
                              paddingRight: "2px",
                              height: "12px",
                            }}
                          />
                          Expires Shortly
                        </TableCell>
                      )}
                    <TableCell>{this.state.data[i].allContracts[j].version}</TableCell>
                  </TableRow>
                </TableBody>
              </TableContainer>
              <div className="divDetails">
                <div className="divDetailsLeft">
                  <div>
                    <strong>Responsable: </strong>
                    {this.state.data[i].allContracts[j].responsable}
                  </div>
                  <div>
                    <strong>IPv4: </strong>
                    {this.state.data[i].allContracts[j].firstIP}
                  </div>
                </div>
                <div className="divDetailsRight">
                  <div>
                    <strong>Responsable (2): </strong>
                    {this.state.data[i].allContracts[j].secondResponsable}
                  </div>
                  <div>
                    <strong>IPv6: </strong>
                    {this.state.data[i].allContracts[j].ipSechs}
                  </div>
                </div>
              </div>
            </div>
          </>
        )
      }
      if(userName.toLowerCase().includes(this.state.filter.toLowerCase())) {
        users.push(
          <>
            {!this.state.error && !this.state.loading && (
              <div className="divUser">
                {this.state.success[i] && (
                  <Alert severity="success">{this.state.successMessage}</Alert>
                )}
                <TableContainer>
                  <TableHead>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell
                        style={{
                          fontSize: "20px",
                          color: "#25265e",
                          width: '25%'
                        }}
                      >
                        User
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "20px",
                          color: "#25265e",
                          width: '15%'
                        }}>Role</TableCell>
                      <TableCell
                        style={{
                          fontSize: "20px",
                          color: "#25265e",
                          width: '20%'
                        }}
                      >
                        Email
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "20px",
                          color: "#25265e",
                          width: '15%'
                        }}
                      >
                        Phone
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "20px",
                          color: "#25265e",
                          width: '15%'
                        }}
                      >
                        Mobile
                      </TableCell>
                      <TableCell>
                        <ArrowDropDown
                          onClick={() => {
                            this.toggleButtons(i)
                            this.toggleDetails(i)
                          }}
                          style={{
                            width: "40px",
                            height: "30px",
                            color: "#25265e",
                          }}
                        ></ArrowDropDown>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow key={userName}>
                      <TableCell>
                        <Avatar {...this.stringAvatar(this.state.data[i].firstname, this.state.data[i].lastname)}></Avatar>
                      </TableCell>
                      <TableCell>{userName}</TableCell>
                      <TableCell>{this.state.data[i].role == 'user' ? "User" : "Admin"}</TableCell>
                      <TableCell>{this.state.data[i].email}</TableCell>
                      {!this.state.data[i].phone == "" ? (
                        <TableCell>{'+'}{this.state.data[i].phone}</TableCell>
                      ) : (
                        <TableCell></TableCell>
                      )}
                      {!this.state.data[i].mobile == "" ? (
                        <TableCell>{'+'}{this.state.data[i].mobile}</TableCell>
                      ) : (
                        <TableCell></TableCell>
                      )}
                      {this.state.showButtons[i] && (
                        <TableCell>
                          <EditIcon
                            style={{ color: blue[500] }}
                            onClick={() => {
                              this.toggleEditForm(i)
                              this.toggleDetails(i)
                            }}
                          ></EditIcon>
                          <DeleteIcon
                            style={{ color: red[500] }}
                            onClick={() => {
                              this.toggleDeleteForm(i)
                              this.toggleDetails(i)
                            }}
                          ></DeleteIcon>
                        </TableCell>
                      )}
                    </TableRow>
                  </TableBody>
                </TableContainer>
                {this.state.showDetails[i] && contracts.length != 0 && (
                  <>
                    <h3 style={{ color: '#193058', textAlign: 'center' }}>Related Contracts</h3>
                    {contracts}
                  </>
                )}
                {this.state.showEditForm[i] && (
                  <UpdateUser
                    url={this.props.url}
                    updated={this.handleUpdated}
                    index={i}
                    toggleEditForm={this.toggleEditForm}
                    toggleButtons={this.toggleButtons}
                    setSuccess={this.setSuccess}
                    userID={this.state.data[i].id}
                    companyID={this.state.data[i].companyID}
                    username={this.state.data[i].username}
                    password={this.state.data[i].password}
                    firstname={this.state.data[i].firstname}
                    lastname={this.state.data[i].lastname}
                    email={this.state.data[i].email}
                    phone={this.state.data[i].phone}
                    mobile={this.state.data[i].mobile}
                    error={this.props.error}
                  ></UpdateUser>
                )}
                {this.state.showDeleteForm[i] && (
                  <DeleteUser
                    url={this.props.url}
                    updated={this.handleUpdated}
                    index={i}
                    toggleDeleteForm={this.toggleDeleteForm}
                    toggleButtons={this.toggleButtons}
                    userID={this.state.data[i].id}
                    username={userName}
                    error={this.props.error}
                  />
                )}
              </div>
            )}
          </>
        );
      }
    }

    return (
      <>
        {this.state.loading && !this.state.error && (
          <CircularProgress
            style={{ marginBlockStart: "20%" }}
            size="50px"
          ></CircularProgress>
        )}
        {this.state.statusCode >= 300 && (
          <HttpError
            code={this.state.statusCode}
            text={this.state.statusText}
          />
        )}
        {!this.state.error && !this.state.loading && this.state.showUsers && (
          <div className="divContracts">
            <h2
              style={{
                paddingBottom: "1px",
                color: "#25265e",
              }}
            >
              {this.state.companyName}
            </h2>
            <div 
              style={{display: 'flex', width: '80%', marginTop: '18px', marginBottom: '10px', borderRadius: '10px', border: '1px solid gray', alignItems: 'center'}}
              >
              <SearchIcon style={{opacity: '0.5', paddingLeft: '10px'}}></SearchIcon>
              <form>
                <TextField
                  id="searchBar"
                  placeholder="Search a user name"
                  variant="standard"                        
                  size="small"
                  style={{width: '100%', marginTop: '14px', marginLeft: '6px', borderColor: 'red',}}  
                  onChange={(event) => this.setState({filter: event.target.value}) }     
                  InputProps={{
                    disableUnderline: true,
                  }}
                ></TextField>
              </form>
            </div>
            {users}            
            <AddUser
              url={this.props.url}
              companyName={this.props.companyName}
              companyID={this.state.companyID}
              updated={this.handleUpdated}
            />
          </div>
        )}
      </>
    );
  }
}

export default LoadHomeUser;
