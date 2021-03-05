import { makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Miners, { Currencies, MinerData, Payout } from "../Interfaces/Interfaces";

const useStyles = makeStyles({
    table: {        
        minWidth: 650,
    }
});

interface PayoutData {
    USD: number,
    BRL: number,
    ETH: number,
    miner: string
}
interface TableData {
    name: string,
    hashrate: number,
    proporcao: number,
    dindin: number,
    Sum: number
}
function createData(miners: Miners, payouts: Payout[], currency: Currencies): TableData[] {
    const prop = ["Dindin", "DindinBRL", "ETH"] as const
    const payoutProp = ["USD", "BRL", "ETH"] as const
    let orderedPayouts = payouts.map(t => {
        let obj: PayoutData[] = []
        for (let [key, value] of Object.entries<any>(t)) {
            value['miner'] = key
            obj.push(value)
        }
        return obj
    })
    let minerData: MinerData[] = []
    for (let [miner, data] of Object.entries(miners)) {
        data.Name = miner
        minerData.push(data)
    }

    return minerData.map(miner => {
        return {
            name: miner.Name || '',
            hashrate: miner.HashRateMedio,
            proporcao: miner.Proporcao,
            dindin: miner[prop[currency]],
            Sum: orderedPayouts.reduce((acc, cur) => {
                let curMiner = cur.find(p => p.miner === miner.Name)
                return curMiner ? acc + curMiner[payoutProp[currency]] : acc
            }, 0)
        }
    });
}

interface HomeTableProps {
    miners: Miners,
    currency: Currencies,
    payouts: Payout[]
}
export default function HomeTable(props: HomeTableProps) {
    const { miners, currency, payouts } = props
    const classes = useStyles();

    return (
        <TableContainer component={Paper} style={{marginTop:"25px"}}>
            <Table className={classes.table} size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Miner</TableCell>
                        <TableCell align="right">Hashrate Médio</TableCell>
                        <TableCell align="right">Proporção</TableCell>
                        <TableCell align="right">Dindin</TableCell>
                        <TableCell align="right">Soma dos Payouts</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {TableRows(miners, currency, payouts)}
                </TableBody>
            </Table>
        </TableContainer>
    )
}


function TableRows(miners: Miners, currency: Currencies, payouts: Payout[]) {
    const rows = createData(miners, payouts, currency)
    const currString = [" (USD)", " (BRL)", " (ETH)"];
    let tr = rows.map((row) => (
        <TableRow key={row.name}>
            <TableCell component="th" scope="row">
                {row.name}
            </TableCell>
            <TableCell align="right">{Math.round(row.hashrate / 1000) / 1000} Mh/s</TableCell>
            <TableCell align="right">{Math.round(row.proporcao * 10000) / 100}%</TableCell>
            <TableCell align="right">{(currency === Currencies.ETH ?
                Math.round(row.dindin * 100000) / 100000 :
                Math.round(row.dindin * 100) / 100 )} {currString[currency]}</TableCell>
            <TableCell align="right">{(currency === Currencies.ETH ?
                Math.round(row.Sum * 100000) / 100000 :
                Math.round(row.Sum * 100) / 100 )} {currString[currency]}</TableCell>
        </TableRow>
    ))
    return tr
}