export class SteamDiscountItemDto {
  readonly name: string;
  readonly id: number;
  readonly discount_percent: number;
  readonly original_price: number;
  readonly final_price: number;
  readonly currency: string;
  readonly discount_expiration: number;
}
