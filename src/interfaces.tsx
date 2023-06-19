export interface BuyPair{
    cryptoCurrency:string;
    fiatCurrency:string;
    minLimit:number;
    maxLimit:number;
    quotation:number;
    paymentMethod:string;
    size:number;
}