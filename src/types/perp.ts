type Funding = {
  is_positive: boolean;
  previous_rate: string;
  rate: string;
};

type MenuButtonProps = {
  onSelect: (asset: string) => void; // ✅ callback to parent
};

type Market = {
  asset: string;
  denom: string;
  funding: Funding;
  last_trade: string;
  leverage: string;
  longs: string;
  neutrals: string;
  oi: string;
  price: string;
  shorts: string;
  utilization: string;
};