import * as React from 'react';

import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

import { CLOUD, CLOUD_ICON } from '../constants';

export default function BlockImageList(props) {
    return (
        <ImageList sx={{ width: 500, height: 200 }} cols={3}>
            {deviceData.map((device) => (
                <ImageListItem key={device.img} style={{height: '90px', width: '120px'}}>
                    <img style={{height: '90px', width: '130px'}}
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
        img: CLOUD_ICON,
        title: CLOUD,
    },
    {
        img: CLOUD_ICON,
        title: CLOUD,
    },
    {
        img: CLOUD_ICON,
        title: CLOUD,
    },
    {
        img: CLOUD_ICON,
        title: CLOUD,
    },
    {
        img: CLOUD_ICON,
        title: CLOUD,
    },

];