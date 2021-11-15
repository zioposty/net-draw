import * as React from 'react';

import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

import { ROUTER, PC, PC_ICON, ROUTER_ICON } from '../constants';

export default function DeviceImageList(props) {
    return (
        <ImageList sx={{ width: 500, height: 200 }} cols={3}>
            {deviceData.map((device) => (
                <ImageListItem key={device.img} style={{height: '90px', width: '120px'}}>
                    <img style={{height: '90px', width: '130px'}}
                        src={device.img}
                        srcSet={device.img}
                        alt={device.title}
                        loading="lazy"
                        onClick={(event) => props.createNode(device.img, device.title)}
                        
                    />
                    {/* <ImageListItemBar
                        title={device.title}
                        position="below"
                    /> */}
                </ImageListItem>
            ))}
        </ImageList>
    );
}

const deviceData = [
    {
        img: PC_ICON,
        title: PC,
    },
    {
        img: ROUTER_ICON,
        title: ROUTER,
    },
    {
        img: ROUTER_ICON,
        title: ROUTER,
    },
    {
        img: ROUTER_ICON,
        title: ROUTER,
    },
    {
        img: ROUTER_ICON,
        title: ROUTER,
    },
    {
        img: ROUTER_ICON,
        title: ROUTER,
    },

];