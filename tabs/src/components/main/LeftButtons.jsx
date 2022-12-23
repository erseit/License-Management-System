import React from 'react';
import Button from '@material-ui/core/Button';
import '../css/style.css';

class LeftButtons extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCustomer: false,
      showSettings: false,
      showUsers: false,
      showContracts: false,
      showCompanies: false,
    };
  }

  handleShowCompanies = () => this.setState({ showCompanies: !this.state.showCompanies });
  handleShowCustomer = () => this.setState({ showCustomer: !this.state.showCustomer });
  handleShowSettings = () => this.setState({ showSettings: !this.state.showSettings });
  handleShowUsers = () => this.setState({ showUsers: !this.state.showUsers });
  handleShowContracts = () => this.setState({ showContracts: !this.state.showContracts });

  render() {
    return (
      <>
        {this.props.role === 'adminSystem' && (
          <div className="divLeftButtons" style={{ display: this.props.displayLeftButtons }}>
            <div className="divLeftButton">
              <Button
                className="buttonCompanies"
                onMouseEnter={this.handleShowCompanies}
                onMouseLeave={this.handleShowCompanies}
                onClick={() => this.props.homePageAdminSystem()}
                type="submit"
                value="submit"
              ></Button>
              {this.state.showCompanies ? (
                <>
                  <div className="triangle"></div>
                  <div className="buttonName">Companies</div>
                </>
              ) : null}
            </div>
            <div className="divLeftButton">
              <Button
                className="buttonCustomers"
                onMouseEnter={this.handleShowCustomer}
                onMouseLeave={this.handleShowCustomer}
                onClick={() => this.props.companiesWithUsers()}
                type="submit"
                value="submit"
              ></Button>
              {this.state.showCustomer ? (
                <>
                  <div className="triangle"></div>
                  <div className="buttonName">Users</div>
                </>
              ) : null}
            </div>
            <div className="divLeftButton">
              <Button
                className="buttonContracts"
                onClick={() => this.props.companiesWithContracts()}
                onMouseEnter={this.handleShowContracts}
                onMouseLeave={this.handleShowContracts}
                type="submit"
                value="submit"
              ></Button>
              {this.state.showContracts ? (
                <>
                  <div className="triangle"></div>
                  <div className="buttonName">Contracts</div>
                </>
              ) : null}
            </div>
          </div>
        )}
        {this.props.role === 'adminCompany' && (
          <div className="divLeftButtons" style={{ display: this.props.displayLeftButtons }}>
            <div className="divLeftButton">
              <Button
                className="buttonUsers"
                onClick={() => this.props.homePageAdminCompany()}
                onMouseEnter={this.handleShowUsers}
                onMouseLeave={this.handleShowUsers}
                type="submit"
                value="submit"
              ></Button>
              {this.state.showUsers ? (
                <>
                  <div className="triangle"></div>
                  <div className="buttonName">Users</div>
                </>
              ) : null}
            </div>
            <div className="divLeftButton">
              <Button
                className="buttonContracts"
                onClick={() => this.props.contractsPageAdminCompany()}
                onMouseEnter={this.handleShowContracts}
                onMouseLeave={this.handleShowContracts}
                type="submit"
                value="submit"
              ></Button>
              {this.state.showContracts ? (
                <>
                  <div className="triangle"></div>
                  <div className="buttonName">Contracts</div>
                </>
              ) : null}
            </div>
            <div className="divLeftButton">
              <Button
                className="buttonSettings"
                onMouseEnter={this.handleShowSettings}
                onMouseLeave={this.handleShowSettings}
                onClick={() => this.props.settings()}
                type="submit"
                value="submit"
              ></Button>
              {this.state.showSettings ? (
                <>
                  <div className="triangle"></div>
                  <div className="buttonName">Settings</div>
                </>
              ) : null}
            </div>
          </div>
        )}
      </>
    );
  }
}

export default LeftButtons;
