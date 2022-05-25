import './App.css';
import { Graph } from "react-d3-graph";


// caricamento Nodi da csv
import data from "./utils/network.json";
import React from 'react';

import { PC, PC_ICON, FAKE_ICON } from './utils/constants';
import { NodeMenu, LinkMenu, BlockMenu, EditLinkMenu, AllNodesList } from './menu';

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';

import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// General configuration of nodes
import config from "./utils/network-config";
import { NodeContextMenu, LinkContextMenu } from './context';
import NodePopover from './popover'

import ImgTabs from './imageTab/imageTab';
import ResizableSquare from './resizeSquare';
import { Legend, Tips } from './utils/legend';
import { Stack } from '@mui/material';


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
			temp_stroke: config.link.strokeWidth,
			resize: false,
			toResize: null,
			bidirected: false,
			popover: false,
			blocks: [],
		};

		this.removeNode = this.removeNode.bind(this);
		this.createNode = this.createNode.bind(this);
	}


	deleteFakes = () => {
		let links = this.state.links
		//delete fake nodes
		let idx = this.state.nodes.findIndex(n => n.isFake);
		while (idx > -1) {
			this.state.nodes.splice(idx, 1);
			idx = this.state.nodes.findIndex(n => n.isFake);
		}

		//delete fake links
		idx = links.findIndex(l => l.isFake);
		while (idx > -1) {
			links.splice(idx, 1);
			idx = links.findIndex(l => l.isFake);
		}


		document.getElementById("save").disabled = false;
		document.getElementById("load").disabled = false;

		this.showBlocks()
		this.setState({
			new_link: null,
			links: this.state.links,
			breakPoints: [],
			blocks: [],
		})
	}

	hideBlocks = () => {

		let blocks = [];
		let nodes = this.state.nodes;

		for (let i = 0; i < nodes.length; i++) {
			let n = nodes[i];
			if (n.isBlock) {
				blocks.push(nodes.splice(i, 1)[0])
				i--;
			}
		}
		console.log(nodes)
		this.setState(
			{
				blocks: blocks
			}
		)


	}

	showBlocks = () => {
		let blocks = this.state.blocks;
		let nodes = this.state.nodes;

		blocks.forEach(
			b => {
				nodes.unshift(b);
			}
		)
	}

	createMarkerLink = (link , links) => {
		let source = link.source;
		let target = link.target;

		let s = this.state.nodes.find(n => n.id === source);
		let height, width;

		height = s.size.height / 10;
		width = s.size.width / 10;
		let lName = target + "," + source;
		let marker = document.getElementById("marker-small").cloneNode(true);
		marker.id = "marker-" + lName

		let l = document.getElementById(marker.id);
		if (l !== undefined && l !== null) {
			l.remove();
		}

		marker.setAttribute("refX", Math.max(Math.sqrt( ((height * height) / 4 + (width * width) / 4) / link.strokeWidth ) + 5/link.strokeWidth))  //stroke Weight
		document.getElementsByTagName("defs")[0].appendChild(marker);


		let t = this.state.nodes.find(n => n.id === target);
		height = t.size.height / 10;
		width = t.size.width / 10;
		lName = source + "," + target;
		marker = document.getElementById("marker-small").cloneNode(true);
		marker.id = "marker-" + lName
		marker.setAttribute("refX", Math.max( Math.sqrt(((height * height) / 4 + (width * width) / 4) / link.strokeWidth) + 5/link.strokeWidth ))  //stroke Weight
		document.getElementsByTagName("defs")[0].appendChild(marker);


		if (this.state.bidirected) {
			let bp = [...link.breakPoints]

			let otherLink = {
				source: target, target: source,
				isReverseEdge: true,
				strokeDasharray: link.strokeDasharray,
				strokeWidth: link.strokeWidth,
				color: "#FFFFFF",
				breakPoints: bp.reverse(),
				directed: true,
			}

			links.unshift(otherLink)

		}

	}

	onDoubleClickNode(node) {   // to create links	

		let n = this.state.nodes.find(n => n.id === node);

		if (n.isFake || n.isBlock) return

		data.focusedNodeId = null;
		if (this.state.new_link === null) {
			this.setState({
				new_link: {
					source: node,
					target: null,
				},
				bidirected: false,
				menu: true,
				selected: 3

			})

			this.hideBlocks();
		}
		else {
			let link = null;
			let links = this.state.links;
			let source = this.state.new_link.source;
			let target = (this.state.new_link.target === null) ? node : this.state.new_link.target;

			if (source !== target) {
				let valid = true;
				for (let i = 0; i < this.state.links.length; i++) {
					if ((links[i].source === source && links[i].target === target)
						|| (this.state.links[i].source === target && this.state.links[i].target === source)) {
						valid = false;
						break;
					}

				}

				if (valid) {
					let color = this.state.new_link.color
					let directed = this.state.new_link.directed
					let wireless = this.state.new_link.strokeDasharray
					let stroke = this.state.new_link.strokeWidth

					link = {
						source: source, target: target,
						color: (color === undefined) ? config.link.color : color,
						breakPoints: this.state.breakPoints,
						directed: directed === undefined ? false : directed,
						strokeDasharray: wireless === undefined ? 0 : wireless,
						strokeWidth: stroke === undefined ? config.link.strokeWidth : stroke
					}

					links.push(link);
					this.createMarkerLink(link, this.state.links);

					this.setState({
						menu: true,
						selected: 2,
						link_selected: link,
						links: links
					})
					this.forceUpdate();
				} else this.setState({ menu: false })
			} else this.setState({ menu: false })

			this.deleteFakes();
		};
	}

	onClickNode = (nodeId) => {
		let node = this.state.nodes.find(n => n.id === nodeId);

		if (this.state.breakPoints.length === 0) {
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

	loadNetwork = (event) => {

		this.state.links.forEach(link => {
			let lName = "marker-" + link.source + "," + link.target
			let l = document.getElementById(lName);
			if (l !== undefined && l !== null) {
				console.log(lName + " removed")
				l.remove();
			}
	
		})

		new Response(event.target.files[0]).json().then(json => {

			data.nodes = json.nodes
			data.links = json.links
			this.setState({
				nodes: json.nodes,
				links: json.links,
				new_link: null,
				breakPoints: [],
				target: null,
				menu: false,
				contextMenu: null,
				selected: 0,
				node_selected: null,
				link_selected: null,
				temp_link_color: config.link.color,
				temp_stroke: config.link.strokeWidth,
				resize: false,
				bidirected: false,
				popover: false,
			})

			for (let i = 0; i < this.state.links.length; i++) {
				if ( this.state.links[i].isReverseEdge) continue;
				this.createMarkerLink(this.state.links[i], this.state.links);
			}

		});


		this.forceUpdate()
	

	}

	removeNode = (nodeId) => {
		let idx = this.state.nodes.findIndex(n => n.id === nodeId);
		let node = this.state.nodes[idx];
		if (!node.isFake && this.state.breakPoints.length > 0) {
			window.alert("Editing a link, can't remove Nodes")
			return;
		}

		if (node.isFake) {
			//remove node

			let fakeIdx = this.state.breakPoints.findIndex(n => n.id === nodeId);
			this.state.breakPoints.splice(fakeIdx, 1);
			this.state.nodes.splice(idx, 1);

			//remove links
			let links = this.state.links

			let tIdx = links.findIndex(l => l.target === nodeId)
			let tLink = links.splice(tIdx, 1);
			let sIdx = links.findIndex(l => l.source === nodeId)

			console.log(tIdx + " " + sIdx)
			if (sIdx !== -1) {
				let sLink = links.splice(sIdx, 1);
				//let t = this.state.nodes.find(n => n.id == sLink[0].target);

				let link = {
					source: tLink[0].source,
					target: sLink[0].target,
					isFake: true
				}

				console.log(link)
				links.push(link)
			}

			this.setState({
				breakPoints: this.state.breakPoints,
				nodes: this.state.nodes,
				links: links
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
								for (let i = 0; i < this.state.nodes.length; i++) {
									if (this.state.nodes[i].id === nodeId) {
										this.state.nodes.splice(i, 1)
										break;
									}
								}

								for (let i = 0; i < this.state.links.length; i++) {
									let link = this.state.links[i];
									if (link.source === nodeId || link.target === nodeId) {

										let lName = "marker-" + link.source + "," + link.target
										let l = document.getElementById(lName);
										if (l !== undefined && l !== null) { l.remove(); }
										lName = "marker-" + link.target + "," + link.source
										l = document.getElementById(lName);
										if (l !== undefined && l !== null) { l.remove(); }

										this.state.links.splice(i, 1);
										i--;
									}
								}

								// let m = document.getElementById("marker-" + nodeId);
								// if (m !== undefined && m !== null) { m.remove(); }

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

		let idx = links.findIndex(l => l.source === source && l.target === target)

		let link = links[idx];

		let lName = "marker-" + link.source + "," + link.target
		let l = document.getElementById(lName);
		if (l !== undefined && l !== null) {
			l.remove();
		}

		let removed = links.splice(idx, 1);
		console.log(removed)
		let bidirected = false;

		if (removed[0].directed) {
			let idx = links.findIndex(l => l.source === target && l.target === source)
			if (idx !== -1) {
				links.splice(idx, 1); bidirected = true;
			}
		}

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


		if (!nodes[idx].isBlock) {
			let idxPos = nodes.findIndex(n => n.x === fx && n.y === fy && !n.isBlock)

			fx = (idxPos === -1) ? fx : nodes[idx].x
			fy = (idxPos === -1) ? fy : nodes[idx].y
		}
		nodes[idx].fx = fx;
		nodes[idx].fy = fy;
		nodes[idx].x = fx;
		nodes[idx].y = fy;


		if (nodes[idx].isFake) {
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

		value = value.replace(/\s/g, '');
		const idx = this.state.nodes.findIndex(node => node.id === value)
		console.log(idx);
		if (idx === -1) {

			const idx = this.state.nodes.findIndex(node => node.id === old_val);
			if (idx === -1) {
				window.alert("Rename Error val: " + value + " \n oldval: " + old_val);
				return;
			}


			let node = this.state.nodes[idx];
			node.id = value
			if (!node.isBlock) {
				this.state.links.forEach(link => {
					if (link.source === old_val) { link.source = value; }
					else if (link.target === old_val) {
						link.target = value;
						let lName = "marker-" + link.source + "," + old_val;
						let l = document.getElementById(lName);
						lName = "marker-" + link.source + "," + value;
						l.id = lName;
					}
				}
				)

				// let marker = document.getElementById("marker-" + old_val);
				// marker.id = "marker-" + value
			}

			this.setState({
				nodes: this.state.nodes,
				node_selected: value
			});

			this.forceUpdate(() => this.resize(node))

		}
		else {
			window.alert("Name " + value + " already used");
		}
	}

	createFakeNode = (canvas_x, canvas_y) => {

		if (this.state.isGridModeOn) {
			canvas_x = Math.round(canvas_x / 20) * 20 //+ 7.5 // size = 50 / 2 * 10, 10 because size 10 means 1 pixel
			canvas_y = Math.round(canvas_y / 20) * 20 //+ 7.5
		}

		let check = this.state.breakPoints.findIndex(n => n.fx === canvas_x && n.fy === canvas_y);
		if (check !== -1) { console.log("No breakpoint on same position"); return };

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

		let lastIdx = this.state.breakPoints.length - 1;
		if (lastIdx === 0)
			this.state.links.push(
				{
					source: this.state.new_link.source,
					target: this.state.breakPoints[0].id,
					isFake: true
				}
			)

		else {

			let linkIdx = this.state.links.findIndex(l => l.source === this.state.breakPoints[lastIdx - 1].id)
			if (linkIdx !== -1) this.state.links.splice(linkIdx, 1);
			this.state.links.push(
				{
					source: this.state.breakPoints[lastIdx - 1].id,
					target: this.state.breakPoints[lastIdx].id,
					isFake: true
				}
			)
		}
		console.log("BREAKPOINTS")
		console.log(this.state.nodes)
		this.setState({ breakPoints: this.state.breakPoints });
	}

	breakpointHandler = (evt) => {
		
		document.getElementById("save").disabled = true;
		document.getElementById("load").disabled = true;
		
		
		//calcute coordinate on svg
		var { canvas_x, canvas_y } = this.calculatePosition(evt);

		this.createFakeNode(canvas_x, canvas_y)

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

		/* const idx_rev = links.findIndex(l => l.source === link.target && l.target === link.source)
		if (idx_rev != -1) {
			links[idx_rev].color = color;
		} */


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
		let breakPoints = this.state.breakPoints


		let { source, target } = link;
		
		this.setState({
			new_link: links.find(l => l.source === source && l.target === target),
		})


		this.setState({ 
			bidirected: this.removeLink(link),
		})


		console.log(source + " " + target);
		console.log(link);

		document.getElementById("save").disabled = true;
		document.getElementById("load").disabled = true;

		if (link.breakPoints.length === 0) {

			return;
		}


		let count = 0;

		link.breakPoints.forEach(fakeNode => {
			this.state.nodes.push({
				id: count,
				fx: fakeNode.x, fy: fakeNode.y,
				x: fakeNode.x, y: fakeNode.y,
				isFake: true, svg: FAKE_ICON, isBlock: false,
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
			console.log(count)
		});

		console.log("HELLO THERE")
		console.log(this.state)
		let i = 0;

		links.push(
			{
				source: link.source,
				target: i,
				isFake: true,
			}
		);

		for (i = 1; i < breakPoints.length; i++) {
			links.push(
				{
					source: i - 1,
					target: i,
					isFake: true,
				}
			);
		}

		links.push(
			{
				source: i - 1,
				target: link.target,
				isFake: true,
			}
		);


	}


	createNode(deviceImg, device) {
		let nodes = this.state.nodes

		let x = 20, y = 20;

		/* if( this.state.isGridModeOn ){
			x = Math.round(x/25)*25 - config.node.size/20
			y = Math.round(y/25)*25 - config.node.size/20
		} */

		console.log(config.node)
		let id = device + Math.floor(Math.random() * 10000)
		nodes.push({
			id: id,
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

		// let height, width;
		// height = width = 20;
		// let marker = document.getElementById("marker-small").cloneNode(true);
		// marker.id = "marker-" + id
		// marker.setAttribute("refX", Math.max(16, Math.sqrt((height * height) / 4 + (width * width) / 4) + 4))

		// document.getElementsByTagName("defs")[0].appendChild(marker);

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

		let links = this.state.links

		links.forEach(
			l => {
				if (l.isFake) return;
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

		let idx = this.state.links.findIndex(l => l.source === source && l.target === target)

		let links = this.state.links;
		console.log(directed)
		switch (directed) {
			case "0":
			case "1": {
				let idxToRemove = links.findIndex(l => l.source === target && l.target === source)
				if (idxToRemove !== -1) {
					console.log(links.splice(idxToRemove, 1));
					console.log(link)
				}

				break;
			}

			case "2": {
				console.log("Created other edge")
				var bp = [...link.breakPoints];
				let l = links[idx];

				let new_link = {
					source: target, target: source, directed: true,
					color: "#FFFFFF",
					breakPoints: bp.reverse(), isReverseEdge: true,
					strokeDasharray: l.strokeDasharray,
					strokeWidth: l.strokeWidth
				}

				links.unshift(new_link)
				break;	
			}
			default: {
				console.log("Unexpected value");
				break;
			}
		}

		link.directed = (directed != 0);
		this.setState({ links: links })


	}

	updateConnection = (value, link) => {
		let links = this.state.links;

		let idx = links.findIndex(l => l.source === link.source && l.target === link.target);
		if (idx !== -1) {
			let link = links[idx];
			link.strokeDasharray = (value) ? 3 : 0
			this.setState({ links: links });
		}
	}

	updateStroke = (value, link) => {
		let links = this.state.links;

		value = (value <= 0) ? 1 : value;
		value = (value > 5) ? 5 : value;


		let idx = links.findIndex(l => l.source === link.source && l.target === link.target);
		if (idx !== -1) {
			let link = links[idx];
			link.strokeWidth = value

			let { source, target } = link

			let children = document.getElementById(source).childNodes;
			if (children.length === 0) return;
			let height = children[0].getAttribute("height");
			let width = children[0].getAttribute("width");
			let lName = "marker-" + target + "," + source
			let marker = document.getElementById(lName);
			marker.setAttribute("refX", Math.max(16, Math.sqrt(((height * height) / 4 + (width * width) / 4) / link.strokeWidth)+ 5/link.strokeWidth  ))
			
			
			children = document.getElementById(target).childNodes;
			if (children.length === 0) return;
			height = children[0].getAttribute("height");
			width = children[0].getAttribute("width");
			lName = "marker-" + source + "," + target
			marker = document.getElementById(lName);
			marker.setAttribute("refX", Math.max(16, Math.sqrt(((height * height) / 4 + (width * width) / 4) / link.strokeWidth)+ 5/link.strokeWidth))
	

			if (link.directed) {
				let rIdx = links.findIndex(l => l.source === link.target && l.target === link.source);
				if (rIdx !== -1) {
					let reverse = links[rIdx]
					reverse.strokeWidth = value;
				}
			}

			this.setState({ links: links, temp_stroke: value });
			console.log(links);

		}
	}

	resize = (node) => {
		let children = document.getElementById(node.id).childNodes;
		if (children.length === 0) return;
		let height = children[0].getAttribute("height");
		let width = children[0].getAttribute("width");
		let label = children[1];
		let pos = (node.isBlock) ? -1 : 1;
		label.setAttribute("dy", pos * height / 2);

		console.log(`width: ${width}, height ${height}`);
		if (!node.isBlock) {
			// let marker = document.getElementById("marker-" + node.id);
			// marker.setAttribute("refX", Math.max(16, Math.sqrt((height * height) / 4 + (width * width) / 4)))

			this.state.links.forEach(
				link => {
					if (link.target === node.id) {
						let lName = "marker-" + link.source + "," + link.target
						let l = document.getElementById(lName);
						l.setAttribute("refX", Math.max(16, Math.sqrt(((height * height) / 4 + (width * width) / 4) / link.strokeWidth)+ 5/link.strokeWidth)) //  /link.strokeWidth
					}
				}
			)

		}

		this.setState({ resize: false })
		console.log("this.state.links")
		config.freezeAllDragEvents = false;
		this.forceUpdate();
	}

	componentDidMount() {
		let marker = document.getElementById("marker-small").cloneNode(true);

		this.state.links.forEach(
			link => {
				let lName = link.source + "," + link.target;
				marker.id = "marker-" + lName;
				document.getElementsByTagName("defs")[0].appendChild(marker)
				if (link.directed !== null) {
					let l = document.getElementById(lName);
					link.directed ? l.setAttribute("marker-end", `url(#marker-${lName})`) :
						l.setAttribute("marker-end", "null")
				}
			}
		)


	}

	componentDidUpdate() {

		this.state.links.forEach(
			link => {
				if (link.directed !== null) {
					let lName = link.source + "," + link.target
					let l = document.getElementById(lName);
					link.directed ? l.setAttribute("marker-end", `url(#marker-${lName})`) :
					l.setAttribute("marker-end", "null")
				}
			}
		)
	}


	render() {

		const { menu, selected } = this.state;
		if (this.state.nodes.length === 0) {
			this.state.nodes.push({
				id: "PC" + Math.floor(Math.random() * 10000),
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

		let menuBody = <div></div>;
		if (menu) {
			switch (selected) {
				case 0: {
					menuBody = <div style={{ float: "right", width: "20%" }}>
						<NodeMenu
							node={this.state.node_selected}
							removeNode={() => this.removeNode(this.state.node_selected)}
							updateNodeName={(old_value, value) => {
								this.updateNodeName(old_value, value)
							}}
							closeMenu={() => this.setState({ menu: false })}
							links={this.state.links}
							nodes={this.state.nodes}
							clickNeighbor={this.onClickNode}
						/>
					</div>;
					break;
				}
				case 1: {
					menuBody = <div style={{ float: "right", width: "20%" }}>
						<BlockMenu
							updateNodeName={this.updateNodeName}
							removeNode={() => this.removeNode(this.state.node_selected)}
							block={this.state.nodes.find(n => n.id === this.state.node_selected)}
							size={this.state.nodes.find(n => n.id === this.state.node_selected).size}
							updateBlockSize={(size) => {
								console.log(size);
								console.log(this.state)
								this.setState({
									nodes: this.state.nodes.map(n => {
										if (n.id === this.state.node_selected) {
											n.size = size;
										}
										return n;
									}),
								})
							}}
							closeMenu={() => this.setState({ menu: false })}

						/>
					</div>
					break;
				}
				case 2: {
					let directed = 0;
					let link = this.state.link_selected;
					let links = this.state.links;


					if (link.directed) {
						let idx = links.findIndex(l => l.source === link.target && l.target === link.source)
						directed = (idx === -1) ? 1 : 2
					}
					menuBody = <div style={{ float: "right", width: "20%" }}>
						<LinkMenu
							link={this.state.link_selected}
							directed={directed}
							color={this.state.temp_link_color}
							updateConnection={(value, link) => this.updateConnection(value, link)}
							stroke={this.state.temp_stroke}
							updateStroke={(newStroke, link) => this.updateStroke(newStroke, link)}
							onChangeColor={this.onChangeColor}
							onChangeDirected={this.onChangeDirected}
							applyColor={this.applyColorLink}
							removeLink={() => this.removeLink(this.state.link_selected)}
							links={this.state.links}
							nodes={this.state.nodes}
							clickNeighbor={this.onClickNode}
							closeMenu={() => this.setState({ menu: false })}

						/>
					</div>
					break;
				}
				case 3: {
					menuBody = <div style={{ float: "right", width: "20%" }}>
						<EditLinkMenu
							exitMode={() => {
								this.deleteFakes()
								this.setState(
									{ menu: false }
								)
							}}
						/>
					</div>
					break;
				}

				default: {
					console.log("Unexpected menu value");
					break;
				}
			}
		}
		else {
			menuBody = <div style={{ float: "right", width: "20%" }}>
				<AllNodesList
					nodes={this.state.nodes}
					clickNode={(nodeId) => { this.onClickNode(nodeId) }}
				/>
			</div>
		}

		let square = <> </>;
		const { resize } = this.state

		if (resize) {
			let node = this.state.nodes.find(n => n.id === this.state.toResize);
			square = <ResizableSquare
				node={node}
				zoom={(this.state.zoom !== null) ? this.state.zoom : 1}
				resizeNode={(size) => {
					let nodes = this.state.nodes
					let idx = nodes.findIndex(n => n.id === this.state.toResize);
					nodes[idx].size = size;
					this.setState({ nodes: nodes })
				}}
				endResize={() => this.resize(node)}
			/>
		}
		else square = <> </>

		return (
			<div>
				{menuBody}
				<div style={{ float: "left", width: "20%" }}>
					<Button variant="outlined" id="save" onClick={this.saveNetwork}>Save Network </Button>
					<Button variant="outlined" id="load" component="label"> Load Network <input
						type="file"
						hidden
						accept=".json"
						onChange={(evt) =>
							this.loadNetwork(evt)
						}
						onClick={(event) => {
							event.target.value = null
						}}
					/> </Button>
					<Stack direction={'row'}><Legend /><Tips /></Stack>
					<FormControlLabel id='grid-mod' control={<Switch onChange={(_event, checked) => {
						this.setState({ isGridModeOn: checked })
						if (checked)
							this.discretization();
					}} />}
						label="Grid Mode" />
					<ImgTabs
						createNode={this.createNode}
						createBlock={this.createBlock} />


					<div>

					</div>
				</div>
				<div id="graph-struct" style={{ border: '5px solid #0048ba', height: "80%", width: "55%", overflow: "hidden", display: 'inline-block' }} onContextMenu={(ev) => { ev.preventDefault() }
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

						onClickNode={(id) => {
							this.onClickNode(id)
							toast("MouseClick triggered: " + id, { pauseOnHover: false, closeOnClick: true, autoClose: 2000 })
						}}
						onClickLink={(source, target) => {
							toast("ClickLink triggered: (" + source + ", " + target + ")", { pauseOnHover: false, closeOnClick: true, autoClose: 2000 })

							if (this.state.breakPoints.length === 0) {
								let link = this.state.links.find(l => l.source === source && l.target === target);

								if (link.isReverseEdge)  link = this.state.links.find(l => l.source === target && l.target === source);

								this.setState({
									menu: true, selected: 2,
									link_selected: link,
									temp_link_color: link.color,
									temp_stroke: link.strokeWidth,
								})
							}
						}
						}
						onDoubleClickNode={node => {
							toast("DoubleClickNode triggered: " + node, { pauseOnHover: false, closeOnClick: true, autoClose: 2000 })
							this.onDoubleClickNode(node);

						}}
						onMouseOverNode={(id) => {
							// toast("MouseOver triggered " + id, { pauseOnHover: false, closeOnClick: true, autoClose: 2000})
							let over = this.state.nodes.find(n => n.id === id)
							if (over === undefined) return
							this.setState({ target: over, popover: true })
						}}
						onMouseOutNode={(_id) => { if (this.state.popover) this.setState({ popover: false }) }}
						onNodePositionChange={(nodeId, fx, fy) => this.onNodePositionChange(nodeId, fx, fy)}
						onClickGraph={evt => { 
							if (this.state.new_link === null) {
								this.setState({ breakPoints: [] });
								this.setState({ menu: false, selected: 0 });
							} else { this.breakpointHandler(evt) }
							}
						}
						onRightClickNode={(evt, nodeID, _node) => {
							toast("RightClickNode triggered " + nodeID, { pauseOnHover: false, closeOnClick: true, autoClose: 2000 })
							evt.preventDefault(); this.setState(this.state.contextMenu === null
								? {
									targetType: "Node",
									target: this.state.nodes.find(n => n.id === nodeID),
									contextMenu: {
										mouseX: evt.clientX - 3,
										mouseY: evt.clientY - 5,
									}
								}
								: { contextMenu: null });
							console.log(this.state);
						}}
						onRightClickLink={(evt, source, target) => {
							toast("RightClickLink triggered: (" + source + ", " + target + ")", { pauseOnHover: false, closeOnClick: true, autoClose: 2000 })
							evt.preventDefault();

							let t = this.state.links.find(l => l.source === source && l.target === target)
							if (t.isFake || t.isReverseEdge) return;

							this.setState(this.state.contextMenu === null
								? {
									targetType: "Link",
									target: t,
									contextMenu: {
										mouseX: evt.clientX - 3,
										mouseY: evt.clientY - 5,
									}
								}
								: { contextMenu: null })
						}}
						onZoomChange={(_oldZoom, newZoom) => { this.setState({ zoom: newZoom }) }}
					>
					</Graph>
					<ToastContainer />



					{square}

					{
						(this.state.popover) ?
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
						toResize={(id) => { this.setState({ toResize: id }) }}
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
						showBreakPoints={() => {
							this.showBreakPoints(this.state.target); this.setState({
								menu: true, selected: 3
							})
						}}
						contextClose={() => this.setState({ contextMenu: null })} />
				</div>
				<div>

				</div>
			</div>
		)
	}
}


export default GraphGen;
