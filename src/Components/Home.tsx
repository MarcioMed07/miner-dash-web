import React, { useEffect, useReducer, useState } from 'react';
import { Bar, ChartData } from 'react-chartjs-2';
import chartjs from 'chart.js'
import Miners from '../Interfaces/Miners';

const currencies = Object.freeze({"usd":0, "brl":1, "eth":2});
let currency = currencies.eth;

const chartColor = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)'
]

export default function Home(){
    const [miners, setMiners] = useState<Miners>({});
    useEffect(() => {
        (async ()=> {await getProfit(setMiners, setChart);})();
      }, []);
    const [curChart, setChart] = useState<JSX.Element>(noDataChart)
    return (
        <>
            <h3>
                Home
            </h3>
            <span>
                <button onClick={()=>setChart(propChart(miners))}>Prop</button>
                <button onClick={()=>setChart(dindinChart(miners, setChart))}>Dindin</button>
                <button onClick={()=>setChart(hashrateChart(miners))}>Hashrate</button>
            </span>
            <div>
                {curChart}
            </div>
        </>
    )
}

async function getProfit(setMiners:Function, setChart:Function):Promise<Miners>{
    const headers= {      
    }
    return fetch(process.env.REACT_APP_API_URL + 'miners/profitDB', headers)
    .then(response => response.json())
    .then<Miners>(data => {
        const treatedData:Miners = formatData(data)
        setMiners(treatedData);
        setChart(propChart(treatedData))
        return treatedData
    })
}

function formatData(data:any):Miners{
    return data
}

function noDataChart(){
    return <div>No data</div>
}

function propChart(miners:Miners){
    const prop = "Proporcao"
    let data:ChartData<chartjs.ChartData> = {
        labels: Object.keys(miners).sort((a,b)=>miners[b][prop]-miners[a][prop]),
        datasets: [
            {
                backgroundColor:chartColor,
                label: prop,
                data: Object.values(miners).map(m=>m[prop]).sort((a,b)=>b-a)
            }
        ]
    }
    return(<>
        <Bar
            data={data}
            options={{ maintainAspectRatio: false }}
        />
    </>)
}

function changeCurrency(setChart:Function, miners:Miners){
    switch (currency){
        case currencies.usd:
            currency = currencies.brl;
            break;
        case currencies.brl:
                currency = currencies.eth;
            break;
        case currencies.eth:
                currency = currencies.usd;
            break;
    }
    setChart(dindinChart(miners,setChart))
}

function dindinChart(miners:Miners, setChart:Function){    
    let currString = "";
    const prop = ["Dindin", "DindinBRL", "ETH"] as const;

    switch (currency){
        case currencies.usd:
                currString = " (USD)";
            break;
        case currencies.brl:
                currString = " (BRL)";
            break;
        case currencies.eth:
                currString = " (ETH)";
            break;
    }
    

    let data:ChartData<chartjs.ChartData> = {
        labels: Object.keys(miners).sort((a,b)=>miners[b][prop[currency]]-miners[a][prop[currency]]),
        datasets: [
            {
                backgroundColor:chartColor,
                label: prop[currency] + currString,
                data: Object.values(miners).map(m=>m[prop[currency]]).sort((a,b)=>b-a)
            }
        ]
    }
    return(
    <>
        <button type="button" onClick={()=>{changeCurrency(setChart, miners);}}>Mudar Moeda</button> 
        <div>
            <Bar
                data={data}
                options={{ maintainAspectRatio: false }}
            />
        </div>
    </>)
}

function hashrateChart(miners:Miners){
    const prop = "HashRateMedio"
    let data:ChartData<chartjs.ChartData> = {
        labels: Object.keys(miners).sort((a,b)=>miners[b][prop]-miners[a][prop]),
        datasets: [
            {
                backgroundColor:chartColor,
                label: prop + " (Mh/s)",
                data: Object.values(miners).map(m=>m[prop]).sort((a,b)=>b-a).map(a => {return a/1e6})
            }
        ]
    }
    return(
        <Bar
            data={data}
            options={{ maintainAspectRatio: false }}
        />
    )
}
