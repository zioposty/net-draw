import * as React from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import DeviceImageList from './imgComponent'
import BlockImageList from './imgBlock';

export default function ImgTabs(props) {
    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

 //   const handleClick = (image, name) => (event) => props.createNode(image, name)

    return (
        <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab label="Devices" value="1" />
                        <Tab label="Blocks" value="2" />
                    </TabList>
                </Box>
                <TabPanel value="1"><DeviceImageList createNode = {props.createNode}/></TabPanel>
                <TabPanel value="2"><BlockImageList createBlock = {props.createBlock}/></TabPanel>
            </TabContext>
        </Box>
    );
}

