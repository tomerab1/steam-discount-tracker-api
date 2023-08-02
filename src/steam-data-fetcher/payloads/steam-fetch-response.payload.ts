import { SteamGameInfo } from './steam-app.payload';

export interface SteamFetchResponse {
  apps: SteamGameInfo[];
}
