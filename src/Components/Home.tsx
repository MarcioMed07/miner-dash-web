import React, { useEffect, useReducer, useState } from 'react';
import { Bar, ChartData } from 'react-chartjs-2';
import chartjs from 'chart.js'
import Miners from '../Interfaces/Miners';

export default function Home(){
    const [miners, setMiners] = useState<Miners>({});
    useEffect(() => {
        (async ()=> {setMiners(await getProfit());})();
      }, []);
    const [curChart, setChart] = useState<JSX.Element>(noDataChart)
    return (
        <>
            <h3>
                Home
            </h3>
            <span>
                <button onClick={()=>setChart(propChart(miners))}>Prop</button>
                <button onClick={()=>setChart(dindinChart(miners))}>Dindin</button>
                <button onClick={()=>setChart(hashrateChart(miners))}>Hashrate</button>
            </span>
            <div>
                {curChart}
            </div>
        </>
    )
}

async function getProfit():Promise<Miners>{
    const headers= {      
    }
    return fetch(process.env.REACT_APP_API_URL + 'miners/profitDB', headers)
    .then(response => response.json())
    .then<Miners>(data => {
        const treatedData:Miners = formatData(data)
        
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

function dindinChart(miners:Miners){
    const prop = "Dindin"
    let data:ChartData<chartjs.ChartData> = {
        labels: Object.keys(miners).sort((a,b)=>miners[b][prop]-miners[a][prop]),
        datasets: [
            {
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

function hashrateChart(miners:Miners){
    const prop = "HashRateMedio"
    let data:ChartData<chartjs.ChartData> = {
        labels: Object.keys(miners).sort((a,b)=>miners[b][prop]-miners[a][prop]),
        datasets: [
            {
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
