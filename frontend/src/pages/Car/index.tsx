import { Button, Image } from 'antd';
import { UserOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from 'react';
import { myERC4907Contract, web3,myERC4907ABI } from "../../utils/contracts";
import './index.css';
import { error } from 'console';
import Adderesses from "../../utils/contract-addresses.json";



const GanacheTestChainId = '0x539' // Ganache默认的ChainId = 0x539 = Hex(1337)
// TODO change according to your configuration
const GanacheTestChainName = 'Ganache Test Chain'
const GanacheTestChainRpcUrl = 'http://127.0.0.1:8545'

const CarPage = () => {

    const [account, setAccount] = useState('')
    const [accountBalance, setAccountBalance] = useState(0)
    const [tokens, setTokens] = useState([]);
    const [unusedTokens, setUnusedTokens] = useState([]);
    const [ToRentNFT, setToRentNFT] = useState('');
    const [RentTime, setRentTime] = useState('');
    const [tokenHaveRent, setTokenHaveRent] = useState<{ tokenId: string, expire: string, timestamp:string }[]>([]);
    const [NFTtoInquire, setNFTtoInquire] = useState('');
    const [ownerToInquire, setOwenerInquire] = useState('');
    const [userToInquire, setUserInquire] = useState('');
    const [blockTimestamp, setBlockTimestamp] = useState(1111111111);

    useEffect(() => {
        // 初始化检查用户是否已经连接钱包
        // 查看window对象里是否存在ethereum（metamask安装后注入的）对象
        const initCheckAccounts = async () => {
            // @ts-ignore
            const { ethereum } = window;
            if (Boolean(ethereum && ethereum.isMetaMask)) {
                // 尝试获取连接的用户账户
                const accounts = await web3.eth.getAccounts()
                if (accounts && accounts.length) {
                    setAccount(accounts[0])
                }
            }
        }

        initCheckAccounts()
    }, [])



    useEffect(() => {
        const getAccountInfo = async () => {
            if (myERC4907Contract) {
                const ab = await myERC4907Contract.methods.balanceOf(account).call()
                setAccountBalance(ab)
                const ownerTokens = await myERC4907Contract.methods.getTokensByOwner(account).call();
                setTokens(ownerTokens);
                const unesedTokens = await myERC4907Contract.methods.getUnusedTokenIds().call();
                setUnusedTokens(unesedTokens);
                const tokenRent = await myERC4907Contract.methods.getTokensByUser(account).call();
                setTokenHaveRent(tokenRent);
            } else {
                alert('Contract not exists.')
            }
        }

        if (account !== '') {
            getAccountInfo()
        }
    }, [account])



    const onClaimTokenAirdrop = async () => {
        if (account === '') {
            alert('You have not connected wallet yet.')
            return
        }

        if (myERC4907Contract) {
            try {
                await myERC4907Contract.methods.airdrop().send({
                    from: account
                })
                alert('You have claimed Car NFT.')
            } catch (error: any) {
                alert(error.message)
            }

        } else {
            alert('Contract not exists.')
        }
    }

    const onRentCar = async () => {
        if (account === '') {
            alert('You have not connected wallet yet.')
            return
        }

        if (myERC4907Contract) {
            try {
                const currentTimestamp = Date.now();
                await myERC4907Contract.methods.RentCar(parseInt(ToRentNFT), account, parseFloat(RentTime) * 60 * 60 * 1000 + currentTimestamp,currentTimestamp).send({
                    from: account
                })
                alert("you have rent the car");
            } catch (error: any) {
                alert(error.message)
            }

        } else {
            alert('Contract not exists.')
        }
    }

    const onInquire = async () => {
        if (account === '') {
            alert('You have not connected wallet yet.')
            return
        }
        if (myERC4907Contract) {
            try {
                const ow = await myERC4907Contract.methods.ownerOf(parseInt(NFTtoInquire)).call();
                setOwenerInquire(ow);
                const us = await myERC4907Contract.methods.MyUserOf(parseInt(NFTtoInquire),Date.now()).call();
                setUserInquire(us);

            } catch (error: any) {
                alert(error.message)
            }
        } else {
            alert('Contract not exists.')
        }
    }


    const onClickConnectWallet = async () => {
        // 查看window对象里是否存在ethereum（metamask安装后注入的）对象
        // @ts-ignore
        const { ethereum } = window;
        if (!Boolean(ethereum && ethereum.isMetaMask)) {
            alert('MetaMask is not installed!');
            return
        }

        try {
            // 如果当前小狐狸不在本地链上，切换Metamask到本地测试链
            if (ethereum.chainId !== GanacheTestChainId) {
                const chain = {
                    chainId: GanacheTestChainId, // Chain-ID
                    chainName: GanacheTestChainName, // Chain-Name
                    rpcUrls: [GanacheTestChainRpcUrl], // RPC-URL
                };

                try {
                    // 尝试切换到本地网络
                    await ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: chain.chainId }] })
                } catch (switchError: any) {
                    // 如果本地网络没有添加到Metamask中，添加该网络
                    if (switchError.code === 4902) {
                        await ethereum.request({
                            method: 'wallet_addEthereumChain', params: [chain]
                        });
                    }
                }
            }

            // 小狐狸成功切换网络了，接下来让小狐狸请求用户的授权
            await ethereum.request({ method: 'eth_requestAccounts' });
            // 获取小狐狸拿到的授权用户列表
            const accounts = await ethereum.request({ method: 'eth_accounts' });
            // 如果用户存在，展示其account，否则显示错误信息
            setAccount(accounts[0] || 'Not able to get accounts');
        } catch (error: any) {
            alert(error.message)
        }
    }

    // var ClientReceipt = web3.eth.myERC4907Contract(myERC4907ABI);
    // var clientReceipt = ClientReceipt.at(Adderesses.myERC4907);
    // var blockStampEvent = clientReceipt.BlockTimestamp();
    //     blockStampEvent.watch(function(error:any,result:any){
    //         if(!error)
    //         console.log(result);
    //     }
    //     );

    const formatTime = (Timestamp: number) => {
        const timestamp = Math.floor(Timestamp/1000);

        const days = Math.floor(timestamp / (24 * 60 * 60));  // 计算天数
        const hours = Math.floor((timestamp % (24 * 60 * 60)) / (60 * 60));  // 计算小时数
        const minutes = Math.floor((timestamp % (60 * 60)) / 60);  // 计算分钟数

            return `${days}天 ${hours}小时 ${minutes}分钟`;
    };

    const formatTimeDifference = (expireTimestamp: number) => {
        const currentTimestamp = Math.floor(Date.now() / 1000);  // 当前时间戳（单位：秒）
        var differenceSeconds = 0;
        if (expireTimestamp / 1000 > currentTimestamp)
            differenceSeconds = expireTimestamp / 1000 - currentTimestamp;
        else
            differenceSeconds = currentTimestamp - expireTimestamp / 1000;

        const days = Math.floor(differenceSeconds / (24 * 60 * 60));  // 计算天数
        const hours = Math.floor((differenceSeconds % (24 * 60 * 60)) / (60 * 60));  // 计算小时数
        const minutes = Math.floor((differenceSeconds % (60 * 60)) / 60);  // 计算分钟数

        if (expireTimestamp / 1000 > currentTimestamp)
            return `${days}天 ${hours}小时 ${minutes}分钟`;
        else
            return `-${days}天 ${hours}小时 ${minutes}分钟`;
    };

    const handleRentNFTChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setToRentNFT(event.target.value);
    };

    const handleRentTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRentTime(event.target.value);
    };
    const handleNFTInquireChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNFTtoInquire(event.target.value);
    };

    return (
        <div className='container'>
            <div className='main'>
                <h1>Car NFT Rent</h1>
                <div className='account'>
                    {account === '' && <Button onClick={onClickConnectWallet}>连接钱包</Button>}
                    <div>当前用户：{account === '' ? '无用户连接' : account}</div>
                    <Button onClick={onClaimTokenAirdrop}>领取car NFT空投</Button>
                    <div>当前用户拥有汽车NFT：{account === '' ? 0 : accountBalance}</div>
                    <div>当前用户拥有NFT列表：</div>
                    <ul>
                        {tokens.map(tokenId => (
                            <li key={tokenId}>Token ID: {tokenId}</li>
                        ))}
                    </ul>
                    <div>当前用户已借用NFT列表：</div>
                    <ul>
                        {tokenHaveRent.map((token, index) => (
                            <li key={index}>rentToken ID: {token.tokenId}, timeLeft :{formatTimeDifference(parseInt(token.expire))}</li>
                        ))}
                    </ul>
                    <div>当前空闲NFT列表：</div>
                    <ul>
                        {unusedTokens.map(unusedToken => (
                            <li key={unusedToken}>unusedToken ID: {unusedToken}</li>
                        ))}
                    </ul>
                    <div className='rentCar'>
                        <div>
                            <input type="text"
                                value={ToRentNFT}
                                onChange={handleRentNFTChange}
                                placeholder="请输入NFT to rent"
                            />
                        </div>
                        <div>
                            <input type="text"
                                value={RentTime}
                                onChange={handleRentTimeChange}
                                placeholder="请输入time to rent(hour)"
                            />
                            <Button onClick={onRentCar}>借车 </Button>
                        </div>
                    </div>
                </div>
                <div>
                    <input type="text"
                        value={NFTtoInquire}
                        onChange={handleNFTInquireChange}
                        placeholder="请输入NFT to inquire"
                    />
                    <Button onClick={onInquire}>查询 </Button>
                    <div>查询结果：</div>
                    </div>Owner of car{NFTtoInquire}:{ownerToInquire}<div>
            </div> User of car{NFTtoInquire}:{userToInquire}<div>
                </div>

                {/* </div>blocktimestamp:{formatTime(blockTimestamp)}<div> */}
                <div>
                </div>
            </div>
        </div>
    )
}

export default CarPage