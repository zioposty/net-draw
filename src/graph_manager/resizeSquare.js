import { zoom } from 'd3';
import React, { Component } from 'react'
import ResizableRect from 'react-rectangle-resizable-rotatable-draggable'
import { DEFAULT_GRAPH_TRANSLATE, GRAPH_ID } from './utils/constants';

class ResizableSquare extends Component {
    constructor(props) {
        super(props)

        let renderedNode = document.getElementById(props.node.id).childNodes[0];

        this.state = {
            width: props.node.size.width / 10  * this.props.zoom,  //100,
            height: props.node.size.height / 10 * this.props.zoom, //100,
            rotateAngle: 0,
            renderedNode: renderedNode,
            resized: false
        }
    }

    handleResize = (style, isShiftKey, type) => {
        // type is a string and it shows which resize-handler you clicked
        // e.g. if you clicked top-right handler, then type is 'tr'
        let { top, left, width, height } = style
        top = Math.round(top)
        left = Math.round(left)
        width = Math.round(width)
        height = Math.round(height)
        this.setState({
            top,
            left,
            width,
            height,
            resized: true
        })
        let size = { height: (height * 10) / this.props.zoom, width: (width * 10) / this.props.zoom };
        this.props.resizeNode(size)
    }

    handleRotate = (rotateAngle) => {
        this.setState({
            rotateAngle
        })
    }

    handleDrag = (deltaX, deltaY) => {
        this.setState({
            left: this.state.left + deltaX,
            top: this.state.top + deltaY
        })
    }

    render() {
        const { width, height, rotateAngle } = this.state;
        let pos = this.state.renderedNode.getBoundingClientRect();
        let left = pos.left
        let top = pos.top

        return (
            <div id="ResizableSquare">
                <ResizableRect
                    left={left}
                    top={top}
                    width={width}
                    height={height}
                    rotateAngle={rotateAngle}
                    // aspectRatio={false}
                    minWidth={20*this.props.zoom}
                    minHeight={20*this.props.zoom}
                    zoomable='n, w, s, e, nw, ne, se, sw'
                    // rotatable={true}
                    // onRotateStart={this.handleRotateStart}
                    // onRotate={this.handleRotate}
                    // onRotateEnd={this.handleRotateEnd}
                    // onResizeStart={this.handleResizeStart}
                    onResize={this.handleResize}
                    onResizeEnd={() => {
                        console.log(this.state);
                        this.props.endResize();
                    }}
                // onDragStart={this.handleDragStart}
                //onDrag={this.handleDrag}
                // onDragEnd={this.handleDragEnd}
                />
            </div>
        )
    }
}

export default ResizableSquare