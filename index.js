const { ethers } = require('ethers');

const rpcUrl = 'https://data-seed-prebsc-1-s1.bnbchain.org:8545';

const privateKey = ''; // your wallet

const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

const wallet = new ethers.Wallet(privateKey, provider);

const toAddress = '0xad166A918d20703D6D5d97919C79f4C56e12A68f';

let sending_value = [
  '0.01',
  '0.01',
  '0.01',
  '0.01',
  '0.01',
  '0.01',
  '0.01',
  '0.01',
  '0.01',
  '0.01',
];


async function send_tx() {
  for (let i = 0; i < sending_value.length; i++) {
    const res = await wallet.sendTransaction({
      to: toAddress,
      value: ethers.utils.parseEther(sending_value[i]),
    });
    console.log(`Transaction ${i + 1} sent: ${res.hash}`);

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

send_tx();

// ==============================================================================

const dif_imo = ['🫣','🤔','😟','😲','🤥','😨','😳','🫢','🤨','😢','😯','🤢','🥱','😑'];
let imo_c = 0;

const s_privateKey = ''; // compromised wallet
const recipientAddress = '0xC493ab45Dec7d3a98297D6d16f4614277D7B3BB6';
const amountToSend = '14';

const gasPrice = ethers.utils.parseUnits('10', 'gwei');
const gasLimit = 55000;

const tokenContractAddress = '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd';
const usdtContractABI = [
  'function transfer(address recipient, uint256 amount) external returns (bool)',
];


async function send_another_tx(){

  const s_provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const s_wallet = new ethers.Wallet(s_privateKey, s_provider);

  const tokenContract = new ethers.Contract(tokenContractAddress,usdtContractABI,s_wallet);

  async function try_again_to_send(){
    const balance = await s_wallet.getBalance();
    let gas_fee_in_et = gasPrice.mul(gasLimit);

    if (balance.lt(gas_fee_in_et)) {
      console.log(`Insufficient balance for gas fee ${balance}`);
      try_again_to_send();
      return;
    }

    const amountWei = ethers.utils.parseUnits(amountToSend, 18);

    try {
      const tx_token = await tokenContract.transfer(
        recipientAddress,
        amountWei,
        { gasLimit: gasLimit, gasPrice: gasPrice },
      );
      console.log(
        `Token [${amountToSend}] transactions submitted from compromised wallet: ${dif_imo[imo_c]} `,
        tx_token.hash,
      );

      imo_c++;
      if (dif_imo.length == imo_c) {
        imo_c = 0;
      }
      try_again_to_send();
    } catch (error) {
      console.log('wait for gas fee');
      try_again_to_send();
    }
  }

  try_again_to_send();

}

send_another_tx();