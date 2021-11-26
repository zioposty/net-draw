import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';

class NodePopover extends React.Component {

    constructor(props) {
        super(props)
        console.log(props)
    }

    /*     const[anchorEl, setAnchorEl] = React.useState(null);
    
        const handlePopoverOpen = (event) => {
            setAnchorEl(event.currentTarget);
        };
    
        const handlePopoverClose = () => {
            setAnchorEl(null);
        }; */

    //const open = Boolean(anchorEl);

    render() {
        return (
            <div>
                {/* <Typography
                    aria-owns={open ? 'mouse-over-popover' : undefined}
                    aria-haspopup="true"
                    onMouseEnter={handlePopoverOpen}
                    onMouseLeave={handlePopoverClose}
                >
                    Hover with a Popover.
                </Typography> */}

                <Popover
                    id="mouse-over-popover"
                    sx={{
                        pointerEvents: 'none',
                    }}
                    open={this.props.visible}
                    anchorEl={document.getElementById(this.props.node.id)}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                      }}
                    onClose={this.props.onClose}
                    disableRestoreFocus
                >
                    <Typography sx={{ p: 1 }}> 
                    MouseOver: {this.props.node.id} 
                    </Typography>
                </Popover>
            </div >
        );
    }
}


export default NodePopover;