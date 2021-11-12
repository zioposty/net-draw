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


class NodeMenu extends React.Component {
    constructor(props) {
        super(props)
        this.state = { value: props.node };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }


    createNeighborhoodList = () => {
        let neighborhood = this.props.links.filter(n => n.source === this.props.node || n.target === this.props.node);

        let nodes = []
        neighborhood.forEach(link => {
            let { source, target } = link;

            let nodeId = source !== this.props.node ? source : target;
            let node = this.props.nodes.find(n => n.id === nodeId);

            nodes.push(
                <ListItem key={"listitem-" + nodeId} onDoubleClick={() => { console.log(nodeId); this.props.clickNeighbor(nodeId) }}>
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

class LinkMenu extends React.Component {
    constructor(props) {
        super(props)

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
                    secondary={nodeSource.device}
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
                    secondary={nodeTarget.device}
                />
            </ListItem>)
        return nodes;

    }

    render() {
        return (
            <div>
                <h1> Link </h1>

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

                        <Button variant='outlined' onClick={(event) => {event.preventDefault(); this.props.applyColor(this.props.color, this.props.link)}} > Confirm </Button>


                    </Stack>
                </div>
                <Button style={{ marginTop: "5%" }} onClick={this.props.removeLink} variant='outlined'>Remove Link</Button>
            </div>
        );
    }
}

export { NodeMenu, LinkMenu };