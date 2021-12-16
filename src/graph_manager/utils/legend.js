import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function Legend() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button variant='outlined' onClick={handleOpen}>Commands</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            How to use <b>Net-Draw</b>
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Draw your own network with this easy-to-use tool.
            Commands:
          </Typography>
          <ul>
                <li>
                    <b>Element Info:</b> click node/link to display a menu with info and properties that you can edit.
                </li>
                <li>
                    <b>Node Resize:</b> right-click a node to open a context menu. From this, select "Resize"
                    option to be able to manually resize the target.
                </li>
                <li>
                    <b>Create Link:</b> double click on a source node. Then you are able to draw
                    link segments. Double click on a target node to complete link creation.
                </li>
                <li>
                    <b>Grid Mode:</b> turning on this mode, node positions is discretized, both created and future ones. With this, your
                    graph accuracy is improved. 
                </li>
            </ul>
        </Box>
      </Modal>
    </div>
  );
}

function Tips() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button variant='outlined' onClick={handleOpen}>Tips</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Follow these tips for <b>Net-Draw</b> usage to get the best experience
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            This application allows to create, resize and rename nodes, customize links color and their shapes.
            It is built on top of <b>react-d3-graph</b>.
            Tips:
          </Typography>
          <ul>
                <li>
                    <b>Number of Nodes</b>: react-d3-graph needs at least one node, so if you remove last node the network will be reset.
                </li>
                <li>
                    <b>Canvas</b>: don't lost your node on canvas. Nodes are created in a fixed position. Focus mechanism need to be introduced. 
                </li>
                <li>
                    <b>Blocks management</b>: every object on this canvas is a node. For this reason, during link creation blocks are hidden to
                    avoid problems, because you can't select a breakpoint over a node.
                </li>
                <li>
                    <b>Node name limitations</b>: A node name (included blocks) needs to be unique, alpha-numeric and without spaces to provide some features.
                    There are input controls to avoid not allowed names.

                </li>
            </ul>
        </Box>
      </Modal>
    </div>
  );
}


export {Legend, Tips}