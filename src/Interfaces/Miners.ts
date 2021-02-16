export default interface Miners{
    [key: string]: MinerData
}

export interface MinerData{
    Proporcao: number,
    Dindin: number,
    HashRateMedio: number
}