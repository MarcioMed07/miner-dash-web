import React, { useEffect, useReducer, useState } from 'react';
import { Bar, ChartData } from 'react-chartjs-2';
import chartjs from 'chart.js'
import Miners from '../Interfaces/Miners';
import { Box, Button, Card, CircularProgress, Icon, Tab, Tabs, Typography } from '@material-ui/core';

const currencies = Object.freeze({ "usd": 0, "brl": 1, "eth": 2 });



interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}
function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}
function a11yProps(index: any) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function Home() {
    const [miners, setMiners] = useState<Miners>({});
    useEffect(() => {
        (async () => { await getProfit(setMiners, setChart); })();
    }, []);
    const [curChart, setChart] = useState<number>(0)
    const [currency, setCurrency] = useState<number>(currencies.eth)
    return (
        <>
            <h2>
                Home
            </h2>
            <hr style={{
                border: "none",
                borderTop: "solid 0.1em #333"
            }} />
            {/* <span>
                <Button variant="contained" color="primary" onClick={() => setChart(propChart(miners))}>Prop</Button>
                <Button variant="contained" color="primary" onClick={() => setChart(dindinChart(miners, setChart))}>Dindin</Button>
                <Button variant="contained" color="primary" onClick={() => setChart(hashrateChart(miners))}>Hashrate</Button>
            </span> */}
            <div>
                <Tabs textColor="primary" indicatorColor="primary" value={curChart} onChange={(event, newValue) => { setChart(newValue) }} aria-label="simple tabs example">
                    <Tab icon={<Icon>pie_chart</Icon>} label="Proporção" {...a11yProps(0)} />
                    <Tab icon={<Icon>attach_money</Icon>} label="Dindin" {...a11yProps(1)} />
                    <Tab icon={<Icon>leaderboard</Icon>} label="Hashrate Médio" {...a11yProps(2)} />
                </Tabs>
                <TabPanel value={curChart} index={0}>
                    <PropChart miners={miners} />
                </TabPanel>
                <TabPanel value={curChart} index={1}>
                    <DindinChart miners={miners} currency={currency} setCurrency={setCurrency} />
                </TabPanel>
                <TabPanel value={curChart} index={2}>
                    <HashrateChart miners={miners} />
                </TabPanel>
            </div>
        </>
    )
}

async function getProfit(setMiners: Function, setChart: Function): Promise<Miners> {
    const headers = {
    }
    return fetch(process.env.REACT_APP_API_URL + 'miners/profitDB', headers)
        .then(response => response.json())
        .then<Miners>(data => {
            const treatedData: Miners = formatData(data)
            setMiners(treatedData);
            setChart(0)
            return treatedData
        })
}

function formatData(data: any): Miners {
    return data
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

function changeCurrency(currency: number, setCurrency: Function) {
    setCurrency(currency + 1 >= Object.values(currencies).length ? 0 : currency + 1)
}


interface PropChartProps {
    miners: Miners
}
function PropChart(props: PropChartProps) {
    let { miners } = props
    if (Object.values(miners).length == 0) {
        return noDataChart()
    }
    const prop = "Proporcao"
    let data: ChartData<chartjs.ChartData> = {
        labels: Object.keys(miners).sort((a, b) => miners[b][prop] - miners[a][prop]),
        datasets: [
            {
                backgroundColor: getChartColor(Object.keys(miners).length),
                label: prop,
                data: Object.values(miners).map(m => m[prop]).sort((a, b) => b - a)
            }
        ]
    }
    return (<>
        <Bar
            data={data}
            options={{
                maintainAspectRatio: true,
                legend: {
                    display: false
                }
            }}
        />
    </>)
}

interface DinDinChartProps {
    miners: Miners, currency: number, setCurrency: Function
}
function DindinChart(props: DinDinChartProps) {
    let { miners, currency, setCurrency } = props
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
    return (
        <>
            <div style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "20px"
            }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => { changeCurrency(currency, setCurrency); }}
                >
                    <Icon>swap_horiz</Icon>
                    {currString[currency]}
                </Button>
            </div>
            <div>
                <Bar
                    data={data}
                    options={{
                        maintainAspectRatio: true,
                        legend: {
                            display: false
                        }
                    }}
                />
            </div>
        </>)
}

function HashrateChart(props: PropChartProps) {
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
    return (
        <Bar
            data={data}
            options={{
                maintainAspectRatio: true,
                legend: {
                    display: false
                }
            }}
        />
    )
}
