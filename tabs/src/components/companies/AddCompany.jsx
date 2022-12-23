import React from "react"
import clsx from "clsx"
import { withStyles } from "@material-ui/core/styles"
import { CircularProgress } from "@mui/material"
import Stack from "@mui/material/Stack"
import Input from "@material-ui/core/Input"
import InputLabel from "@material-ui/core/InputLabel"
import FormControl from "@material-ui/core/FormControl"
import Button from "@material-ui/core/Button"
import SendIcon from "@mui/icons-material/Send"
import AddBoxIcon from "@mui/icons-material/AddBoxOutlined"
import Alert from "@mui/material/Alert"
import HttpError from "../main/HttpError"

import "../css/style.css"

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
})

class AddCompany extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      companyname: "",
      address: "",
      addressDetails: "",
      sendButtonDisabled: true,
      showAddCompany: true,
      showAddCompanyBox: false,
      showAlert: false,
      loading: false,
      statusCode: 0,
      statusText: "",
      error: false,
    }
    this.changeName = this.changeName.bind(this)
    this.changeAddress = this.changeAddress.bind(this)
    this.changeAddressDetails = this.changeAddressDetails.bind(this)
  }

  showAddCompanyBox = () => {
    this.setState({
      showAddCompanyBox: !this.state.showAddCompanyBox,
      showAddCompany: !this.state.showAddCompany,
      companyname: "",
      address: "",
      addressDetails: "",
      sendButtonDisabled: !this.sendButtonDisabled,
    })
  }
  changeName = (event) => {
    let s = true
    if (this.state.address.length && event.target.value.length) {
      s = false
    }
    this.setState({ companyname: event.target.value, sendButtonDisabled: s })
  }

  changeAddress = (event) => {
    let s = true
    if (this.state.companyname.length && event.target.value.length) {
      s = false
    }
    this.setState({ address: event.target.value, sendButtonDisabled: s })
  }

  changeAddressDetails = (event) =>
    this.setState({ addressDetails: event.target.value })
  setHttpError = (code, message) =>
    this.setState({
      statusCode: code,
      statusText: message,
      error: !this.state.error,
    })
  setLoading = () => this.setState({ loading: !this.state.loading })
  FormControl = ({ classes, inputID, value, onChange, child }) => {
    return (
      <FormControl className={clsx(classes.margin, classes.textField)}>
        <InputLabel htmlFor={inputID}>{child}</InputLabel>
        <Input
          id={inputID}
          type="text"
          value={value}
          onChange={onChange}
          variant="outlined"
        />
      </FormControl>
    )
  }

  ButtonBottom = ({ color, ...rest }) => {
    return (
      <Button
        variant="contained"
        color={color}
        type="submit"
        value="submit"
        style={{
          width: "35%",
          margin: "5%",
        }}
        {...rest}
      />
    )
  }

  status(response) {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response)
    } else {
      return Promise.reject(new Error(response.statusText))
    }
  }
  addCustomerSubmit = (event) => {
    var formdata = JSON.stringify(this.state)
    fetch(this.props.url + "/companies/addCompany", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      method: "post",
      body: formdata,
    })
      .then((response) => {
        if (response.status >= 300 && response.status != 400) {
          this.setHttpError(response.status, response.statusText)
        } else if (response.status == 400) {
          this.setState({ showAlert: !this.state.showAlert })
        } else {
          this.setLoading()
          setTimeout(() => {
            this.showAddCompanyBox()
            this.setLoading()
          }, 1000)
        }
      })
      .then(() => {
        if (this.state.statusCode == 0) {
          this.props.updated();
        }
      })
      .catch(function (error) {
        console.log("Request failed", error)
      })
    event.preventDefault()
  }
  render() {
    const { classes } = this.props
    return (
      <div className="addCompany">
        {this.state.showAddCompany ? (
          <AddBoxIcon
            type="submit"
            value="submit"
            onClick={this.showAddCompanyBox}
            style={{ width: "70px", height: "80px", color: "#193058", cursor: "pointer" }}
          >
            Add Company
          </AddBoxIcon>
        ) : null}
        {this.state.showAddCompanyBox ? (
          <>
            <div className="addCompanyBox">
              {!this.state.loading && !this.state.error && (
                <>
                  {this.state.showAlert && (
                    <Alert severity="error"> There is already this customer!</Alert>
                  )}
                  <form onSubmit={this.addCustomerSubmit}>
                    <this.FormControl
                      classes={classes}
                      inputID="companyname"
                      value={this.state.companyname}
                      onChange={this.changeName}
                      child="Company Name"
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
                        onClick={()=> {
                          this.showAddCompanyBox()
                          this.setState({showAlert: !this.state.showAlert})
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
                  requestMaker={"  "}
                ></HttpError>
              )}
            </div>
          </>
        ) : null}
      </div>
    )
  }
}

export default withStyles(styles)(AddCompany)
