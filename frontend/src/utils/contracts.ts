import Adderesses from "./contract-addresses.json"
import MyERC4907 from "./abis/MyERC4907.json"
declare global {
    interface Window {
      web3: any; // 或者根据实际情况指定正确的类型
    }
  }
const Web3 = require('web3');

let web3 = new Web3(window.web3.currentProvider)

const myERC4907Address = Adderesses.myERC4907;
const myERC4907ABI = MyERC4907.abi;

const myERC4907Contract = new web3.eth.Contract(myERC4907ABI,myERC4907Address);

export {web3, myERC4907Contract, myERC4907ABI}