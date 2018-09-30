import React, { Component } from "react";
import Popover from "@material-ui/core/Popover";
import MenuItem from "@material-ui/core/MenuItem";
import List from "@material-ui/core/List";
import Button from "@material-ui/core/Button";
import FCConnector from "../utilities/FCConnector";

export default class TelemetryView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };
  }
  get type() {
    return "gyro";
  }
  handleClick = event => {
    FCConnector.webSockets.addEventListener("message", message => {
      try {
        let telemetry = JSON.parse(message.data);
        if (telemetry.telemetry) {
          this.setState({ telemetry });
        }
      } catch (ex) {
        console.warn("unable to parse telemetry", ex);
      }
    });
    event.preventDefault();
    FCConnector.startTelemetry(this.type);
    this.setState({
      open: true,
      anchorEl: event.currentTarget
    });
  };

  handleClose = () => {
    FCConnector.stopTelemetry();
    this.setState({
      open: false
    });
  };
  render() {
    return (
      <div style={{ margin: "0 10px" }}>
        <Button onClick={this.handleClick} color="primary" variant="raised">
          Telemetry
        </Button>
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
          onClose={this.handleClose}
        >
          {this.state.telemetry && (
            <List>
              <MenuItem>{"Acc Roll: " + this.state.telemetry.acc.x}</MenuItem>
              <MenuItem>{"Acc Pitch: " + this.state.telemetry.acc.y}</MenuItem>
              <MenuItem>{"Acc Yaw: " + this.state.telemetry.acc.z}</MenuItem>
              <MenuItem>{"Gyro Roll: " + this.state.telemetry.gyro.x}</MenuItem>
              <MenuItem>
                {"Gyro Pitch: " + this.state.telemetry.gyro.y}
              </MenuItem>
              <MenuItem>{"Gyro Yaw: " + this.state.telemetry.gyro.z}</MenuItem>
            </List>
          )}
        </Popover>
      </div>
    );
  }
}
