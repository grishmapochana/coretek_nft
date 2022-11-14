export interface NftData {
  image: string;
  name: string;
  price: string;
  desc: string;
  tokenId: number;
  attribute?: any;
}

export interface OnClickFunction {
  (item: {}): any;
}

export interface Button {
  label: string;
  onClick?: OnClickFunction
}