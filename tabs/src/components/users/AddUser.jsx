import React from "react";
import { CircularProgress, FormControl } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@material-ui/core/Button";
import SendIcon from "@mui/icons-material/Send";
import AddBoxIcon from "@mui/icons-material/AddBoxOutlined";
import PhoneInput from "react-phone-input-2";
import RadioGroup from "@mui/material/RadioGroup";
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Alert from "@mui/material/Alert"
import "react-phone-input-2/lib/style.css";

import HttpError from "../main/HttpError";
import "../css/style.css";

class AddUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      companyID: this.props.companyID,
      username: "",
      password: "",
      role: "",
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      mobile: "",
      loading: false,
      showAddUser: true,
      showAddUserBox: false,
      statusCode: 0,
      statusText: "",
      error: false,
      showPassword: false,
      sendButtonDisabled: true,
      showAlert: false,
    };
  }

  showAddUserBox = () => {
    this.setState({
      showAddUserBox: !this.state.showAddUserBox,
      username: "",
      password: "",
      role: "",
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      mobile: "",
      error: false,
      sendButtonDisabled: true,
    });
  };

  changeUsername = (event) => this.setState({ username: event.target.value })
  changePassword = (event) => this.setState({ password: event.target.value })
  changeRole = (event) => this.setState({ role: event.target.value, sendButtonDisabled: false })
  changeFirstname = (event) => this.setState({ firstname: event.target.value })
  changeLastname = (event) => this.setState({ lastname: event.target.value })
  changeEmail = (event) => this.setState({ email: event.target.value })
  handleClickShowPassword = () => this.setState({ showPassword: !this.state.showPassword })

  setHttpError = (code, message) =>
    this.setState({
      statusCode: code,
      statusText: message,
      error: !this.state.error,
    });
  setLoading = () => this.setState({ loading: !this.state.loading });

  ButtonBottom = ({ color, ...rest }) => {
    return (
      <Button
        variant="contained"
        size="large"
        color={color}
        type="submit"
        value="submit"
        style={{
          width: "25%",
          margin: "5%",
        }}
        {...rest}
      />
    );
  };

  status(response) {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(new Error(response.statusText));
    }
  }
  addUserSubmit = (event) => {
    var formdata = JSON.stringify(this.state);
    fetch(this.props.url + "/adduser", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      method: "post",
      body: formdata,
    })
      .then((response) => {
        if (response.status >= 300 && response.status != 400) {
            this.setHttpError(response.status, response.statusText);
        } else if (response.status == 400) {
          this.setState({ showAlert: !this.state.showAlert })
        } else {
          this.setLoading();
          this.showAddUserBox();
          setTimeout(() => {
            this.setLoading();
            this.setState({ showAddUser: true });
          }, 1000);
        }
      })
      .then(() => {
        if (this.state.statusCode == 0) {
          this.props.updated();
        }
      })
      .catch(function (error) {
        console.log("Request failed", error);
      });
    event.preventDefault();
  };
  render() {
    return (
      <div>
        {this.state.showAddUser && (
          <AddBoxIcon
            type="submit"
            value="submit"
            onClick={() => {
              this.setState({ showAddUser: false });
              this.showAddUserBox();
            }}
            style={{ width: "70px", height: "80px", color: "#193058", cursor : "pointer" }}
          >
            Add User
          </AddBoxIcon>
        )}
        {this.state.showAddUserBox &&
          !this.state.loading &&
          !this.state.error && (
              <div className="addUserBox">
              {this.state.showAlert && (
                    <Alert severity="error"> Sorry, that username is taken!</Alert>
                  )}
                <form onSubmit={this.addUserSubmit}>
                  <Box
                    sx={{
                      "& > :not(style)": {
                        m: 1,
                        width: "46%",
                        paddingInlineStart: "0.6%",
                        marginTop: "4%"
                      },
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <TextField
                      id="username"
                      label="Username"
                      variant="outlined"
                      required
                      type="text"
                      value={this.state.username}
                      onChange={this.changeUsername}
                    ></TextField>
                    <TextField
                      id="password"
                      label="Password"
                      variant="outlined"
                      required
                      type={this.state.showPassword ? "text" : "password"}
                      value={this.state.password}
                      onChange={this.changePassword}
                    ></TextField>
                    <TextField
                      id="firstname"
                      label="Firstname"
                      variant="outlined"
                      type="text"
                      value={this.state.firstname}
                      onChange={this.changeFirstname}
                    ></TextField>
                    <TextField
                      id="lastname"
                      label="Lastname"
                      variant="outlined"
                      type="text"
                      value={this.state.lastname}
                      onChange={this.changeLastname}
                    ></TextField>
                    <TextField
                      id="email"
                      label="Email"
                      required
                      variant="outlined"
                      type="email"
                      value={this.state.email}
                      onChange={this.changeEmail}
                    ></TextField>
                    <FormControl required>
                      <FormLabel id='role' style={{ textAlign: 'left' }}>Role</FormLabel>
                      <RadioGroup
                        row
                        aria-labelledby="role"
                        id="role"
                        value={this.state.role}
                        onChange={this.changeRole}
                        style={{ display: 'flex', justifyContent: 'flex-end' }}
                      >
                        <FormControlLabel style={{ marginRight: '30%' }} value="user" control={<Radio />} label="User" />
                        <FormControlLabel value="adminCompany" control={<Radio />} label="Admin" />
                      </RadioGroup>
                    </FormControl>
                    <div
                      style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-around',
                        marginLeft: '2.5%'
                      }}
                    >
                      <PhoneInput
                        id="phone"
                        country={'de'}
                        disableCountryCode
                        enableLongNumbers
                        inputStyle={{ height: '55px', textAlign: 'left' }}
                        containerStyle={{}}
                        dropdownStyle={{ height: '80px' }}
                        value={this.state.phone}
                        onChange={(event) => this.setState({ phone: event })}
                        required
                        placeholder="Phone (49) 123-4567890"
                        enableSearch
                      > </PhoneInput>
                      <PhoneInput
                        id="phone"
                        country={'de'}
                        disableCountryCode
                        enableLongNumbers
                        inputStyle={{ height: '55px' }}
                        containerStyle={{}}
                        dropdownStyle={{ height: '80px' }}
                        value={this.state.mobile}
                        onChange={(event) => this.setState({ mobile: event })}
                        required
                        placeholder="Mobile (49) 123-4567"
                        enableSearch
                      > </PhoneInput>
                    </div>
                  </Box>
                  <Stack
                    spacing={2}
                    direction="row"
                    style={{ justifyContent: "center" }}
                  >
                    <this.ButtonBottom
                      color="secondary"
                      onClick={() => {
                        this.showAddUserBox();
                        this.setState({ showAddUser: true, showAlert: false });
                      }}
                    >
                      Cancel
                    </this.ButtonBottom>
                    <this.ButtonBottom
                      color="primary"
                      endIcon={<SendIcon />}
                      disabled={this.state.sendButtonDisabled}
                    >
                      Send
                    </this.ButtonBottom>
                  </Stack>
                </form>
              </div>
          )}
        {this.state.loading && (
          <CircularProgress
            style={{ marginBlock: "25%", marginInlineStart: "0%" }}
            size="50px"
          ></CircularProgress>
        )}
        {this.state.error && (
          <HttpError
            code={this.state.statusCode}
            text={this.state.statusText}
            reload={this.setHttpError}
          ></HttpError>
        )}
      </div>
    );
  }
}

export default AddUser;
