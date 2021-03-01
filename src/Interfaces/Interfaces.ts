export interface Payout{
    [key: string]: PayoutData
}

interface PayoutData{
    BRL: number,
    ETH: number,
    USD: number
}

export default interface Miners{
    [key: string]: MinerData
}

export interface MinerData{
    Proporcao: number,
    Dindin: number,
    DindinBRL: number,
    ETH: number,
    HashRateMedio: number
}

export enum Currencies { USD = 0, BRL = 1, ETH = 2 }