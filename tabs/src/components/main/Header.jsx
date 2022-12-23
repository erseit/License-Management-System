import React from "react";
import Button from "@material-ui/core/Button";

import "../css/style.css";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showBox: false,
    };
  }

  handleShow = () => this.setState({ showBox: !this.state.showBox });
  handleLogOut = () => {
    localStorage.clear()
    window.location.href = "/";
  };

  render() {
    if (this.props.logout === true) {
      return (
        <header>
          <h1>Alesta Solutions</h1>
          <div className="divLogOut">
            <Button className="buttonLogOut" onClick={this.handleShow}></Button>
            {this.state.showBox ? (
              <>
                <div className="infoLogOut">
                  <p>Are you sure?</p>
                  <div className="divSubmitButtons">
                    <Button
                      variant="contained"
                      type="submit"
                      value="submit"
                      onClick={this.handleShow}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      type="submit"
                      value="submit"
                      onClick={this.handleLogOut}
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              </>
            ) : null}
          </div>
          <h4>License Management System</h4>
        </header>
      );
    } else {
      return (
        <header>
          <h1>Alesta Solutions</h1>
          <h4>License Management System</h4>
        </header>
      );
    }
  }
}

export default Header;
