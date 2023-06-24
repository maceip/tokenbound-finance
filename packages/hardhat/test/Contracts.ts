import { expect } from "chai";
import { ethers } from "hardhat";
import hre from "hardhat";
import { TokenboundClient } from '@tokenbound/sdk';
import { FinanceNFT, FinanceNFTFactory } from "../typechain-types";

const registryAddress = "0x02101dfB77FDE026414827Fdc604ddAF224F0921";
const registryABI = [{"inputs":[],"name":"InitializationFailed","type":"error"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"address","name":"implementation","type":"address"},{"indexed":false,"internalType":"uint256","name":"chainId","type":"uint256"},{"indexed":false,"internalType":"address","name":"tokenContract","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"salt","type":"uint256"}],"name":"AccountCreated","type":"event"},{"inputs":[{"internalType":"address","name":"implementation","type":"address"},{"internalType":"uint256","name":"chainId","type":"uint256"},{"internalType":"address","name":"tokenContract","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"salt","type":"uint256"}],"name":"account","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"implementation","type":"address"},{"internalType":"uint256","name":"chainId","type":"uint256"},{"internalType":"address","name":"tokenContract","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"salt","type":"uint256"},{"internalType":"bytes","name":"initData","type":"bytes"}],"name":"createAccount","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"nonpayable","type":"function"}];
const tbaImplementationAddress = "0x2d25602551487c3f3354dd80d76d54383a243358";

