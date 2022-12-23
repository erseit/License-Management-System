import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import Stack from '@mui/material/Stack';
import ArrowDropDown from '@mui/icons-material/ArrowDropDownCircleOutlined';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import { blue, red } from '@mui/material/colors';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import AddCompany from './AddCompany';
import UpdateCompany from './UpdateCompany';
import DeleteCompany from './DeleteCompany';
import LoadHomeContract from '../contracts/LoadHomeContract';
import LoadHomeUser from '../users/LoadHomeUser';
import '../css/style.css';
import { display } from '@mui/system';

const styles = (theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  textField: {
    width: '90%',
    padding: '1px',
  },
});

class LoadHomeCompany extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCompanies: 'inherit',
      showEditForm: {},
      showDeleteForm: {},
      showEditButtons: {},
      showContracts: false,
      showUsers: false,
      companyID: 0,
      companyName: '',
      success: {},
      successMessage: '',
      filter: '',
    };
  }

  toggleEditButtons = (index) => {
    const current = this.state.showEditButtons;
    current[index] = !current[index];

    this.setState({
      ...this.state,
      showEditButtons: current,
    });
  };

  toggleEditForm = (index) => {
    const current = this.state.showEditForm;
    current[index] = !current[index];

    this.setState({
      ...this.state,
      showEditForm: current,
    });
  };

  toggleDeleteForm = (index) => {
    const current = this.state.showDeleteForm;
    current[index] = !current[index];

    this.setState({
      ...this.state,
      showDeleteForm: current,
    });
  };

  setSuccess = (index, message) => {
    const current = this.state.success;
    current[index] = !current[index];
    this.setState({
      ...this.state,
      success: current,
      successMessage: message,
    });
  };

  loadContractsPage = (id, name) => {
    this.setState({ showContracts: !this.state.showContracts, companyID: id, companyName: name });
  };

  loadUsersPage = (id, name) => {
    this.setState({ showUsers: !this.state.showUsers, companyID: id, companyName: name });
  };
  ButtonBottom = ({ ...rest }) => {
    return (
      <Button
        variant="contained"
        color="primary"
        type="submit"
        value="submit"
        style={{
          width: '140px',
          height: '40px',
          marginTop: '5%',
          color: 'white',
          backgroundColor: '#193058',
        }}
        {...rest}
      />
    );
  };

  setResearch = () => this.setState({ showSearchResults: !this.state.showSearchResults });

  render() {
    const data = [];
    const companies = [];
    for (const [index, value] of this.props.data.entries()) {
      data.push(value);
    }

    for (let i = 0; i < data.length; i++) {
      if (data[i].companyname.toLowerCase().includes(this.state.filter.toLowerCase())) {
        companies.push(
          <>
            {!this.state.showEditForm[i] && !this.state.showDeleteForm[i] && (
              <div className="divCompanyBig">
                {this.state.success[i] && <Alert severity="success">{this.state.successMessage}</Alert>}
                <div className="divCompany" key={data[i].id}>
                  <div className="divCompanyLeft">
                    <div className="companyInfos">
                      <div
                        style={{
                          textAlign: 'left',
                          color: '#25265e',
                          width: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          marginLeft: '-10%',
                        }}
                      >
                        <h2
                          style={{
                            color: '#25265e',
                            width: '100%',
                          }}
                        >
                          {data[i].companyname}
                        </h2>
                        <p
                          style={{
                            color: '#25265e',
                            width: '100%',
                            marginTop: '-10%',
                          }}
                        >
                          {data[i].adress}
                        </p>
                      </div>

                      {data[i].adressDetails !== '' ? (
                        <div
                          style={{
                            textAlign: 'left',
                            marginInlineStart: '15px',
                            color: '#25265e',
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          <h2
                            style={{
                              color: '#25265e',
                              width: '100%',
                              visibility: 'hidden',
                            }}
                          >
                            {'a'}
                          </h2>
                          <p
                            style={{
                              color: '#25265e',
                              width: '100%',
                              marginTop: '-10%',
                            }}
                          >
                            <strong>{'Details: '}</strong>
                            {data[i].adressDetails}
                          </p>
                        </div>
                      ) : null}
                    </div>
                    <Stack spacing={2} direction="row" style={{ marginTop: '10px' }}>
                      <this.ButtonBottom onClick={() => this.loadUsersPage(data[i].id, data[i].companyname)}>
                        USERS
                      </this.ButtonBottom>
                      <this.ButtonBottom onClick={() => this.loadContractsPage(data[i].id, data[i].companyname)}>
                        CONTRACTS
                      </this.ButtonBottom>
                    </Stack>
                  </div>
                  <div className="divCompanyRight">
                    <ArrowDropDown
                      onClick={() => this.toggleEditButtons(i)}
                      style={{
                        width: '40px',
                        height: '30px',
                        marginTop: '25px',
                        color: '#25265e',
                        cursor: 'pointer',
                      }}
                    ></ArrowDropDown>
                    {this.state.showEditButtons[i] && (
                      <div className="divCompanyRightButtons">
                        <EditIcon
                          style={{ fontSize: '32px', color: blue[500], cursor: 'pointer' }}
                          onClick={() => this.toggleEditForm(i)}
                        ></EditIcon>
                        <DeleteIcon
                          style={{ fontSize: '32px', color: red[500], cursor: 'pointer' }}
                          onClick={() => this.toggleDeleteForm(i)}
                        ></DeleteIcon>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            {this.state.showEditForm[i] && (
              <UpdateCompany
                url={this.props.url}
                updated={this.props.updated}
                index={i}
                toggleEditForm={this.toggleEditForm}
                toggleButtons={this.toggleEditButtons}
                setSuccess={this.setSuccess}
                compID={data[i].id}
                compName={data[i].companyname}
                compAdr={data[i].adress}
                compAdrDet={data[i].adressDetails}
                error={this.props.error}
              />
            )}
            {this.state.showDeleteForm[i] && (
              <DeleteCompany
                url={this.props.url}
                updated={this.props.updated}
                index={i}
                toggleDeleteForm={this.toggleDeleteForm}
                compID={data[i].id}
                compName={data[i].companyname}
                error={this.props.error}
              />
            )}
          </>,
        );
      }
    }
    return (
      <div className="divCompanies" style={{ display: this.state.showCompanies }}>
        {!this.state.showContracts && !this.state.showUsers && (
          <>
            <div
              style={{
                display: 'flex',
                width: '100%',
                marginTop: '18px',
                marginBottom: '10px',
                borderRadius: '10px',
                border: '1px solid gray',
                alignItems: 'center',
                marginLeft : '4px'
              }}
            >
              <SearchIcon style={{ opacity: '0.5', paddingLeft: '10px' }}></SearchIcon>
              <form>
                <TextField
                  id="searchBar"
                  placeholder="Search a company name"
                  variant="standard"
                  size="small"
                  style={{ width: '100%', marginTop: '14px', marginLeft: '14px', borderColor: 'red' }}
                  onChange={(event) => this.setState({ filter: event.target.value })}
                  InputProps={{
                    disableUnderline: true,
                  }}
                ></TextField>
              </form>
            </div>
            {companies}
            <AddCompany url={this.props.url} updated={this.props.updated} error={this.props.error} />
          </>
        )}
        {this.state.showContracts && (
          <LoadHomeContract
            url={this.props.url}
            companyID={this.state.companyID}
            companyName={this.state.companyName}
          ></LoadHomeContract>
        )}
        {this.state.showUsers && (
          <LoadHomeUser
            url={this.props.url}
            companyID={this.state.companyID}
            companyName={this.state.companyName}
          ></LoadHomeUser>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(LoadHomeCompany);
