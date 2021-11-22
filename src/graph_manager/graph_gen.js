import './App.css';
import { Graph } from "react-d3-graph";

// caricamento Nodi da csv
import data from "./network.json";
import React from 'react';

import { ROUTER, PC, PC_ICON, ROUTER_ICON, BLOCK, FAKE_ICON } from './constants';
import { NodeMenu, LinkMenu, BlockMenu } from './menu';

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';

import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';


// General configuration of nodes
import config from "./network-config";
import { NodeContextMenu, LinkContextMenu } from './context';
import NodePopover from './popover'

import ImgTabs from './imageTab/imageTab';
import ResizableSquare from './resizeSquare';



class GraphGen extends React.Component {
	constructor(props) {
		super(props);
		data.focusedNodeId = null;

		this.state = {
			isGridModeOn: false,
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
			resize: false,
			bidirected: false,
			popover: false,
		};



		this.removeNode = this.removeNode.bind(this);
		this.createNode = this.createNode.bind(this);
	}

	onDoubleClickNode(node) {

		let n = this.state.nodes.find(n => n.id == node);

		if (n.isFake || n.isBlock) return

		data.focusedNodeId = null;
		if (this.state.new_link === null) {
			this.setState({
				new_link: {
					source: node,
					target: null,
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

				let color = this.state.new_link.color;
				let directed = this.state.new_link.directed;

				link = {
					source: source, target: target,
					color: (color == null) ? config.link.color : color,
					breakPoints: this.state.breakPoints,
					directed: directed == null ? false : directed
				}
				links.push(link);
				if (this.state.bidirected) {

					let bp = [...link.breakPoints]

					let otherLink = {
						source: target, target: source,
						color: (color == null) ? config.link.color : color,
						breakPoints: bp.reverse(),
						directed: true
					}
					links.unshift(otherLink)
				}

			}

			//delete fake nodes
			let idx = this.state.nodes.findIndex(n => n.isFake);
			while (idx > -1) {
				this.state.nodes.splice(idx, 1);
				idx = this.state.nodes.findIndex(n => n.isFake);
			}

			console.log(links);
			document.getElementById("save").disabled = false;

			this.setState({
				new_link: null,
				links: this.state.links,
				breakPoints: []
			})

			//document.getElementById(source +","+ target).setAttribute("marker-end", "null");



		};
	}

	onClickNode = (nodeId) => {
		let node = this.state.nodes.find(n => n.id == nodeId);

		if (this.state.breakPoints.length == 0) {
			//data.focusedNodeId = nodeId;
			this.setState({ menu: true, selected: node.isBlock ? 1 : 0, node_selected: nodeId, new_source: null })
		}

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

	removeNode = (nodeId) => {
		let idx = this.state.nodes.findIndex(n => n.id == nodeId);
		let node = this.state.nodes[idx];
		if (!node.isFake && this.state.breakPoints.length > 0) {
			window.alert("Editing a link, can't remove Nodes")
			return;
		}

		if (node.isFake) {
			//remove node

			let fakeIdx = this.state.breakPoints.findIndex(n => n.id == nodeId);
			this.state.breakPoints.splice(fakeIdx, 1);
			this.state.nodes.splice(idx, 1);
			this.setState({
				breakPoints: this.state.breakPoints,
				nodes: this.state.nodes,
			})
			return;
		}

		confirmAlert({
			customUI: ({ onClose }) => {
				return (
					<div className='custom-ui'>
						<h1>Are you sure?</h1>
						<p>You want to delete node "{nodeId}"?</p>
						<button onClick={onClose}>No</button>
						<button
							onClick={() => {
								for (var i = 0; i < this.state.nodes.length; i++) {
									if (this.state.nodes[i].id === nodeId) {
										this.state.nodes.splice(i, 1)
										break;
									}
								}

								for (var i = 0; i < this.state.links.length; i++) {
									if (this.state.links[i].source === nodeId || this.state.links[i].target === nodeId) {
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
		let links = this.state.links

		let idx = links.findIndex(l => l.source == source && l.target == target)


		let removed = links.splice(idx, 1);
		console.log(removed)
		let bidirected = false;

		if (removed[0].directed) {
			let idx = links.findIndex(l => l.source == target && l.target == source)
			if (idx != -1) { links.splice(idx, 1); bidirected = true; }
		}

		/* for (let i = 0; i < this.state.links.length; i++) {
			if (this.state.links[i].source == source && this.state.links[i].target == target) {
				this.state.links.splice(i, 1);
				break;
			}
		} */

		this.setState({
			menu: false,
			selected: 0,
			link_selected: null
		});

		return bidirected
	}

	onNodePositionChange = (nodeId, fx, fy) => {
		let nodes = this.state.nodes;

		const idx = nodes.findIndex(n => n.id === nodeId);

		if (this.state.isGridModeOn) {
			fx = Math.round(fx / 20.0) * 20 //+ (10 - nodes[idx].size.height / 20); //10 - n.size.height/20)
			fy = Math.round(fy / 20.0) * 20 //+ (10 - nodes[idx].size.width / 20);
		}

		nodes[idx].fx = fx;
		nodes[idx].fy = fy;
		nodes[idx].x = fx;
		nodes[idx].y = fy;


		if (nodes[idx].isFake) {
			console.log("UPDATE FAKE POS")
			console.log(this.state.breakPoints);
			console.log(this.state.nodes);

			let fake = this.state.breakPoints.find(n => n.id === nodes[idx].id)
			//this.state.breakPoints[Number.parseInt(nodes[idx].id)];
			fake.x = fx;
			fake.y = fy;
			fake.fx = fx;
			fake.fy = fy
		}
		this.setState({ nodes: nodes });
	}

	updateNodeName = (value, old_val) => {

		if (!isNaN(Number(value))) {
			window.alert("Not a valid name");
			return;
		}
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
				nodes: this.state.nodes,
				node_selected: value
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

		if (this.state.isGridModeOn) {
			canvas_x = Math.round(canvas_x / 20) * 20 //+ 7.5 // size = 50 / 2 * 10, 10 because size 10 means 1 pixel
			canvas_y = Math.round(canvas_y / 20) * 20 //+ 7.5
		}

		let check = this.state.breakPoints.findIndex(n => n.fx == canvas_x && n.fy == canvas_y);
		if (check != -1) { console.log("No breakpoint on same position"); return };

		let newFakeId = 0;
		this.state.breakPoints.forEach(
			n => {
				if (n.id >= newFakeId)
					newFakeId = n.id + 1
			}
		)

		this.state.nodes.push({
			id: newFakeId,
			x: canvas_x, y: canvas_y,
			fx: canvas_x, fy: canvas_y,
			isFake: true, svg: FAKE_ICON, size: { height: 50, width: 50 },
		});

		this.state.breakPoints.push({
			id: newFakeId,
			x: canvas_x, y: canvas_y, fx: canvas_x, fy: canvas_y,
		})


		console.log("BREAKPOINTS")
		console.log(this.state.nodes)
		this.setState({ breakPoints: this.state.breakPoints });
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

	applyColorLink = (color, link) => {


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


	applyColorBlock = (color, block) => {

		const regex = new RegExp('/^#([0-9A-F]{3}){1,2}$/i');

		if (!regex.test(color)) {
			console.log(color)
			color = this.state.temp_link_color;
		}


		let nodes = this.state.nodes;
		const idx = nodes.findIndex(n => n.id === block && n.isBlock);


		nodes[idx].strokeColor = color;

		this.setState({
			nodes: nodes,
		})
	}

	showBreakPoints = (link) => {
		console.log(link)
		let links = this.state.links
		let { source, target } = link;

		let idx = links.findIndex(l => l.source == source && l.target == target)
		this.state.new_link = links[idx];

		this.state.bidirected = this.removeLink(link);

		console.log(source + " " + target);
		document.getElementById("save").disabled = true;

		let count = 0;

		link.breakPoints.forEach(fakeNode => {
			this.state.nodes.push({
				id: count,
				fx: fakeNode.x, fy: fakeNode.y,
				x: fakeNode.x, y: fakeNode.y,
				isFake: true, svg: FAKE_ICON,
				size: {
					height: 50,
					width: 50
				},
			});

			this.state.breakPoints.push({
				id: count,
				fx: fakeNode.x, fy: fakeNode.y,
				x: fakeNode.x, y: fakeNode.y,
			})
			count++
		});


	}


	createNode(deviceImg, device) {
		let nodes = this.state.nodes

		let x = 20, y = 20;

		/* if( this.state.isGridModeOn ){
			x = Math.round(x/25)*25 - config.node.size/20
			y = Math.round(y/25)*25 - config.node.size/20
		} */

		console.log(config.node)
		nodes.push({
			id: device + Math.floor(Math.random() * 10000),
			svg: deviceImg,
			device: device,
			fx: x, fy: y,
			highlightStrokeColor: "blue",
			isFake: false,
			isBlock: false,
			size: {
				height: 200,
				width: 200
			},
		});

		this.setState({
			nodes: nodes,
		});

		console.log(this.state)

	}

	createBlock = (blockType, blockImg) => {
		this.state.nodes.unshift({
			id: blockType + Math.floor(Math.random() * 10000),
			svg: blockImg,
			device: blockType,
			isBlock: true,
			isFake: false,
			fx: 20, fy: 20,
			renderLabel: true,
			size: { height: 500, width: 800 },
			labelPosition: "top",
			color: "#FFFFFF",
			strokeColor: "blue",
			opacity: 0.5
		})
		console.log(this.state.nodes)
		this.setState({
			nodes: this.state.nodes
		})
	}

	discretization = () => {
		let nodes = this.state.nodes

		nodes.forEach(
			n => {
				n.fx = Math.round(n.fx / 20.0) * 20 //- (10 - n.size.height / 20)
				n.fy = Math.round(n.fy / 20.0) * 20 //- (10 - n.size.height / 20)
				n.x = Math.round(n.x / 20.0) * 20
				n.y = Math.round(n.y / 20.0) * 20
			}
		)

		console.log(nodes)
		let links = this.state.links

		links.forEach(
			l => {
				l.breakPoints.forEach(
					n => {
						n.x = Math.round(n.x / 20.0) * 20
						n.y = Math.round(n.y / 20.0) * 20
						n.fx = Math.round(n.x / 20.0) * 20
						n.fy = Math.round(n.y / 20.0) * 20
					}
				)
			}
		)

		let fakes = this.state.breakPoints

		fakes.forEach(
			n => {
				n.fx = Math.round(n.fx / 20.0) * 20 //- (10 - n.size.height / 20)
				n.fy = Math.round(n.fy / 20.0) * 20 //- (10 - n.size.height / 20)
				n.x = Math.round(n.x / 20.0) * 20
				n.y = Math.round(n.y / 20.0) * 20
			}
		)

		this.setState({
			nodes: nodes,
			links: links,
			breakPoints: fakes,
			refactor: true,
		})

		console.log(this.state)
	}

	onChangeDirected = (directed, link) => {
		let { source, target } = link;

		let idx = this.state.links.findIndex(l => l.source == source && l.target == target)

		let links = this.state.links;
		console.log(directed)
		switch (directed) {
			case "0":
			case "1": {
				let idxToRemove = links.findIndex(l => l.source == target && l.target == source)
				if (idxToRemove != -1) {
					console.log(links.splice(idxToRemove, 1));
					console.log(link)
				}

				break;
			}

			case "2": {
				console.log("Created other edge")
				var bp = [...link.breakPoints];

				console.log(bp)

				let new_link = { source: target, target: source, directed: true, breakPoints: bp.reverse() }
				links.unshift(new_link)
			}
		}

		link.directed = (directed != 0);

		console.log(link)
		console.log(directed != 0)
		this.setState({ links: links })


	}

	componentDidMount() {

		this.state.links.forEach(
			link => {
				if (link.directed != null) {
					let l = document.getElementById(link.source + "," + link.target);
					link.directed ? l.setAttribute("marker-end", "url(#marker-small)") :
						l.setAttribute("marker-end", "null")
				}
			}
		)
	}

	componentDidUpdate() {

		this.state.links.forEach(
			link => {
				if (link.directed != null) {
					let l = document.getElementById(link.source + "," + link.target);
					link.directed ? l.setAttribute("marker-end", "url(#marker-small)") :
						l.setAttribute("marker-end", "null")
				}
			}
		)
	}


	render() {

		const { menu, selected } = this.state;
		if (this.state.nodes.length == 0) {
			this.state.nodes.push({
				id: "PC0",
				fx: 20,
				fy: 20,
				x: 20,
				y: 20,
				svg: PC_ICON,
				device: PC,
				fake: false,
				isBlock: false,
				size: { height: 200, width: 200 }
			})
		}

		let context = <div></div>;
		if (menu) {
			if (selected == 0) {
				context = <div style={{ float: "right", width: "20%" }}>
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
			else if (selected == 1) {
				context = <div style={{ float: "right", width: "20%" }}>
					<BlockMenu
						updateNodeName={this.updateNodeName}
						removeNode={() => this.removeNode(this.state.node_selected)}
						block={() => {
							let id = this.state.node_selected
							let n = this.state.nodes.find(n => n.id === id);
							console.log(id)
							return n
						}
						}
						size={this.state.nodes.find(n => n.id === this.state.node_selected).size}
						updateBlockSize={(size) => {
							console.log(size);
							console.log(this.state)
							let idx = this.state.nodes.findIndex(n => n.id == this.state.node_selected);
							this.state.nodes[idx].size = size;
							this.setState({ nodes: this.state.nodes })
						}
						}
					/>
				</div>
			}
			else {
				context = <div style={{ float: "right", width: "20%" }}>
					<LinkMenu
						link={this.state.link_selected}
						directed={this.state.links.find(l => l.source == this.state.link_selected.source && l.target == this.state.link_selected.target).directed}
						color={this.state.temp_link_color}
						onChangeColor={this.onChangeColor}
						onChangeDirected={this.onChangeDirected}
						applyColor={this.applyColorLink}
						removeLink={() => this.removeLink(this.state.link_selected)}
						nodes={this.state.nodes}
						clickNeighbor={this.onClickNode}

					/>
				</div>
			}
		}

		let square = <> </>;
		const { resize } = this.state

		if (resize) {
			let node = this.state.nodes.find(n => n.id === this.state.target.id);
			square = <ResizableSquare
				node={node}
				zoom={(this.state.zoom != null) ? this.state.zoom : 1}
				resizeNode={(size) => {
					let idx = this.state.nodes.findIndex(n => n.id == this.state.target.id);
					this.state.nodes[idx].size = size;
					this.setState({ nodes: this.state.nodes })
				}}
				endResize={() => {
					node.labelPosition = "right"
					this.setState({ resize: false })
					config.freezeAllDragEvents = false;
					this.forceUpdate();
				}}
			/>
		}
		else square = <> </>

		return (
			<div>
				{context}
				<div style={{ float: "left", width: "30%" }}>
					<Button variant="outlined" id="save" onClick={this.saveNetwork}>Save Network </Button>

					<FormControlLabel id='grid-mod' control={<Switch onChange={(_event, checked) => {
						this.state.isGridModeOn = checked;
						if (checked)
							this.discretization();
					}} />}
						label="Grid Mode" /><ImgTabs
						createNode={this.createNode}
						createBlock={this.createBlock} />


					<div>

					</div>
				</div>
				<div id="graph-struct" style={{ border: '5px solid #0048ba', height: 800, width: 800, overflow: "hidden", display: 'inline-block' }} onContextMenu={(ev) => { ev.preventDefault() }
				}
					onClick={(event) => {
						let square = document.getElementById("ResizableSquare")

						if (square !== null && !square.contains(event.target)) {
							config.freezeAllDragEvents = false;
							this.setState({ resize: false })
						}
					}}>

					<Graph
						id="graph-id" // id is mandatory
						data={data}
						config={config}

						onClickNode={(nodeId) => this.onClickNode(nodeId)}
						onClickLink={(source, target) => {
							if (this.state.breakPoints.length == 0) {
								let link = this.state.links.find(l => l.source === source && l.target === target);
								this.setState({
									menu: true, selected: 2,
									link_selected: link,
									temp_link_color: link.color
								})
							}
						}
						}
						onDoubleClickNode={node => this.onDoubleClickNode(node)}
						onMouseOverNode={(id) => {
							let over = this.state.nodes.find(n => n.id == id)
							this.setState({ target: over, popover: true })
						}}
						onMouseOutNode={(_id) => {if(this.state.popover) this.setState({popover: false})}}
						onNodePositionChange={(nodeId, fx, fy) => this.onNodePositionChange(nodeId, fx, fy)}
						onClickGraph={evt => { console.log("SIIIUM"); this.breakpointHandler(evt) }}
						onRightClickNode={(evt, nodeID, _node) => {
							evt.preventDefault(); this.setState(this.state.contextMenu === null
								? {
									targetType: "Node",
									target: this.state.nodes.find(n => n.id == nodeID),
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
						}}
						onZoomChange={(_oldZoom, newZoom) => { this.setState({ zoom: newZoom }) }}

					/>

					{square}

					{
						(this.state.popover)?
						<NodePopover
							node={this.state.target}
							visible={this.state.popover}
							onClose={() => this.setState({ popover: false })}
						/>
						: <></>
					}
					<NodeContextMenu contextMenu={this.state.contextMenu}
						target={this.state.target}
						targetType={this.state.targetType}
						removeNode={() => { this.setState({ contextMenu: null }); this.removeNode(this.state.target.id) }}
						contextClose={() => this.setState({ contextMenu: null })}
						drawSquare={() => {
							this.setState({ resize: true });
							config.freezeAllDragEvents = true;
							this.forceUpdate();

						}}

					/>

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
