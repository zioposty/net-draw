export default  {
    height: 800,
    maxZoom: 7,
    minZoom: 1,
    highlightOpacity: 0.4,
    highlightDegree: 1,
    //focusZoom: 3,
    directed: false,

    linkHighlightBehavior: true,
    nodeHighlightBehavior: true,
    staticGraphWithDragAndDrop: true,
    node: {
      color: "red",
      size: { height: 200, width: 200},
      highlightStrokeColor: "blue",
      symbolType: 'square',
      labelPosition: "right",
    },
    link: {
      color: "#000000",
      opacity: 1,
      highlightColor: "lightblue",
    },
  };