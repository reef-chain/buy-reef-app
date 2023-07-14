export interface BuyPair{
    cryptoCurrency:string;
    fiatCurrency:string;
    minLimit:number;
    maxLimit:number;
    quotation:number;
    paymentMethod:string;
    size:number;
}

export interface BuyPayload{
    address: string,
    fiatCurrency: string,
    cryptoCurrency: string,
    orderAmount: number,
    merchantRedirectUrl: 'https://app.reef.io/',
  };

export interface ReefAccount{
    address:string,
    name:string,
    evmAddress:string
}