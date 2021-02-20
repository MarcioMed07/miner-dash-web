import React, { Context, useEffect, useReducer, useState } from 'react';
import { Bar, ChartData } from 'react-chartjs-2';
import chartjs from 'chart.js'
import Miners, { Currencies } from '../Interfaces/Interfaces';
import { Box, Button, Card, CircularProgress, Icon, Tab, Tabs, Typography } from '@material-ui/core';
import "chartjs-plugin-datalabels";

export enum ChartType {
    Prop,
    Dindin,
    Hashrate
}

export interface HomeChartProps {
    miners: Miners,
    type: ChartType,
    currency: Currencies
}


interface ChartProps {
    miners: Miners, currency?: number
}

export default function HomeChart(props: HomeChartProps) {
    let { miners, type, currency } = props;
    return (<>
        {(() => {
            switch (type) {
                case ChartType.Prop:
                    return <PropChart miners={miners} />
                case ChartType.Hashrate:
                    return <HashrateChart miners={miners} />
                case ChartType.Dindin:
                    return <DindinChart miners={miners} currency={currency} />
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

function getChartColor(entries: number) {
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

