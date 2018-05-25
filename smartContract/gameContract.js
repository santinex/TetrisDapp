"use strict";

let Stubs = require("./contractStubs.js");
let LocalContractStorage = Stubs.LocalContractStorage;
let Blockchain = Stubs.Blockchain;
let BigNumber = require("bignumber.js");

class Player {
    constructor(text) {
        let obj = text ? JSON.parse(text) : {};
        this.id = obj.id || 0;
        this.date = obj.date;
        this.wallet = obj.wallet;
        this.name = obj.name || "Unknown";
        this.score = obj.score || 0;
    }

    toString() {
        return JSON.stringify(this);
    }
}

class GameContract {
    constructor() {
        LocalContractStorage.defineProperty(this, "playersCount");
        LocalContractStorage.defineMapProperty(this, "topPlayers");
        LocalContractStorage.defineMapProperty(this, "players", {
            parse: function (text) {
                return new Player(text);
            },
            stringify: function (o) {
                return o.toString();
            }
        });
    }

    init() {
        this.playersCount = 1;
        this.topPlayers.put(0, []);
    }

    totalPlayers() {
        return new BigNumber(this.playersCount).minus(1).toNumber();
    }

    add(name, score) {
        let wallet = Blockchain.transaction.from;
        let index = new BigNumber(this.playersCount).toNumber();

        let player = new Player();
        player.id = index;
        player.wallet = wallet;
        player.date = Date.now();
        player.name = name;
        player.score = score;

        this.players.put(index, player);

        let topIds = this.getTopIds();
        let topPlayers = this.getByIds(topIds);
        topPlayers.sort((a, b) => a.score >= b.score ? -1 : 1);

        if (topPlayers.length < 10) {
            topIds.push(index);
            this.topPlayers.put(0, topIds);
        }
        else if (topPlayers[topPlayers.length - 1].score < score) {
            topPlayers.splice(this.getTopIds().length - 1, 1);
            topPlayers.push(player);

            //collect top player ids
            let ids = [];
            for (const p of topPlayers) {
                ids.push(p.id);
            }

            this.topPlayers.put(0, ids);
        }

        this.playersCount = new BigNumber(index).plus(1).toNumber();
    }

    getTopIds() {
        return this.topPlayers.get(0);
    }

    getTop() {
        let players = this.getByIds(this.getTopIds());
        players.sort((a, b) => a.score >= b.score ? -1 : 1);
        return players;
    }

    getByIds(ids) {
        let arr = [];
        for (const id of ids) {
            let player = this.players.get(id);
            if (player) {
                arr.push(player);
            }
        }
        return arr;
    }


}

module.exports = GameContract;