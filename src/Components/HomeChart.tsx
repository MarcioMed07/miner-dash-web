import React, { Context, useEffect, useReducer, useState } from 'react';
import { Bar, ChartData, HorizontalBar } from 'react-chartjs-2';
import chartjs, { ChartTooltipItem } from 'chart.js'
import Miners, { Currencies, Payout } from '../Interfaces/Interfaces';
import { Box, Button, Card, CircularProgress, Icon, Tab, Tabs, Typography } from '@material-ui/core';
import "chartjs-plugin-datalabels";

export enum ChartType {
    Prop,
    Dindin,
    Hashrate,
    Payout
}

export interface HomeChartProps {
    miners: Miners,
    type: ChartType,
    currency: Currencies,
    payouts: Payout[]
}


interface ChartProps {
    miners: Miners, currency?: number, payouts?: Payout[]
}

export default function HomeChart(props: HomeChartProps) {
    let { miners, type, currency, payouts } = props;
    return (<>
        {(() => {
            switch (type) {
                case ChartType.Prop:
                    return <PropChart miners={miners} />
                case ChartType.Hashrate:
                    return <HashrateChart miners={miners} />
                case ChartType.Dindin:
                    return <DindinChart miners={miners} currency={currency} />
                case ChartType.Payout:
                    return <PayoutsChart miners={miners} payouts={payouts} currency={currency} />
            }
        })()}
    </>
    )
}

function noDataChart() {
    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh"
        }}>

            <CircularProgress />
        </div>
    )
}

function getChartBorderColor(entries: number) {
    let colors: string[] = []
    for (let i = 0; i < entries; i++) {
        colors.push(
            i == 0 ? "rgb(212,175,55)" :
                i == 1 ? "rgb(192,192,192)" :
                    i == 2 ? "rgb(205,127,50)" :
                        "rgb(178,190,181)"
        )
    }
    return colors
}

function getChartColor(entries: number) {
    let colors: string[] = []
    for (let i = 0; i < entries; i++) {
        colors.push(
            i == 0 ? "rgba(212,175,55,0.8)" :
                i == 1 ? "rgba(192,192,192,0.8)" :
                    i == 2 ? "rgba(205,127,50,0.8)" :
                        "rgba(178,190,181,0.8)"
        )
    }
    return colors
}


function chartOptions(formatter: (value: any) => any): { height: number, options: Chart.ChartOptions } {
    return {
        height: window.innerHeight - 400,
        options: {
            maintainAspectRatio: false,
            onResize: (newSize: any) => {
                newSize.canvas.parentNode.style.height = (window.innerHeight - 400) + 'px'
            },
            responsive: true,
            legend: {
                display: false
            },
            plugins: {
                datalabels: {
                    color: 'white',
                    font: {
                        weight: 'bold'
                    },
                    align: "center",
                    anchor: "center",
                    clamp: true,
                    formatter: formatter
                }
            }
        }
    }
}

function PropChart(props: ChartProps) {
    let { miners } = props
    if (Object.values(miners).length == 0) {
        return noDataChart()
    }
    const prop = "Proporcao"
    let data = {
        labels: Object.keys(miners).sort((a, b) => miners[b][prop] - miners[a][prop]),
        datasets: [
            {
                backgroundColor: getChartColor(Object.keys(miners).length),
                label: prop,
                data: Object.values(miners).map(m => m[prop]).sort((a, b) => b - a),
            }
        ]
    }
    let { height, options } = chartOptions((v) => Math.round(v * 1000) / 10 + "%")
    return (
        <Bar
            data={data}
            height={height}
            options={options}
        />
    )
}

function DindinChart(props: ChartProps) {
    if (props.currency === null || props.currency === undefined) {
        return <div>Chart Error, no Currency</div>
    }
    let { miners, currency } = props
    if (Object.values(miners).length == 0) {
        return noDataChart()
    }
    const currString = [" (USD)", " (BRL)", " (ETH)"];
    const prop = ["Dindin", "DindinBRL", "ETH"] as const;


    let data: ChartData<chartjs.ChartData> = {
        labels: Object.keys(miners).sort((a, b) => miners[b][prop[currency]] - miners[a][prop[currency]]),
        datasets: [
            {
                backgroundColor: getChartColor(Object.keys(miners).length),
                label: "Dindin" + currString[currency],
                data: Object.values(miners).map(m => m[prop[currency]]).sort((a, b) => b - a)
            }
        ]
    }
    let { height, options } = chartOptions((v) => {
        return (currency === Currencies.ETH ?
            Math.round(v * 100000) / 100000 :
            Math.round(v * 100) / 100 + currString[currency])
    })
    return (
        <Bar
            data={data}
            height={height}
            options={options}
        />
    )
}

function HashrateChart(props: ChartProps) {
    let { miners } = props
    if (Object.values(miners).length == 0) {
        return noDataChart()
    }
    const prop = "HashRateMedio"
    let data: ChartData<chartjs.ChartData> = {
        labels: Object.keys(miners).sort((a, b) => miners[b][prop] - miners[a][prop]),
        datasets: [
            {
                backgroundColor: getChartColor(Object.keys(miners).length),
                label: prop + " (Mh/s)",
                data: Object.values(miners).map(m => m[prop]).sort((a, b) => b - a).map(a => { return a / 1e6 })
            }
        ]
    }
    let { height, options } = chartOptions((v: any) => Math.round(v * 100) / 100 + " (Mh/s)")
    return (
        <Bar
            data={data}
            height={height}
            options={options}
        />
    )
}

function PayoutsChart(props: ChartProps) {
    if (props.currency == null || !props.payouts) {
        return <div>Chart Error, no Currency</div>
    }
    let { miners, currency, payouts } = props
    if (Object.values(miners).length == 0) {
        return noDataChart()
    }

    const currString = [" (USD)", " (BRL)", " (ETH)"];
    const prop = ["USD", "BRL", "ETH"] as const;

    let orderedPayouts = payouts.map(t=>{
        let obj:any[] = []
        for(let [key, value] of Object.entries<any>(t)){
            value['miner'] = key
            obj.push(value)
        }
        return obj.sort((a,b)=>{
            return payouts.reduce((acc,cur)=>acc+cur[b.miner]['BRL'],0) - payouts.reduce((acc,cur)=>acc+cur[a.miner]['BRL'],0)
        })
    })


    let data: ChartData<chartjs.ChartData> = {
        labels: orderedPayouts[0].map(t=>t.miner),
        datasets: orderedPayouts.map(payout=>{

        
         return    {
                backgroundColor: getChartColor(Object.keys(miners).length),
                borderColor: getChartBorderColor(Object.keys(miners).length),
                borderWidth: 3,
                label: "Dindin" + currString[currency],
                data: payout.map(m => m[prop[currency]])
            }
        })
    }
    let { height, options } = chartOptions((v) => {
        return ''
    })
    options['scales'] = {
        xAxes: [{
            stacked: true
        }],
        yAxes: [{
            stacked: true
        }]
    }
    options.tooltips = {
        mode: "label",
        callbacks:{
            footer: (item: chartjs.ChartTooltipItem[], data: chartjs.ChartData)=>{
                
                return 'Soma: ' + item.reduce((acc,cur)=>acc+Number(cur.xLabel),0)
            }
        }
    }
    options.title = {
        text: "Soma Geral: " + orderedPayouts.reduce((acc,cur)=>acc+cur.reduce((a,c)=>a+c[prop[currency]],0),0) + currString[currency],
        display: true
    }
    return (
        <HorizontalBar
            data={data}
            height={height}
            options={options}
        />
    )
}

