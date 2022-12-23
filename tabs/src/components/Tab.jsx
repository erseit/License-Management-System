import React from "react";
import { withStyles } from "@material-ui/core/styles";
import "./css/style.css";

import Login from "./main/Login";
import HomePageAdminSystem from "./main/HomePageAdminSystem";
import HomePageAdminCompany from "./main/HomePageAdminCompany";
import HomePageUser from "./main/HomePageUser";

const theUrl = process.env.REACT_APP_URL;
const styles = (theme) => ({
  page: {
    display: "flex",
    flexDirection: "column",
    background: "red",
  },

  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "85vh",
    minWidth: "85vh",
    background: "white",
    marginTop: "10%",
  },
});

class Tab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: window.localStorage.getItem('loggedIn') || true,
      companyID: window.localStorage.getItem('companyID') || "",
      role: window.localStorage.getItem('role') || "",
      token: window.localStorage.getItem('token') || "",
    };
  }

  authorized = () => this.setState({ loggedIn: !this.state.loggedIn })
  setRole = (role) => this.setState({ role: role })
  setToken = (token) => this.setState({ token: token })
  setCompanyID = (id) => this.setState({ companyID: id })
  

  render() {
      window.localStorage.setItem('loggedIn', this.state.loggedIn)
      window.localStorage.setItem('companyID', this.state.companyID)
      window.localStorage.setItem('role', this.state.role)
      window.localStorage.setItem('token', this.state.token);
    return (
      <>
        {
          this.state.loggedIn ? (
            <Login
            url={theUrl}
            authorized={this.authorized}
            companyID={this.setCompanyID}
            role={this.setRole}
            token={this.setToken}
          />
          ) : (
            <>
            {this.state.role == "adminSystem" && (
              <HomePageAdminSystem
                url={theUrl}
                role={this.state.role}
                token={this.state.token}
                authorized={this.authorized}
              />
            )}
            {this.state.role == "adminCompany" && (
              <HomePageAdminCompany
                url={theUrl}
                role={this.state.role}
                authorized={this.authorized}
                token={this.state.token}
                companyID={this.state.companyID}
              />
            )}
              {this.state.role == "user" && (
              <HomePageUser
                url={theUrl}
                role={this.state.role}
                authorized={this.authorized}
                token={this.state.token}
              />
            )}
          </>
          )
        }
      </>
    )
  }
}

export default withStyles(styles)(Tab);
