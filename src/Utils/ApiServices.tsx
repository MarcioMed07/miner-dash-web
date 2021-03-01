import Miners, { Payout } from "../Interfaces/Interfaces"

export async function getProfit(): Promise<Miners> {
    const headers = {
    }
    return fetch(process.env.REACT_APP_API_URL + 'miners/profitDB', headers)
        .then(response => response.json())
        .then<Miners>(data => {
            const treatedData: Miners = formatData(data)

            return treatedData
        })
}

function formatData(data: any): Miners {
    return data
}

export async function getAllPayouts(): Promise<Payout[]>{

const headers = {
    }
    return fetch(process.env.REACT_APP_API_URL + 'miners/payout/all', headers)
        .then(response => response.json())
        .then<Payout[]>(data => {
            const treatedData: Payout[] = ((data:any):Payout[]=>data)(data)

            return treatedData
        })
}