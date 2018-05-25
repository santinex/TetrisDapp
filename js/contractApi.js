const CONTRACT_ADDRESS = "n1h2uV1Nph6SuanWxKp6j3NyXqrDujPhkh4"; //0e32f5375717488ddef73ba4c9c53ada2a7a2582e6ff784fcb9064fe17f01dce

class SmartContractApi {
    constructor(contractAdress) {
        let NebPay = require("nebpay");
        this.nebPay = new NebPay();
        this._contractAdress = contractAdress || CONTRACT_ADDRESS;
    }

    getContractAddress() {
        return this.contractAdress;
    }

    _simulateCall({ value = "0", callArgs = "[]", callFunction, callback }) {
        this.nebPay.simulateCall(this._contractAdress, value, callFunction, callArgs, {
            callback: function (resp) {
                if (callback) {
                    callback(resp);
                }
            }
        });
    }

    _call({ value = "0", callArgs = "[]", callFunction, callback }) {
        this.nebPay.call(this._contractAdress, value, callFunction, callArgs, {
            callback: function (resp) {
                if (callback) {
                    callback(resp);
                }
            }
        });
    }
}

class GameContract extends SmartContractApi {
    add(name, score, cb) {
        this._call({
            callArgs: `["${name}", ${score}]`,
            callFunction: "add",
            callback: cb
        });
    }

    getTop(cb) {
        this._simulateCall({
            callFunction: "getTop",
            callback: cb
        });
    }

    getTopIds(cb) {
        this._simulateCall({
            callFunction: "getTopIds",
            callback: cb
        });
    }


}
