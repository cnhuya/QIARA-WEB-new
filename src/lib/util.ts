export const getCSSVar = (name: string): string => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
export const formatNumber = (raw: string, denom: string, decimals = 4) => {
  const denominator = BigInt(denom);
  const price = BigInt(raw);
  return (Number(price * 10000n / denominator) / 10000).toFixed(decimals);
};
export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
export const truncate = (str: string, start = 6, end = 4) => str.length <= start + end ? str : `${str.slice(0, start)}...${str.slice(-end)}`;