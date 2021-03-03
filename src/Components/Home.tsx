import React, { useEffect, useReducer, useState } from 'react';
import { Bar, ChartData } from 'react-chartjs-2';

import Miners, { Currencies, Payout } from '../Interfaces/Interfaces';
import { Box, Button, Card, CircularProgress, Icon, Tab, Tabs, Typography } from '@material-ui/core';
import "chartjs-plugin-datalabels";
import { getAllPayouts, getProfit } from '../Utils/ApiServices';
import HomeChart, { ChartType } from './HomeChart';

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
    const [payouts, setPayouts] = useState<Payout[]>([])
    const [curChart, setChart] = useState<number>(0)
    const [currency, setCurrency] = useState<Currencies>(Currencies.ETH)
    useEffect(() => {
        (async () => {
                let profit_p = getProfit()
                let payouts_p = getAllPayouts()
                return await Promise.all([profit_p, payouts_p])
            }
            )()
            .then((response) => {
                setMiners(response[0]);
                setPayouts(response[1])
                setChart(0)
            });
    }, []);
    return (
        <>
            <h2>
                Home
            </h2>
            <hr style={{
                border: "none",
                borderTop: "solid 0.1em #333"
            }} />
            <div>
                <Tabs
                    textColor="primary"
                    indicatorColor="primary"
                    value={curChart}
                    onChange={(event, newValue) => { setChart(newValue) }}
                    aria-label="simple tabs example">
                    <Tab icon={<Icon>leaderboard</Icon>} label="Hashrate Médio" {...a11yProps(0)} />
                    <Tab icon={<Icon>pie_chart</Icon>} label="Proporção" {...a11yProps(1)} />
                    <Tab icon={<Icon>attach_money</Icon>} label="Dindin" {...a11yProps(2)} />
                    <Tab icon={<Icon>archive</Icon>} label="Payouts" {...a11yProps(3)} />
                </Tabs>
                <div style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "flex-end",
                    margin: "20px 0"
                }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => { changeCurrency(currency, setCurrency); }}
                    >
                        <Icon>swap_horiz</Icon>
                        {currString(currency)}
                    </Button>
                </div>
                <TabPanel value={curChart} index={0}>
                    <HomeChart type={ChartType.Hashrate} miners={miners} currency={currency} payouts={payouts}/>
                </TabPanel>
                <TabPanel value={curChart} index={1}>
                    <HomeChart type={ChartType.Prop} miners={miners} currency={currency} payouts={payouts}/>
                </TabPanel>
                <TabPanel value={curChart} index={2}>
                    <HomeChart type={ChartType.Dindin} miners={miners} currency={currency} payouts={payouts}/>
                </TabPanel>
                <TabPanel value={curChart} index={3}>
                    <HomeChart type={ChartType.Payout} miners={miners} currency={currency} payouts={payouts}/>
                </TabPanel>
            </div>
        </>
    )
}


function changeCurrency(currency: number, setCurrency: Function) {
    setCurrency(currency + 1 >= Object.keys(Currencies).length / 2 ? 0 : currency + 1)
}


function currString(c:Currencies) {
    return [" (USD)", " (BRL)", " (ETH)"][c]
} 