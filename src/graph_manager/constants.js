
const DEVICE_PATH = "./assets/device/"
export const ROUTER_ICON = DEVICE_PATH + "router.svg"  //"https://upload.wikimedia.org/wikipedia/commons/5/5c/Router.svg";
export const ROUTER = "Router"
export const PC_ICON = DEVICE_PATH + "pc.svg" //"https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Computer_n_screen.svg/991px-Computer_n_screen.svg.png"
export const PC = "PC"

//----
const BLOCK_PATH = "./assets/cluster/"
export const CLOUD_ICON = BLOCK_PATH + "cloud.svg" 
export const CLOUD ="Cloud"

export const BLOCK = {

    isBlock: true,
    renderLabel: true,
    size: { height: 500, width: 800},
    symbolType: 'square',
    labelPosition: "top",
    color: "#FFFFFF",
    strokeColor: "blue",
    opacity: 0.5
}