import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ColorPicker from 'material-ui-color-picker'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Checkbox from '@mui/material/Checkbox';
import { Stroller } from '@mui/icons-material';


class AllNodesList extends React.Component {
    constructor(props) {
        super(props)
        this.state = { value: props.node };
        this.handleChange = this.handleChange.bind(this);
        this.escFunction = this.escFunction.bind(this);
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    escFunction(event) {
        if (event.keyCode === 27) {
            this.props.closeMenu();
        }
    }
    componentDidMount() {
        document.addEventListener("keydown", this.escFunction, false);
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.escFunction, false);
    }

    createList = () => {
        let nodes = this.props.nodes;
        console.log(nodes)
        let allNodes = []
        nodes.forEach(node => {

            allNodes.push(
                <ListItem key={"listitem-" + node.id} onDoubleClick={() => { this.props.clickNode(node.id) }}
                    style={{ cursor: 'pointer' }}>
                    <ListItemAvatar>
                        <Avatar alt={node.id} src={node.svg} />
                    </ListItemAvatar>
                    <ListItemText
                        primary={node.id}
                        secondary={node.device}
                    />
                </ListItem>
            )

        });

        return allNodes;
    }

    render() {
        return (
            <div >
                <div style={{ marginTop: "5%", maxWidth: 370 }}>
                    <h2> Graph nodes </h2>
                    <List sx={{ bgcolor: '#f0f0f0', maxHeight: '300px', overflow: 'auto' }}>
                        {
                            this.createList()
                        }
                    </List>
                </div>
            </div>
        )
    }
}



class NodeMenu extends React.Component {
    constructor(props) {
        super(props)
        this.state = { value: props.node };
        this.handleChange = this.handleChange.bind(this);
        this.escFunction = this.escFunction.bind(this);
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    escFunction(event) {
        if (event.keyCode === 27) {
            this.props.closeMenu();
        }
    }
    componentDidMount() {
        document.addEventListener("keydown", this.escFunction, false);
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.escFunction, false);
    }

    createNeighborhoodList = () => {
        let neighborhood = this.props.links.filter(n => n.source === this.props.node || n.target === this.props.node);

        let nodes = []
        neighborhood.forEach(link => {
            let { source, target } = link;
            if (link.isReverseEdge) return;
            let nodeId = source !== this.props.node ? source : target;
            let node = this.props.nodes.find(n => n.id === nodeId);

            nodes.push(
                <ListItem key={"listitem-" + nodeId} onDoubleClick={() => { console.log(nodeId); this.props.clickNeighbor(nodeId) }}
                    style={{ cursor: 'pointer' }}>
                    <ListItemAvatar>
                        <Avatar alt={node.id} src={node.svg} />
                    </ListItemAvatar>
                    <ListItemText
                        primary={node.id}
                        secondary={node.device}
                    />
                </ListItem>
            )

        });

        return nodes;
    }

    render() {
        return (
            <div >
                <form onSubmit={(event) => { event.preventDefault(); console.log(this.state); this.props.updateNodeName(this.state.value, this.props.node) }}>
                    <h1>{this.props.node}</h1>
                    <Stack spacing={1} direction="row">
                        <TextField id="node-new-name" label="New Name" variant="outlined" onChange={this.handleChange} />
                        <Button type="submit" variant='outlined'> Rename Node</Button>
                    </Stack>

                </form>

                <Button onClick={this.props.removeNode} style={{ marginTop: 5 }} variant='outlined'> Remove Node</Button>

                <div style={{ marginTop: "5%", maxWidth: 370 }}>
                    <h2> Neighborhood </h2>
                    <List sx={{ bgcolor: '#f0f0f0' }}>
                        {
                            this.createNeighborhoodList()
                        }

                    </List>
                </div>

            </div>
        )
    }
}

class BlockMenu extends React.Component {
    constructor(props) {
        super(props)

        console.log(props);

        this.state = {
            value: props.block,
            size: { width: props.size.width, height: props.size.height }
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeH = this.handleChangeH.bind(this);
        this.handleChangeW = this.handleChangeW.bind(this);
        this.escFunction = this.escFunction.bind(this);
    }

    escFunction(event) {
        if (event.keyCode === 27) {
            this.props.closeMenu();
        }
    }
    componentDidMount() {
        document.addEventListener("keydown", this.escFunction, false);
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.escFunction, false);
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleChangeH(event) {
        let h = event.target.value;

        h = (Number.isInteger(Number.parseInt(h)) && h > 0) ? h : this.state.size.height

        this.setState({
            size: {
                height: h,
                width: this.state.size.width
            }
        });
    }

    handleChangeW(event) {
        let w = event.target.value;

        w = (Number.isInteger(Number.parseInt(w)) && w > 0) ? w : this.state.size.width

        this.setState({
            size: {
                width: w,
                height: this.state.size.height
            }
        });
    }

    componentDidUpdate() {

    }
    render() {
        return (
            <div>
                <form onSubmit={(event) => { event.preventDefault(); console.log(this.state); this.props.updateNodeName(this.state.value, this.props.block.id) }}>
                    <h1 onChange={() => { this.state.size = this.props.size; console.log(this.state) }}>{this.props.block.id}</h1>
                    <Stack spacing={1} direction="row">
                        <TextField id="block-new-name" label="New Name" variant="outlined" onChange={this.handleChange} />
                        <Button type="submit" variant='outlined'> Rename </Button>
                    </Stack>

                </form>

                <Button onClick={this.props.removeNode} style={{ marginTop: 5 }} variant='outlined'> Remove Node</Button>

                <div style={{ marginTop: "5%" }}>

                    <form onSubmit={(event) => { event.preventDefault(); console.log(this.state); this.props.updateBlockSize(this.state.size) }}>
                        <Stack spacing={1} direction="row">
                            <TextField type="number" value={this.state.size.height} id="block-new-height" label={"Height: " + this.props.size.height} variant="outlined" onChange={this.handleChangeH} />
                            <TextField type="number" value={this.state.size.width} id="block-new-width" label={"Width: " + this.props.size.width} variant="outlined" onChange={this.handleChangeW} />
                            <Button type="submit" variant='outlined'> Resize</Button>
                        </Stack>
                    </form>

                </div>
            </div>
        )
    }
}

class LinkMenu extends React.Component {
    constructor(props) {
        super(props)
        
        // this.state = {
        //     stroke: props.stroke
        // }

        this.escFunction = this.escFunction.bind(this);
        // this.handleChangeStroke = this.handleChangeStroke.bind(this);
    }

