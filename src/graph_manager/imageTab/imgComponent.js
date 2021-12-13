import * as React from 'react';

import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

import { ROUTER, PC, PC_ICON, ROUTER_ICON, SERVER_ICON, SERVER } from '../utils/constants';

export default function DeviceImageList(props) {
    return (
        <ImageList sx={{ width: "100%", height: 300 }} cols={2}>
            {deviceData.map((device) => (
                <ImageListItem key={device.img} style={{ width:"50%"}}>
                    <img style={{
                        position: "absolute",
                        margin: "auto",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                    }}
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
        img: SERVER_ICON,
        title: SERVER,
    }
];