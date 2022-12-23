import React from "react";
import { CircularProgress } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import Button from "@material-ui/core/Button";
import UpdateIcon from "@mui/icons-material/Update";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import HttpError from "../main/HttpError";
import "../css/style.css";

class UpdateContract extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.contractID,
      companyID: this.props.companyID,
      startDate: this.props.start,
      endDate: this.props.end,
      responsable: this.props.responsable,
      secondResponsable: this.props.secondResponsable,
      firstIP: this.props.firstIP,
      secondIP: this.props.secondIP,
      ipSechs: this.props.ipSechs,
      port: this.props.port,
      issuerID: this.props.issuerID,
      serialNo: this.props.serialNo,
      loading: false,
      statusCode: 0,
      statusText: "",
      error: false,
      dataUsers: this.props.dataUsers,
    };
  }

  handleEditForm = () => this.props.toggleEditForm(this.props.index)
  changeStart = (event) => this.setState({ startDate: event.target.value })
  changeEnd = (event) => this.setState({ endDate: event.target.value })
  changeResponsable = (event) =>
    this.setState({ responsable: event.target.value })
  changeSecondResponsable = (event) =>
    this.setState({ secondResponsable: event.target.value })
  changeFirstIp = (event) => this.setState({ firstIP: event.target.value })
  changeSecondIp = (event) => this.setState({ secondIP: event.target.value })
  changeIpSechs = (event) => this.setState({ ipSechs: event.target.value })
  changePort = (event) =>
    this.setState({ port: event.target.value })
  changeIssuerID = (event) =>
    this.setState({ issuerID: event.target.value })
  changeSerialNo = (event) =>
    this.setState({ serialNo: event.target.value })

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
          cursor: "pointer"
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
  updateContractSubmit = (event) => {
    this.setLoading();
    var formdata = JSON.stringify(this.state);
    fetch(this.props.url + "/contracts/updateContract", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      method: "put",
      body: formdata,
    })
      .then((response) => {
        if (response.status >= 300) {
          setTimeout(() => {
            this.setLoading();
            this.setHttpError(response.status, response.statusText);
          }, 1000)
        } else {
          setTimeout(() => {
            this.setLoading();
            this.handleEditForm();
          }, 1000);
          this.props.updated();
          setTimeout(() => {
            this.props.setSuccess(this.props.index, "Contract successfully updated")
          }, 2000);
          setTimeout(() => {
            this.props.setSuccess(this.props.index)
          }, 4000);
        }
        this.props.toggleDetails(this.props.index)
      })
      .catch(function (error) {
        console.log("Request failed", error);
      });
    event.preventDefault();
  };

  render() {
    let allUsers = []
    if (this.props.role != "user") {
      for (let user of this.state.dataUsers) {
        allUsers.push(
          <MenuItem value={user}>{user}</MenuItem>
        )
      }
    }

    return (
      <div>
        {!this.state.loading &&
          !this.state.error &&
          (
            <div className="editContractBox">
              <form onSubmit={this.updateContractSubmit}>
                <Box
                  sx={{
                    "& > :not(style)": {
                      m: 1,
                      width: "46%",
                      paddingInlineStart: "0.6%",
                    },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    id="startDate"
                    label="Start"
                    variant="outlined"
                    type="date"
                    value={this.state.startDate}
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                        <InputAdornment position="start"></InputAdornment>
                      ),
                    }}
                  ></TextField>
                  <TextField
                    id="endDate"
                    label="End"
                    variant="outlined"
                    type="date"
                    value={this.state.endDate}
                    onChange={this.changeEnd}
                    InputProps={{
                      readOnly: this.props.role == "user" ? true : false,
                      startAdornment: (
                        <InputAdornment position="start"></InputAdornment>
                      ),
                    }}
                  ></TextField>
                  {this.props.role != "user" && (
                    <>
                      <FormControl sx={{ m: 1, minWidth: 120 }} size="large">
                        <InputLabel id="responsable" required>Select a person</InputLabel>
                        <Select
                          labelId="responsable"
                          id="responsable"
                          value={this.state.responsable}
                          label="Select a person"
                          onChange={this.changeResponsable}
                        >
                          {allUsers}
                        </Select>
                      </FormControl>
                      <FormControl sx={{ m: 1, minWidth: 120 }} size="large">
                        <InputLabel id="responsable2" required>Select a person</InputLabel>
                        <Select
                          labelId="responsable2"
                          id="responsable"
                          value={this.state.secondResponsable}
                          label="Select a person"
                          onChange={this.changeSecondResponsable}
                        >
                          {allUsers}
                        </Select>
                      </FormControl>
                    </>
                  )}
                  <TextField
                    id="firstIp"
                    label="IPv4"
                    variant="outlined"
                    type="text"
                    value={this.state.firstIP}
                    onChange={this.changeFirstIp}
                  ></TextField>
                  <TextField
                    id="secondIp"
                    label="IPv4 (2)"
                    variant="outlined"
                    type="text"
                    value={this.state.secondIP}
                    onChange={this.changeSecondIp}
                  ></TextField>
                  <TextField
                    id="ipSechs"
                    label="IPv6"
                    variant="outlined"
                    type="text"
                    value={this.state.ipSechs}
                    onChange={this.changeIpSechs}
                  ></TextField>
                  <TextField
                    id="Port"
                    label="Port"
                    variant="outlined"
                    type="number"
                    value={this.state.port}
                    InputProps={{
                      readOnly: this.props.role == "user" ? true : false,
                    }}
                    onChange={this.changePort}
                  ></TextField>
                  <TextField
                    id="Issuer-ID"
                    label="Issuer-ID"
                    variant="outlined"
                    type="number"
                    value={this.state.issuerID}
                    InputProps={{
                      readOnly: this.props.role == "user" ? true : false,
                    }}
                    onChange={this.changeIssuerID}
                  ></TextField>
                  <TextField
                    id="Serial No"
                    label="Serial No"
                    variant="outlined"
                    type="number"
                    value={this.state.serialNo}
                    InputProps={{
                      readOnly: this.props.role == "user" ? true : false,
                    }}
                    onChange={this.changeSerialNo}
                  ></TextField>
                </Box>
                <Stack
                  spacing={2}
                  direction="row"
                  style={{ justifyContent: "center" }}
                >
                  <this.ButtonBottom
                    color="secondary"
                    onClick={() => {
                      this.handleEditForm();
                    }}
                  >
                    Cancel
                  </this.ButtonBottom>
                  <this.ButtonBottom color="primary" endIcon={<UpdateIcon />}>
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
            reload={this.handleEditForm}
          ></HttpError>
        )}
      </div>
    );
  }
}

export default UpdateContract;
