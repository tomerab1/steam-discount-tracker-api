import { SteamOverview } from './steam-overview.payload';

export interface SteamAppDetails {
  readonly success: boolean;
  readonly data: SteamOverview;
}