const accountABI = [{"inputs":[{"internalType":"address","name":"_defaultImplementation","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"previousAdmin","type":"address"},{"indexed":false,"internalType":"address","name":"newAdmin","type":"address"}],"name":"AdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"beacon","type":"address"}],"name":"BeaconUpgraded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"implementation","type":"address"}],"name":"Upgraded","type":"event"},{"stateMutability":"payable","type":"fallback"},{"inputs":[],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];
const tokenABI = [
  {
      "constant": true,
      "inputs": [],
      "name": "name",
      "outputs": [
          {
              "name": "",
              "type": "string"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "constant": false,
      "inputs": [
          {
              "name": "_spender",
              "type": "address"
          },
          {
              "name": "_value",
              "type": "uint256"
          }
      ],
      "name": "approve",
      "outputs": [
          {
              "name": "",
              "type": "bool"
          }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "constant": true,
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
          {
              "name": "",
              "type": "uint256"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "constant": false,
      "inputs": [
          {
              "name": "_from",
              "type": "address"
          },
          {
              "name": "_to",
              "type": "address"
          },
          {
              "name": "_value",
              "type": "uint256"
          }
      ],
      "name": "transferFrom",
      "outputs": [
          {
              "name": "",
              "type": "bool"
          }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "constant": true,
      "inputs": [],
      "name": "decimals",
      "outputs": [
          {
              "name": "",
              "type": "uint8"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "constant": true,
      "inputs": [
          {
              "name": "_owner",
              "type": "address"
          }
      ],
      "name": "balanceOf",
      "outputs": [
          {
              "name": "balance",
              "type": "uint256"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "constant": true,
      "inputs": [],
      "name": "symbol",
      "outputs": [
          {
              "name": "",
              "type": "string"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "constant": false,
      "inputs": [
          {
              "name": "_to",
              "type": "address"
          },
          {
              "name": "_value",
              "type": "uint256"
          }
      ],
      "name": "transfer",
      "outputs": [
          {
              "name": "",
              "type": "bool"
          }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "constant": true,
      "inputs": [
          {
              "name": "_owner",
              "type": "address"
          },
          {
              "name": "_spender",
              "type": "address"
          }
      ],
      "name": "allowance",
      "outputs": [
          {
              "name": "",
              "type": "uint256"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "payable": true,
      "stateMutability": "payable",
      "type": "fallback"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "name": "owner",
              "type": "address"
          },
          {
              "indexed": true,
              "name": "spender",
              "type": "address"
          },
          {
              "indexed": false,
              "name": "value",
              "type": "uint256"
          }
      ],
      "name": "Approval",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "name": "from",
              "type": "address"
          },
          {
              "indexed": true,
              "name": "to",
              "type": "address"
          },
          {
              "indexed": false,
              "name": "value",
              "type": "uint256"
          }
      ],
      "name": "Transfer",
      "type": "event"
  }
];

const wethAddress = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6"; //Goerli

const doDeploy = false;
const factoryAddress = "0xA556719b7b297a7ba14ebC539Ad5360587858669";
var nftAddress = "0x3f74F59fcD89c08CB0a29a08042ccd84E26F624D";
var tbaAddress = "0x4b96C46cdBC95c1Da18Bb0cCa9Ec8F37B4D61EB0"; // for tokenId 0

describe("Contracts", function () {
  // We define a fixture to reuse the same setup in every test.

  let factory: FinanceNFTFactory;
  let implementation: FinanceNFT;
  before(async () => {
    const [owner] = await ethers.getSigners();
    const financeNFTFactoryFactory = await ethers.getContractFactory("FinanceNFTFactory");
    if (doDeploy) {
      // nft implementation
      const financeNFTFactory = await ethers.getContractFactory("FinanceNFT");
      implementation = (await financeNFTFactory.deploy()) as FinanceNFT;
      await implementation.deployed();
      // nft factory
      factory = (await financeNFTFactoryFactory.deploy()) as FinanceNFTFactory;
      await factory.deployed();
      await factory.initialize(implementation.address);
    } else {
      // use previously deployed factory
      factory = new ethers.Contract(factoryAddress, financeNFTFactoryFactory.interface, owner) as FinanceNFTFactory;
    }
  });

  describe("Deployment", function () {
    it.skip("Should have the right implementation", async function () {
      if (doDeploy) {
        expect(await factory.nftImplementation()).to.equal(implementation.address);
      } else {
        expect(true);
      }
    });

    var nft: FinanceNFT;

    it("Should deploy a new NFT contract for a company", async function () {
      const name = "Company A";
      const symbol = "AAA";
      const uri = "ipfs:/testing"; // this is the metadata uri for tokenId 0 -- the master NFT
      const [owner] = await ethers.getSigners();
      const contractOwner = owner.address;

      if (doDeploy) {
        const deployResult = await factory.createFinanceNFT(name, symbol, contractOwner, uri);
        const { events } = await deployResult.wait();
        const event = events.find(x => x.event === "FinanceNFTCreated");
        nftAddress = event.args[1];
      }
      //console.log("nftAddress", nftAddress);
      expect(nftAddress).to.not.be.null;
    });

    it.skip("Should mint a new NFT token", async function () {
      const uri = "ipfs:/token1"; // this is the metadata uri for tokenId 1
      const [owner] = await ethers.getSigners();
      nft = new ethers.Contract(nftAddress, implementation.interface, owner) as FinanceNFT;
      const tokenOwner = owner.address;
      await expect(nft.mint(tokenOwner, uri))
        .to.emit(nft, 'Transfer')
        .withArgs("0x0000000000000000000000000000000000000000", tokenOwner, 1);
    });

    it.skip("Should deploy TBA contract for an NFT tokenId 0", async function () {
      this.timeout(2400000);
      const [owner] = await ethers.getSigners();
      const registry = new ethers.Contract(registryAddress, registryABI, owner);
      const tokenboundClient = new TokenboundClient({ signer: owner, chainId: 5 });
      const predictedAccount = await tokenboundClient.getAccount({
        tokenContract: nftAddress,
        tokenId: "0",
      });
      console.log(predictedAccount);
      
      await expect(registry.createAccount(tbaImplementationAddress, 5, nftAddress, 0, 0, ethers.utils.formatBytes32String(""), {gasLimit: 2000000}))
        .to.emit(registry, 'AccountCreated')
        .withArgs(predictedAccount, tbaImplementationAddress, 5, nftAddress, 0, 0);
    });

    it.skip("Should send ETH to TBA", async function () {
      const [owner] = await ethers.getSigners();
      const balBefore = await ethers.provider.getBalance(tbaAddress);
      const tx = await owner.sendTransaction({
        to: tbaAddress,
        value: ethers.utils.parseEther("0.01")
      });
      tx.wait();
      const balAfter = await ethers.provider.getBalance(tbaAddress);
      expect(balAfter > balBefore);
    });

    it.skip("Should send WETH to TBA", async function () {
      const [owner] = await ethers.getSigners();
      const weth = new ethers.Contract(wethAddress, tokenABI, owner);
      const balBefore = await weth.balanceOf(tbaAddress);
      const tx = await weth.transfer(tbaAddress, "1000");
      tx.wait();
      const balAfter = await weth.balanceOf(tbaAddress);
      expect(balAfter > balBefore);
    });
    
    it("Should transfer WETH from TBA to owner", async function () {
      const [owner] = await ethers.getSigners();
      const weth = new ethers.Contract(wethAddress, tokenABI, owner);
      const balBefore = await weth.balanceOf(owner.address);
      const tx = await weth.populateTransaction.transfer(owner.address, "1000");
      const txnData = tx.data ? tx.data : '';
      const tokenboundClient = new TokenboundClient({ signer: owner, chainId: 5 });
      const executedCall = await tokenboundClient.executeCall({
        account: tbaAddress,
        to: wethAddress,
        value: BigInt(0),
        data: txnData,
      });
      console.log(executedCall);
      const balAfter = await weth.balanceOf(owner.address);
      expect(balAfter > balBefore);
    });



  });

  
});