import React from "react";
import { CircularProgress } from "@mui/material";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { green, red, yellow, blue } from "@mui/material/colors";
import CircleIcon from "@mui/icons-material/Circle";
import ArrowDropDown from "@mui/icons-material/ArrowDropDownCircleOutlined";
import Button from "@material-ui/core/Button";
import UpdateIcon from "@mui/icons-material/Update";
import DeleteIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit"
import Alert from "@mui/material/Alert";

import AddContract from "./AddContract";
import HttpError from "../main/HttpError";
import UpdateContract from "./UpdateContract";
import DeleteContract from "./DeleteContract"

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

class LoadHomeContract extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      statusCode: "",
      statusText: "",
      showContracts: false,
      data: "",
      dataUsers: "",
      loading: true,
      error: false,
      companyID: "",
      companyName: this.props.companyName,
      showDetails: {},
      showEditForm: {},
      showDeleteForm: {},
      success: {},
      successMessage: '',
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

  toggleDetails = (index) => {
    const current = this.state.showDetails;
    current[index] = !current[index];
    this.setState({
      ...this.state,
      showDetails: current
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
    })
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
          dataUsers: data[0].allUsers,
          loading: false,
          showContracts: true,
        });
      }, 1000);
    } else {
      this.setState({ loading: true });
    }
  };
  handleLoad = (id) => {
    if (this.state.statusCode == 0) {
      var formdata = JSON.stringify({ companyID: id });
      fetch(this.props.url + "/contracts/allContracts", {
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
    const contracts = [];
    for (let i = 0; i < this.state.data.length; i++) {
      if (this.state.data[i].id != 0) {
        const date = new Date(this.state.data[i].startDate).toString();
        const template = date.split(" ");
        const newDate = template[2] + "." + template[1] + "." + template[3];
        const date2 = new Date(this.state.data[i].endDate);
        const template2 = date2.toString().split(" ");
        const newDate2 = template2[2] + "." + template2[1] + "." + template2[3];
        const validity = newDate + " - " + newDate2;
        let today = new Date();
        contracts.push(
          <>
            {!this.state.error && !this.state.loading && (
              <div className="divContract">
                {this.state.success[i] && (
                  <Alert severity="success">{this.state.successMessage}</Alert>
                )}
                <TableContainer>
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
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow key={this.state.data[i].id}>
                      <TableCell>{this.state.data[i].id}</TableCell>
                      <TableCell>{validity}</TableCell>
                      {today.getTime() < date2.getTime() &&
                        ( today.getFullYear() != date2.getFullYear() || 
                        (today.getFullYear() == date2.getFullYear() && date2.getMonth() - today.getMonth() > 2))  && (
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
                      <TableCell>{this.state.data[i].version}</TableCell>
                      <TableCell style={{ width: "1%" }}>
                        {" "}
                        <ArrowDropDown
                          onClick={() => this.toggleDetails(i)}
                          style={{
                            width: "40px",
                            height: "30px",
                            color: "#25265e",
                            cursor: "pointer"
                          }}
                        ></ArrowDropDown>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </TableContainer>
                {!this.state.showEditForm[i] && (
                  <>
                    {this.state.showDetails[i] && (
                      <>
                        <div className="divDetails">
                          <div className="divDetailsLeft">
                            <div>
                              <strong>Responsable: </strong>
                              {this.state.data[i].responsable}
                            </div>
                            <div>
                              <strong>IPv4: </strong>
                              {this.state.data[i].firstIP}
                            </div>
                            <div>
                              <strong>IPv4 (Optional): </strong>
                              {this.state.data[i].secondIP}
                            </div>
                            <div>
                              <strong>IPv6: </strong>
                              {this.state.data[i].ipSechs}
                            </div>
                            <div>
                              <strong>License Key: </strong>
                            </div>
                          </div>
                          <div className="divDetailsRight">
                            <div>
                              <strong>Responsable (2): </strong>
                              {this.state.data[i].secondResponsable}
                            </div>
                            <div>
                              <strong>Port: </strong>
                              {this.state.data[i].port}
                            </div>
                            <div>
                              <strong>Issuer-ID: </strong>
                              {this.state.data[i].issuerID}
                            </div>
                            <div>
                              <strong>Serial No: </strong>
                              {this.state.data[i].serialNo}
                            </div>
                          </div>
                          <div className="divContractRight">
                            <div className="divContractRightButtons">
                              <EditIcon
                                style={{ color: blue[500],  cursor: "pointer" }}
                                onClick={() => this.toggleEditForm(i)}
                              ></EditIcon>
                              <DeleteIcon
                                style={{ color: red[500],  cursor: "pointer" }}
                                onClick={() => this.toggleDeleteForm(i)}
                              ></DeleteIcon>
                            </div>
                          </div>
                        </div>
                        <textarea className="divKey" maxLength={50}>
                          {this.state.data[i].keyToken}
                        </textarea>
                        <Button
                          color="primary"
                          endIcon={<UpdateIcon />}
                          onClick={() => {
                            this.toggleDetails(i)
                            this.updateKeySubmit(this.state.data[i].id, i)
                          }
                          }
                        >
                          Update Key
                        </Button>
                      </>
                    )}
                  </>
                )}
                {this.state.showEditForm[i] && (
                  <UpdateContract
                    url={this.props.url}
                    updated={this.handleUpdated}
                    index={i}
                    toggleEditForm={this.toggleEditForm}
                    toggleDetails={this.toggleDetails}
                    setSuccess={this.setSuccess}
                    contractID={this.state.data[i].id}
                    start={this.state.data[i].startDate}
                    end={this.state.data[i].endDate}
                    responsable={this.state.data[i].responsable}
                    secondResponsable={this.state.data[i].secondResponsable}
                    firstIP={this.state.data[i].firstIP}
                    secondIP={this.state.data[i].secondIP}
                    ipSechs={this.state.data[i].ipSechs}
                    port={this.state.data[i].port}
                    issuerID={this.state.data[i].issuerID}
                    serialNo={this.state.data[i].serialNo}
                    dataUsers={this.state.dataUsers}
                    error={this.props.error}
                  />
                )}
                {this.state.showDeleteForm[i] && (
                  <DeleteContract
                    url={this.props.url}
                    updated={this.handleUpdated}
                    index={i}
                    toggleDeleteForm={this.toggleDeleteForm}
                    toggleDetails={this.toggleDetails}
                    contractID={this.state.data[i].id}
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
        {!this.state.error && !this.state.loading && this.state.showContracts && (
          <div className="divContracts">
            <h2
              style={{
                paddingBottom: "1px",
                color: "#25265e",
              }}
            >
              {this.state.companyName}
            </h2>
            {contracts}
            <AddContract
              url={this.props.url}
              companyName={this.props.companyName}
              companyID={this.state.companyID}
              updated={this.handleUpdated}
              dataUsers={this.state.dataUsers}
            />
          </div>
        )}
      </>
    );
  }
}

export default LoadHomeContract;
