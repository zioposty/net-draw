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

export default function Legend() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button variant='outlined' onClick={handleOpen}>Help</Button>
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