    showVertex = () => {
        let { source, target } = this.props.link;

        let nodes = []

        const nodeSource = this.props.nodes.find(n => n.id === source);
        const nodeTarget = this.props.nodes.find(n => n.id === target);



        nodes.push(
            <ListItem key={"listitem-" + source} onDoubleClick={() => { console.log(source); this.props.clickNeighbor(source) }}>
                <ListItemAvatar>
                    <Avatar alt={nodeSource.id} src={nodeSource.svg} />
                </ListItemAvatar>
                <ListItemText
                    primary={nodeSource.id}
                    secondary={this.props.link.directed ? "Source" : nodeSource.device}
                />
            </ListItem>
        )

        nodes.push(
            <ListItem key={"listitem-" + target} onDoubleClick={() => { console.log(target); this.props.clickNeighbor(target) }}>
                <ListItemAvatar>
                    <Avatar alt={nodeTarget.id} src={nodeTarget.svg} />
                </ListItemAvatar>
                <ListItemText
                    primary={nodeTarget.id}
                    secondary={this.props.link.directed ? "Target" : nodeTarget.device}
                />
            </ListItem>)
        return nodes;

    }


    /* handleChangeStroke(event){
        let stroke = event.target.value;

        stroke = (Number.isInteger(Number.parseInt(stroke)) && stroke > 0) ? stroke : this.state.stroke

        this.setState({
            stroke: stroke
        });
    } */

    handleChangeDirected = (event, value) => {
        this.props.onChangeDirected(value, this.props.link)
    }

    escFunction(event) {
        if (event.keyCode === 27) {
            this.props.closeMenu();
        }
    }
    componentDidMount() {
        document.addEventListener("keydown", this.escFunction, false);
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.escFunction, false);
    }


    render() {
        let link = this.props.link
        return (
            <div>
                <h1> Link </h1>
                <FormControl component="fieldset">
                    <FormLabel component="legend">Is directed</FormLabel>
                    <RadioGroup row aria-label="gender" name="row-radio-buttons-group"
                        value={this.props.directed}
                        onChange={this.handleChangeDirected}>
                        <FormControlLabel value="0" control={<Radio />} label="None" />
                        <FormControlLabel value="1" control={<Radio />} label="Yes" />
                        <FormControlLabel value="2" control={<Radio />} label="Both" />
                    </RadioGroup>
                </FormControl>

                <Stack spacing={1} direction={"row"}></Stack>
                <FormControlLabel id='grid-mod' control={

                    <Checkbox
                        onChange={(_event, checked) => {
                            this.props.updateConnection(checked, link);
                        }}
                        inputProps={{ 'aria-label': 'controlled' }}
                        checked={link.strokeDasharray !== 0}

                    />}
                    label="Wireless" />

                <Stack />
                <div style={{ marginTop: "5%", maxWidth: 370 }}>
                    <h2> Vertexes </h2>
                    <List sx={{ bgcolor: '#f0f0f0' }}>
                        {
                            this.showVertex()
                        }

                    </List>
                </div>

                <div style={{ marginTop: "5%" }}>
                    <Stack spacing={1} direction="row">
                        <Stack direction="column">
                            <ColorPicker
                                name='color'

                                value={this.props.color}
                                onChange={(color) => this.props.onChangeColor(color)}
                                TextFieldProps={{
                                    value: this.props.color,
                                    label: "Link Color",
                                    InputProps: {
                                        readOnly: true,
                                    }
                                }}
                            />
                        </Stack>
                        <Button variant='outlined' onClick={(event) => { event.preventDefault(); this.props.applyColor(this.props.color, this.props.link) }} > Confirm </Button>


                    </Stack>
                </div>
                <div style={{ marginTop: "5%" }}> 
                    {/* <form onSubmit={(event) => { event.preventDefault(); console.log(this.state); this.props.updateStroke(this.state.stroke) }}>
                        <Stack spacing={1} direction="row">
                            <Button type="submit" variant='outlined'>Resize</Button>
                        </Stack>
                    </form> */}
                    <TextField type="number" value={this.props.stroke} id="new-stroke" label={"Stroke Width"} variant="outlined" onChange={(event) => { this.props.updateStroke(event.target.value, this.props.link)}} />

                </div>
                <Button style={{ marginTop: "5%" }} onClick={this.props.removeLink} variant='outlined'>Remove Link</Button>
            </div>
        );
    }
}

class EditLinkMenu extends React.Component {

    constructor(props) {
        super(props)
        this.escFunction = this.escFunction.bind(this);
    }
    escFunction(event) {
        if (event.keyCode === 27) {
            this.props.exitMode();
        }
    }
    componentDidMount() {
        document.addEventListener("keydown", this.escFunction, false);
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.escFunction, false);
    }

    render() {
        return (
            <h1> Edit Link Mode </h1>

        )
    }

}

export { NodeMenu, LinkMenu, BlockMenu, EditLinkMenu, AllNodesList };