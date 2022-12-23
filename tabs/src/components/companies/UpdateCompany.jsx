import React from "react";
import clsx from "clsx";
import { withStyles } from "@material-ui/core/styles";
import { CircularProgress } from "@mui/material";
import Stack from "@mui/material/Stack";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import UpdateIcon from "@mui/icons-material/Update";
import Alert from "@mui/material/Alert"

import HttpError from "../main/HttpError";
import "../css/style.css";

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

class UpdateCompany extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      companyname: this.props.compName,
      address: this.props.compAdr,
      addressDetails: this.props.compAdrDet,
      id: this.props.compID,
      loading: false,
      statusCode: 0,
      statusText: "",
      error: false,
      showAlert: false,
    };
  }

  handleEditBox = () => this.props.toggleEditForm(this.props.index);
  changeName = (event) => this.setState({ companyname: event.target.value });
  changeAddress = (event) => this.setState({ address: event.target.value });
  changeAddressDetails = (event) => this.setState({ addressDetails: event.target.value });
  setStatusCode = (code) => this.setState({ statusCode: code });
  setLoading = () => this.setState({ loading: !this.state.loading });
  setHttpError = (code, message) =>
    this.setState({
      statusCode: code,
      statusText: message,
      error: !this.state.error,
    });

  FormControl = ({ classes, inputID, value, onChange, child, ...rest }) => {
    return (
      <FormControl className={clsx(classes.margin, classes.textField)}>
        <InputLabel htmlFor={inputID}>{child}</InputLabel>
        <Input
          id={inputID}
          type="text"
          value={value}
          onChange={onChange}
          variant="outlined"
          {...rest}
        />
      </FormControl>
    );
  };
  ButtonBottom = ({ color, ...rest }) => {
    return (
      <Button
        variant="contained"
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
  editCustomerSubmit = (event) => {
    var formdata = JSON.stringify(this.state);
    fetch(this.props.url + "/companies/updateCompany", {
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
            this.handleEditBox();
            this.setLoading();
          }, 1000);
          this.props.toggleButtons(this.props.index);
        }
      })
      .then(() => {
        if (this.state.statusCode == 0) {
          this.props.updated()
          setTimeout(() => {
            this.props.setSuccess(this.props.index, "Customer successfully updated")
          }, 1000);
          setTimeout(() => {
            this.props.setSuccess(this.props.index)
          }, 3000);
        }
      })
      .catch(function (error) {
        console.log("Request failed", error);
      });
    event.preventDefault();
  };
  render() {
    const { classes } = this.props;
    return (
      <div className="editCompanyBox">
        {!this.state.loading && !this.state.error && (
          <>
            {this.state.showAlert && (
              <Alert severity="error"> There is already this customer!</Alert>
            )}
            <form onSubmit={this.editCustomerSubmit}>
              <this.FormControl
                classes={classes}
                inputID="companyname"
                value={this.state.companyname}
                onChange={this.changeName}
                child="Company Name"
                required={true}
              />
              <this.FormControl
                classes={classes}
                inputID="address"
                value={this.state.address}
                onChange={this.changeAddress}
                child="Address"
              />
              <this.FormControl
                classes={classes}
                inputID="addressSecond"
                value={this.state.addressDetails}
                onChange={this.changeAddressDetails}
                child="Address Details"
              />
              <Stack
                spacing={2}
                direction="row"
                style={{ justifyContent: "center" }}
              >
                <this.ButtonBottom
                  color="secondary"
                  onClick={this.handleEditBox}
                >
                  Cancel
                </this.ButtonBottom>
                <this.ButtonBottom color="primary" endIcon={<UpdateIcon />}>
                  Update
                </this.ButtonBottom>
              </Stack>
            </form>
          </>

        )}
        {this.state.loading && (
          <CircularProgress
            style={{ marginBlock: "25%", marginInlineStart: "45%" }}
            size="50px"
          ></CircularProgress>
        )}
        {this.state.error && (
          <HttpError
            code={this.state.statusCode}
            text={this.state.statusText}
            reload={this.setHttpError}
            requestMaker={" "}
          ></HttpError>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(UpdateCompany);
