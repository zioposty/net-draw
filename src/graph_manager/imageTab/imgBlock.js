import * as React from 'react';

import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

import { CLOUD, CLOUD_ICON, SQUARE, SQUARE_ICON } from '../utils/constants';


export default function BlockImageList(props) {
    return (
        <ImageList sx={{ width: "100%", height: 350 }} cols={2}>
            {deviceData.map((device) => (
                <ImageListItem key={device.img} style={{width: "50%"}}>
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
                        onClick={(event) => props.createBlock(device.title, device.img)}
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
        img: CLOUD_ICON,
        title: CLOUD,
    },
    {
        img: SQUARE_ICON,
        title: SQUARE,
    },
];