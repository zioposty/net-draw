import './App.css';
import { Graph } from "react-d3-graph";

// caricamento Nodi da csv
import data from "./network.json";
import React from 'react';

import { ROUTER, PC, PC_ICON, ROUTER_ICON } from './constants';
import { NodeMenu, LinkMenu } from './menu';

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';

import Button from '@mui/material/Button';


// General configuration of nodes
import config from "./network-config";
import { NodeContextMenu, LinkContextMenu } from './context';



class GraphGen extends React.Component {
  constructor(props) {
    super(props);
    data.focusedNodeId = null;

    this.state = {
      nodes: data.nodes,
      links: data.links,
      new_link: null,
      breakPoints: [],
      menu: false,
      contextMenu: null,
      selected: 0,
      node_selected: null,
      link_selected: null,
      temp_link_color: config.link.color,
    };



    this.removeNode = this.removeNode.bind(this);
    this.createNode = this.createNode.bind(this);
  }

  onDoubleClickNode(node) {

    data.focusedNodeId = null;
    if (this.state.new_link === null) {
      this.setState({
        new_link: {
          source: node,
          target: null
        },
        menu: false

      })

    }
    else {
      let link = null;
      let links = this.state.links;
      let source = this.state.new_link.source;
      let target = (this.state.new_link.target === null) ? node : this.state.new_link.target;

      if (source !== target) {
        /*  let valid = true;
         for (let i = 0; i < this.state.links.length; i++) {
           if ((links[i].source == source && links[i].target == target)
             || (this.state.links[i].source == target && this.state.links[i].target == source)) {
             valid = false;
             break;
           }
        
          } */

        let color = null;
        let idx = links.findIndex(l => (l.source == source && l.target == target)
          || (l.source == target && l.target == source))

        if (idx >= 0) {
          color = links[idx].color;
          links.splice(idx, 1);
        }

        //this.state.new_link.target = node

        console.log(idx)
        link = {
          source: source, target: target,
          color: (color==null)?config.link.color: color,
          breakPoints: this.state.breakPoints
        }


        this.state.links.push(link);
      }
      //delete fake nodes
      let idx = this.state.nodes.findIndex(n => n.fake);
      while (idx > -1) {
        this.state.nodes.splice(idx, 1);
        idx = this.state.nodes.findIndex(n => n.fake);
      }

      console.log(links);
      document.getElementById("save").disabled = false;

      this.setState({
        new_link: null,
        links: this.state.links,
        breakPoints: []
      })


    };
  }

  onClickNode = (nodeId) => {
    console.log("Clicked on " + nodeId);

    if (this.state.breakPoints.length == 0) {
      data.focusedNodeId = nodeId;
      this.setState({ menu: true, selected: 0, node_selected: nodeId, new_source: null })
    }

  }

  createNode(deviceImg, device) {
    let nodes = this.state.nodes

    nodes.push({
      id: device + Math.floor(Math.random() * 10000),
      svg: deviceImg,
      device: device,
      x: 30, y: 30,
      highlightStrokeColor: "blue",
      fake: false,
    });

    this.setState({
      nodes: nodes,
    });

    console.log(this.state)

  }

  saveNetwork = () => {

    const fileData = JSON.stringify(data);
    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'network.json';
    link.href = url;
    link.click();
  };

