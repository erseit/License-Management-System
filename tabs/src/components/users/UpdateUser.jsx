import React from "react";
import { CircularProgress, FormControl } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import Button from "@material-ui/core/Button";
import UpdateIcon from "@mui/icons-material/Update";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import IconButton from "@material-ui/core/IconButton";
import PhoneInput from "react-phone-input-2";
import RadioGroup from "@mui/material/RadioGroup";
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Alert from "@mui/material/Alert"
import "react-phone-input-2/lib/style.css";

import HttpError from "../main/HttpError";
import "../css/style.css";

class UpdateUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.userID,
      companyID: this.props.companyID,
      username: this.props.username,
      password: this.props.password,
      role: "",
      firstname: this.props.firstname,
      lastname: this.props.lastname,
      email: this.props.email,
      phone: this.props.phone,
      mobile: this.props.mobile,
      loading: false,
      statusCode: 0,
      statusText: "",
      error: false,
      showPassword: false,
      sendButtonDisabled: true,
      showAlert: false,
    };
  }

  handleEditForm = () => this.props.toggleEditForm(this.props.index)
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
  updateUserSubmit = (event) => {
    var formdata = JSON.stringify(this.state);
    fetch(this.props.url + "/updateuser", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      method: "put",
      body: formdata,
    })
      .then((response) => {
        if (response.status >= 300 && response.status != 400) {
          this.setHttpError(response.status, response.statusText);
        } else if (response.status == 400) {
          this.setState({ showAlert: !this.state.showAlert })
        } else {
          this.setLoading();
          setTimeout(() => {
            this.handleEditForm();
            this.props.updated();
            this.props.setSuccess(this.props.index, "User successfully updated")
          }, 1000);
          setTimeout(() => {
            this.props.setSuccess(this.props.index)
          }, 4000);
        }
        this.props.toggleButtons(this.props.index)
      })
      .catch(function (error) {
        console.log("Request failed", error);
      });
    event.preventDefault();
  };
  render() {
    return (
      <div>
        {!this.state.loading && !this.state.error && (
          <div className="editUserBox">
            {this.state.showAlert && (
              <Alert severity="error"> Sorry, that username is taken!</Alert>
            )}
            <form onSubmit={this.updateUserSubmit}>
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
                  type="text"
                  value={this.state.username}
                  onChange={this.changeUsername}
                  required
                ></TextField>
                <TextField
                  id="password"
                  label="Password"
                  variant="outlined"
                  type={this.state.showPassword ? "text" : "password"}
                  value={this.state.password}
                  onChange={this.changePassword}
                  required
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={this.handleClickShowPassword}
                        onMouseDown={this.handleMouseDownPassword}
                      >
                        {this.state.showPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
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
                  variant="outlined"
                  type="email"
                  value={this.state.email}
                  onChange={this.changeEmail}
                  required
                ></TextField>
                {!this.props.onlyUserRole ? (
                  <FormControl required>
                    <FormLabel id='role' style={{ textAlign: 'left' }}>Role</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="role"
                      id="role"
                      value={this.state.role}
                      defaultValue={this.props.role}
                      onChange={this.changeRole}
                      style={{ display: 'flex', justifyContent: 'flex-end' }}
                    >
                      <FormControlLabel style={{ marginRight: '30%' }} value="user" control={<Radio />} label="User" />
                      <FormControlLabel value="adminCompany" control={<Radio />} label="Admin" />
                    </RadioGroup>
                  </FormControl>
                ) : (
                  <TextField
                    id="role"
                    label="Role"
                    variant="outlined"
                    type="text"
                    value={this.props.role}
                    InputProps={{
                      readOnly: true,
                    }}
                  ></TextField>
                )}
                <div style={{ display: 'flex', width: '100%', textAlign: 'left' }}>
                  <div style={{ display: 'flex', width: '50%', alignItems: 'center', marginLeft: '10px' }}>
                    <div>Phone:</div>
                    <PhoneInput
                      id="phone"
                      inputStyle={{ width: '85%', height: '50px', required: 'true' }}
                      containerStyle={{ marginLeft: '10px' }}
                      dropdownStyle={{ height: '80px' }}
                      country={"de"}
                      value={this.state.phone}
                      onChange={(event) => this.setState({ phone: event })}
                      required
                      enableSearch
                      enableLongNumbers
                    > </PhoneInput>
                  </div>
                  <div style={{ display: 'flex', width: '50%', alignItems: 'center', marginRight: '10px' }}>
                    <div>Mobile:</div>
                    <PhoneInput
                      id="phone"
                      inputStyle={{ width: '85%', height: '50px', required: 'true' }}
                      containerStyle={{ marginLeft: '10px' }}
                      dropdownStyle={{ height: '80px' }}
                      country={"de"}
                      value={this.state.mobile}
                      onChange={(event) => this.setState({ mobile: event })}
                      required
                      enableSearch
                      enableLongNumbers
                    > </PhoneInput>
                  </div>
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
                    this.handleEditForm()
                  }}
                >
                  Cancel
                </this.ButtonBottom>
                <this.ButtonBottom
                  color="primary"
                  endIcon={<UpdateIcon />}
                  disabled={this.props.onlyUserRole ? false : this.state.sendButtonDisabled}
                >
                  Update
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

export default UpdateUser;
