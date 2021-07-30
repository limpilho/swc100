//생성한 Contract의 기능 및 함수 호출 등을 테스팅하는 곳
//Contract의 주소 값만 변경해주면 됨
//원하는 코드를 작성해서 함수 호출 등을 테스트
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
const test_json = require("../build/contracts/greet.json");

const a = test_json["abi"];
const bytecode = test_json["bytecode"];

async function ab(){
    //contract address를 등록 = mycontract로
    const mycontract = new web3.eth.Contract(a, "0x2d3373f405fDEe12E5A9331Ab74a19e80fC271f5");
    const account_list = await web3.eth.getAccounts();
    console.log(account_list);

    //myContract.methods.myMethod([param1[, param2[, ...]]])
    await mycontract.methods.setGreeting("test_time:1506_st").send({from: account_list[5],gas:100000,gasPrice:'200000'}).then(
        function(result){
            console.log(result);
        }
    );
    
    //call = 지정한 함수를 호출
    //myContract.methods.myMethod([param1[, param2[, ...]]]).call(options [, defaultBlock] [, callback])
    await mycontract.methods.getGreeting().call().then(
        function(res){
            console.log("getGreeting value: ",res);
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
ab();

//myContract.methods.myMethod([param1[, param2[, ...]]])
//methods는 call, send, estimateGas, encodeABI만 가능