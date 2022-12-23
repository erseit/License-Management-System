import React from "react";
import { CircularProgress } from "@mui/material";
import Stack from "@mui/material/Stack";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@mui/icons-material/DeleteForever";
import HttpError from "../main/HttpError";

class DeleteCompany extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.compID,
      statusCode: "",
      statusText: "",
      loading: false,
    };
  }

  handleDeleteBox = () => this.props.toggleDeleteForm(this.props.index);
  setStatusCode = (code) => this.setState({ statusCode: code });
  setLoading = () => this.setState({ loading: !this.state.loading });
  setHttpError = (code, message) =>
    this.setState({
      statusCode: code,
      statusText: message,
      error: !this.state.error,
    });

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
  deleteCustomerSubmit = (event) => {
    var formdata = JSON.stringify(this.state);
  
    fetch(this.props.url + "/companies/deleteCompany", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      method: "delete",
      body: formdata,
    })
      .then((response) => {
  
        if (response.status >= 300) {
          this.setHttpError(response.status, response.statusText);
        } else {
          this.setLoading();
          setTimeout(() => {
            this.handleDeleteBox();
            this.setLoading();
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
    return (
      <>
        <div className="deleteCompanyBox">
          {!this.state.loading && !this.state.error && (
            <>
              <h3 style={{ paddingInline: "25px" }}>
                Are you sure you want to delete "{this.props.compName}" ?
              </h3>
              <p>You can't undo this action.</p>
              <Stack
                spacing={2}
                direction="row"
                style={{ justifyContent: "center" }}
              >
                <this.ButtonBottom
                  color="secondary"
                  onClick={this.handleDeleteBox}
                >
                  Cancel
                </this.ButtonBottom>
                <this.ButtonBottom
                  color="primary"
                  onClick={this.deleteCustomerSubmit}
                  variant="outlined"
                  endIcon={<DeleteIcon />}
                >
                  Delete
                </this.ButtonBottom>
              </Stack>
            </>
          )}
          {this.state.loading && (
            <CircularProgress
              style={{ marginBlock: "15%", marginInlineStart: "45%" }}
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
      </>
    );
  }
}

export default DeleteCompany;