  removeNode = (node) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='custom-ui'>
            <h1>Are you sure?</h1>
            <p>You want to delete node "{node}"?</p>
            <button onClick={onClose}>No</button>
            <button
              onClick={() => {
                for (var i = 0; i < this.state.nodes.length; i++) {
                  if (this.state.nodes[i].id === node) {
                    this.state.nodes.splice(i, 1)
                    break;
                  }
                }

                for (var i = 0; i < this.state.links.length; i++) {
                  if (this.state.links[i].source === node || this.state.links[i].target === node) {
                    this.state.links.splice(i, 1);
                    i--;
                  }
                }
                this.setState({
                  menu: false,
                  node_selected: null,
                }, () => {
                  console.log(this.state)

                }); onClose();
              }}
            >
              Yes, Delete it!
            </button>
          </div>
        );
      }
    });

  }

  removeLink = (link_selected) => {
    let { source, target } = link_selected;

    for (let i = 0; i < this.state.links.length; i++) {
      if (this.state.links[i].source == source && this.state.links[i].target == target) {
        this.state.links.splice(i, 1);
        break;
      }
    }

    this.setState({
      menu: false,
      selected: 0,
      link_selected: null
    });


  }

  onNodePositionChange = (nodeId, x, y) => {
    let nodes = this.state.nodes;

    const idx = nodes.findIndex(n => n.id == nodeId);
    nodes[idx].x = x;
    nodes[idx].y = y;

    console.log(nodes[idx]);
  }

  updateNodeName = (value, old_val) => {
    if (Number.isInteger(value)) return;
    console.log(this.state.nodes);

    const idx = this.state.nodes.findIndex(node => node.id === value)
    console.log(idx);
    if (idx == -1) {

      const idx = this.state.nodes.findIndex(node => node.id === old_val);
      this.state.nodes[idx].id = value;

      this.state.links.forEach(link => {
        if (link.source === old_val) { link.source = value; }
        else if (link.target === old_val) { link.target = value; }
      }
      )

      this.setState({
        node_selected: "",
        menu: false
      });

    }
    else {
      window.alert("Name " + value + " already used");
    }
  }

  breakpointHandler = (evt) => {
    //calcute coordinate on svg

    if (this.state.new_link == null) {
      this.state.breakPoints = []
      return;
    }

    document.getElementById("save").disabled = true;
    var { canvas_x, canvas_y } = this.calculatePosition(evt);

    this.state.nodes.push({
      id: this.state.breakPoints.length,
      x: canvas_x, y: canvas_y,
      fake: true, size: 50
    });
    this.state.breakPoints.push({ x: canvas_x, y: canvas_y })

    this.setState({ breakPoints: this.state.breakPoints });
    console.log(this.state.breakPoints);

  }

  calculatePosition = (evt) => {
    var screen_x = evt.nativeEvent.layerX;
    var screen_y = evt.nativeEvent.layerY;
    var trans_x = 0
    var trans_y = 0
    var trans_scale = 1
    if (evt.target.childNodes[1].transform.baseVal.length > 0) {
      trans_x = evt.target.childNodes[1].transform.baseVal[0].matrix.e;
      trans_y = evt.target.childNodes[1].transform.baseVal[0].matrix.f;
      trans_scale = evt.target.childNodes[1].transform.baseVal[1].matrix.a;
    }
    var canvas_x = (screen_x - trans_x) / trans_scale;
    var canvas_y = (screen_y - trans_y) / trans_scale;
    return { canvas_x, canvas_y }
  }


  onChangeColor = (color) => {

    this.setState({
      temp_link_color: color
    })
  }

  applyColor = (color, link) => {


    const regex = new RegExp('/^#([0-9A-F]{3}){1,2}$/i');

    if (!regex.test(color)) {
      console.log(color)
      color = this.state.temp_link_color;
    }


    let links = this.state.links;
    const idx = links.findIndex(l => l.source === link.source && l.target === link.target)

    console.log(links)
    console.log(link)

    links[idx].color = color;

    this.setState({
      links: links,
    })

  }


  showBreakPoints = (link) => {
    console.log(link)
    let { source, target } = link;

    this.state.new_link = { source, target };

    this.removeLink(link);

    console.log(source + " " + target);

    let count = 0;
    link.breakPoints.forEach(fakeNode => {
      this.state.nodes.push({
        id: count,
        x: fakeNode.x, y: fakeNode.y,
        fake: true, size: 50
      });
      this.state.breakPoints.push({
        x: fakeNode.x, y: fakeNode.y,
      })
      count++
    }
    )
  }

  render() {

    const { menu, selected } = this.state;
    if (this.state.nodes.length == 0) {
      this.state.nodes.push({
        id: "Pc0",
        x: 30,
        y: 30,
        svg: PC_ICON,
        device: PC,
        fake: false
      })
    }

    let context = <div></div>;
    if (menu) {
      if (selected == 0) {
        context = <div>
          <NodeMenu
            node={this.state.node_selected}
            removeNode={() => this.removeNode(this.state.node_selected)}
            updateNodeName={this.updateNodeName}
            links={this.state.links}
            nodes={this.state.nodes}
            clickNeighbor={this.onClickNode}
          />
        </div>;
      }
      else {
        context = <div>
          <LinkMenu
            link={this.state.link_selected}
            color={this.state.temp_link_color}
            onChangeColor={this.onChangeColor}
            applyColor={this.applyColor}
            removeLink={() => this.removeLink(this.state.link_selected)}
            nodes={this.state.nodes}
            clickNeighbor={this.onClickNode}

          />
        </div>
      }
    }

    return (
      <div>
        <div style={{ float: "left", width: "30%" }}>
          <div>
            <Button variant="outlined" id="add_router" onClick={() => this.createNode(ROUTER_ICON, ROUTER)}> Add Router </Button>
            <Button variant="outlined" id="add_pc" onClick={() => this.createNode(PC_ICON, PC)}> Add PC </Button>
          </div>
          <Button variant="outlined" id="save" onClick={this.saveNetwork}>Save Network </Button>

          <>
            {context}
          </>
        </div>
        <div style={{ border: '5px solid #0048ba', height: 800, width: 800, overflow: "hidden" }} onContextMenu={(ev) => { ev.preventDefault() }}>
          <Graph
            id="graph-id" // id is mandatory
            data={data}

            config={config}
            onClickNode={(nodeId) => this.onClickNode(nodeId)}
            onClickLink={(source, target) => {
              if (this.state.breakPoints.length == 0) {
                let link = this.state.links.find(l => l.source === source && l.target === target);
                this.setState({
                  menu: true, selected: 1,
                  link_selected: link,
                  temp_link_color: link.color
                })
              }
            }
            }
            onDoubleClickNode={node => this.onDoubleClickNode(node)}
            onNodePositionChange={(nodeId, x, y) => this.onNodePositionChange(nodeId, x, y)}
            onClickGraph={evt => this.breakpointHandler(evt)}
            onRightClickNode={(evt, nodeID, node) => {
              evt.preventDefault(); this.setState(this.state.contextMenu === null
                ? {
                  targetType: "Node",
                  target: nodeID,
                  contextMenu: {
                    mouseX: evt.clientX - 3,
                    mouseY: evt.clientY - 5,
                  }
                }
                : { contextMenu: null });
              console.log(this.state);
            }}
            onRightClickLink={(evt, source, target) => {
              evt.preventDefault(); this.setState(this.state.contextMenu === null
                ? {
                  targetType: "Link",
                  target: this.state.links.find(l => l.source === source && l.target === target),
                  contextMenu: {
                    mouseX: evt.clientX - 3,
                    mouseY: evt.clientY - 5,
                  }
                }
                : { contextMenu: null })
            }
            }
          />

          <NodeContextMenu contextMenu={this.state.contextMenu}
            target={this.state.target}
            targetType={this.state.targetType}
            removeNode={() => { this.setState({ contextMenu: null }); this.removeNode(this.state.target) }}
            contextClose={() => this.setState({ contextMenu: null })} />

          <LinkContextMenu contextMenu={this.state.contextMenu}
            target={this.state.target}
            targetType={this.state.targetType}
            removeLink={() => { this.setState({ contextMenu: null }); this.removeLink(this.state.target) }}
            showBreakPoints={() => { this.showBreakPoints(this.state.target) }}
            contextClose={() => this.setState({ contextMenu: null })} />
        </div>
        <div>

        </div>
      </div>
    )
  }
}


export default GraphGen;
