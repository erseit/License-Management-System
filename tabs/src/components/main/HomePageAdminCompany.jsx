import React from "react"
import { withStyles } from "@material-ui/core/styles"
import Buttons from "./LeftButtons"
import HttpError from "./HttpError"
import Header from "./Header"
import LoadHomeUser from "../users/LoadHomeUser"
import LoadHomeContract from "../contracts/LoadHomeContract"
import HomePageUser from "./HomePageUser"
import "../css/style.css";


const styles = () => ({
  page: {
    display: "flex",
    flexDirection: "column",
    minHeight: "fit-content",
  },

  main: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: "100vh",
  },

  center: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    height: "80vh",
   marginLeft: '4%',
    marginTop: '5%',
  },
})

class HomePageAdminCompany extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      logoutButtonShow: true,
      displayLeftButtons: "unset",
      statusCode: "",
      statusText: "",
      showUsers: false,
      showContracts: false,
      data: "",
      companyID: "",
      role: "",
      error: false,
      showHomePageUser: false,
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ companyID: this.props.companyID, showUsers: !this.state.showUsers })
      window.localStorage.setItem("companyID", this.props.companyID)
      this.handleLoad(this.state.companyID, "/companies/allCompanies")
    }, 100);
  }

  setHttpError = (code, message) => this.setState({ statusCode: code, statusText: message })
  status(response) {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response)
    } else {
      return Promise.reject(new Error(response.statusText))
    }
  }

  handleLoad = (id, path) => {
    if (this.state.statusCode == 0) {
      var formdata = JSON.stringify({ companyID: id })
      fetch(this.props.url + path, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        method: "post",
        body: formdata,
      })
        .then((response) => {
          if (response.status >= 300) {
            this.setHttpError(response.status, response.statusText)
            this.setState({ displayLeftButtons: "none", error: !this.state.error })
          } else {
            return response.json()
          }
        })
        .then((data) => {
          if (path == "/allusers") {
            this.setState({ data: data, showUsers: true })
          }
          if (path == "/contracts/allContracts") {
            this.setState({ data: data, showContracts: true })
          }
        })
        .catch(function (error) {
          console.log("Request failed", error)
        })
    }
  }

  render() {
    const { classes } = this.props
    return (
      <>
        <div className={classes.page}>
        <Header logout={this.state.logoutButtonShow}></Header>
          <div className={classes.main}>
            <Buttons
              role={this.props.role}
              url={this.props.url}
              displayLeftButtons={this.state.displayLeftButtons}
              homePageAdminCompany={() => {
                this.setState({ showUsers: !this.state.showUsers, showContracts: false, showHomePageUser: false })
                this.handleLoad(this.state.companyID, "allusers")
              }}
              contractsPageAdminCompany={() => {
                this.setState({ showUsers: false, showContracts: !this.state.showContracts, showHomePageUser: false })
                this.handleLoad(this.state.companyID, "/contracts/allContracts")
              }}
              settings={
                () => {
                  this.setState({ showUsers: false, showContracts: false, showHomePageUser: !this.state.showHomePageUser })
                }
              }
            ></Buttons>
            <div className={classes.center}>
              {this.state.showHomePageUser && (
                <div style={{ width: '100%', marginTop: '-5%' }}>
                  <HomePageUser style={{ width: '100%' }}
                    url={this.props.url}
                    role={this.props.role}
                    token={this.props.token}
                    authorized={this.props.authorized}
                    onlyUserRole={this.props.role}
                  />
                </div>
              )}
              {this.state.statusCode >= 300 && (
                <HttpError
                  code={this.state.statusCode}
                  text={this.state.statusText}
                  reload={this.props.authorized}
                />
              )}
              {this.state.showUsers && (
                <LoadHomeUser
                  url={this.props.url}
                  companyID={this.state.companyID}
                />
              )}
              {this.state.showContracts && (
                <LoadHomeContract
                  url={this.props.url}
                  companyID={this.state.companyID}
                />
              )}
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default withStyles(styles)(HomePageAdminCompany)
