import React from "react";
import { CircularProgress } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import Button from "@material-ui/core/Button";
import SendIcon from "@mui/icons-material/Send";
import AddBoxIcon from "@mui/icons-material/AddBoxOutlined";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import HttpError from "../main/HttpError";
import "../css/style.css";

class AddContract extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      companyID: this.props.companyID,
      startDate: "",
      endDate: "",
      responsable: "",
      secondResponsable: "",
      firstIP: "",
      secondIP: "",
      ipSechs: "",
      port: "",
      issuerID: "",
      serialNo: "",
      otherIPsDisabled: true,
      loading: false,
      showAddContract: true,
      showAddContractBox: false,
      statusCode: 0,
      statusText: "",
      error: false,
      dataUsers : this.props.dataUsers,
    };
  }

  showAddContractBox = () => {
    this.setState({
      showAddContractBox: !this.state.showAddContractBox,
      startDate: "",
      endDate: "",
      responsable: "",
      secondResponsable: "",
      firstIP: "",
      secondIP: "",
      ipSechs: "",
      port: "",
      issuerID: "",
      serialNo: "",
      otherIPsDisabled: true,
      error: false,
    });
  };

  changeStart = (event) => this.setState({ startDate: event.target.value})
  changeEnd = (event) => this.setState({ endDate: event.target.value})
  changeResponsable = (event) => this.setState({ responsable: event.target.value })
  changeSecondResponsable = (event) => this.setState({ secondResponsable: event.target.value })
  changeFirstIp = (event) => this.setState({ firstIP: event.target.value, otherIPsDisabled: !this.state.otherIPsDisabled})
  changeSecondIp = (event) => this.setState({ secondIP: event.target.value })
  changeIpSechs = (event) => this.setState({ ipSechs: event.target.value })
  changePort = (event) => this.setState({ port: event.target.value })
  changeIssuerID = (event) => this.setState({ issuerID: event.target.value })
  changeSerialNo = (event) => this.setState({ serialNo: event.target.value })

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
  addContractSubmit = (event) => {
    this.setLoading();
    var formdata = JSON.stringify(this.state);
    fetch(this.props.url + "/contracts/addContract", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      method: "post",
      body: formdata,
    })
      .then((response) => {
        if (response.status >= 300) {
          setTimeout(() => {
            this.setLoading();
            this.setHttpError(response.status, response.statusText);
          }, 1000);
        } else {
          this.showAddContractBox();
          setTimeout(() => {
            this.setLoading();
            this.setState({ showAddContract: true });
          }, 1000);
        }
      })
      .then(() => {
        if(this.state.statusCode == 0) {
          this.props.updated();
        }
      })
      .catch(function (error) {
        console.log("Request failed", error);
      });
    event.preventDefault();
  };
  render() {
    let allUsers = []
    for(let user of this.state.dataUsers) {
      allUsers.push(
        <MenuItem value={user}>{user}</MenuItem>
      )
    }
    return (
      <div>
        {this.state.showAddContract && (
          <AddBoxIcon
            type="submit"
            value="submit"
            onClick={() => {
              this.setState({ showAddContract: false });
              this.showAddContractBox();
            }}
            style={{ width: "70px", height: "80px", color: "#193058",  cursor: "pointer" }}
          >
            Add Contract
          </AddBoxIcon>
        )}
        {this.state.showAddContractBox &&
          !this.state.loading &&
          !this.state.error && (
            <div className="addContractBox">
              <form onSubmit={this.addContractSubmit}>
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
                    required={"true"}
                    type="date"
                    value={this.state.startDate}
                    onChange={this.changeStart}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start"></InputAdornment>
                      ),
                    }}
                  ></TextField>
                  <TextField
                    id="endDate"
                    label="End"
                    variant="outlined"
                    required={"true"}
                    type="date"
                    value={this.state.endDate}
                    onChange={this.changeEnd}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start"></InputAdornment>
                      ),
                    }}
                  ></TextField>
                  <FormControl sx={{ m:1 , minWidth: 120}} size="large">
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
                  <FormControl sx={{ m:1 , minWidth: 120}} size="large">
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
                  <TextField
                    id="firstIp"
                    label="IPv4"
                    required={"true"}
                    variant="outlined"
                    type="text"
                    value={this.state.firstIP}
                    onChange={this.changeFirstIp}
                  ></TextField>
                  <TextField
                    id="secondIp"
                    label="IPv4 (2)"
                    disabled={this.state.otherIPsDisabled}
                    variant="outlined"
                    type="text"
                    value={this.state.secondIP}
                    onChange={this.changeSecondIp}
                  ></TextField>
                  <TextField
                    id="ipSechs"
                    label="IPv6"
                    disabled={this.state.otherIPsDisabled}
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
                    required={"true"}
                    onChange={this.changePort}
                  ></TextField>
                  <TextField
                    id="issuerID"
                    label="Issuer-ID"
                    variant="outlined"
                    required={"true"}
                    type="number"
                    value={this.state.issuerID}
                    onChange={this.changeIssuerID}
                  ></TextField>
                  <TextField
                    id="serialNo"
                    label="Serial No"
                    variant="outlined"
                    required={"true"}
                    type="number"
                    value={this.state.serialNo}
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
                      this.showAddContractBox();
                      this.setState({ showAddContract: true });
                    }}
                  >
                    Cancel
                  </this.ButtonBottom>
                  <this.ButtonBottom
                    color="primary"
                    endIcon={<SendIcon />}
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
            requestMaker="Port or Issuer-Id or Serial No must not be empty"
          ></HttpError>
        )}
      </div>
    );
  }
}

export default AddContract;
