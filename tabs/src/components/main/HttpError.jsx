import React from "react";
import ReloadIcon from "@mui/icons-material/ReplayCircleFilledOutlined";
import "../css/style.css";

class HttpError extends React.Component {
  render() {
    return (
      <div className="httpError">
        <h1 style={{fontSize: '27px'}}>OOPS! SOMETHING'S WRONG HERE :(</h1>
        <h4>
          Error: {this.props.code} - {this.props.text}
        </h4>
        {this.props.code === 400 && this.props.requestMaker && (
          <h4>
          {this.props.requestMaker}
        </h4>
        )}
        {this.props.reload && (
          <ReloadIcon
          style={{ width: "50px", height: "50px", color: " #193058",  cursor: "pointer" }}
          onClick={() => {
            this.props.reload(200, "");
          }}
        ></ReloadIcon>
        )}
        
      </div>
    );
  }
}

export default HttpError;
