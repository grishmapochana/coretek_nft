
export interface NetworkInfo {
  name?: string | undefined | null,
  chainId?: number | undefined,
  url?: string | null | undefined
}

export interface ContractInfo {
    name: string,
    address: string,
    habi: string | string[],
    network: NetworkInfo
}
