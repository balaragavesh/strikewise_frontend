export type Projection = {
  Strike: number;
  Profit_Per_Lot: number;
  Loss_Per_Lot: number;
  OI?: number;
};

export type SelectedContract = {
  Strike: number;
  Lots: number;
  Total_Cost: number;
  Total_Reward: number;
  Total_Risk: number;
};
