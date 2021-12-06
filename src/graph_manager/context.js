import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';


class NodeContextMenu extends React.Component {
  //const [contextMenu, setContextMenu] = React.useState(null);
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Menu
        open={this.props.contextMenu !== null && this.props.targetType == "Node"}
        onClose={this.props.contextClose}
        anchorReference="anchorPosition"
        anchorPosition={
          this.props.contextMenu !== null
            ? { top: this.props.contextMenu.mouseY, left: this.props.contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={this.props.contextClose}> <b>{(this.props.contextMenu !== null) ? this.props.target.id : undefined}</b></MenuItem>
        <MenuItem onClick={this.props.removeNode}>Remove</MenuItem>
        <MenuItem onClick={() => {
          this.props.contextClose();
          this.props.toResize(this.props.target.id);
          this.props.drawSquare()
        }}>Resize</MenuItem>

      </Menu>

    )
  };
}


class LinkContextMenu extends React.Component {
  //const [contextMenu, setContextMenu] = React.useState(null);
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Menu
        open={this.props.contextMenu !== null && this.props.targetType == "Link"}
        onClose={this.props.contextClose}
        anchorReference="anchorPosition"
        anchorPosition={
          this.props.contextMenu !== null
            ? { top: this.props.contextMenu.mouseY, left: this.props.contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={this.props.contextClose}> <b>{this.props.contextMenu !== null ? this.props.target.source + "; " + this.props.target.target : ""} </b></MenuItem>
        <MenuItem onClick={this.props.removeLink}>Remove</MenuItem>
        <MenuItem onClick={() => { this.props.contextClose(); this.props.showBreakPoints() }}>Edit Structure</MenuItem>
      </Menu>

    )
  };
}


export { NodeContextMenu, LinkContextMenu };
