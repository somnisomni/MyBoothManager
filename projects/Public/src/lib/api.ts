import * as CT from "@myboothmanager/common";

export default class PublicAPI {
  private static readonly API: CT.APICaller = new CT.APICaller(import.meta.env.VITE_MBM_API_SERVER_URL);

  /* === Endpoints === */
  /* Common */
  static async checkAPIServerAlive(): Promise<boolean> { return this.API.checkAPIServerAlive(); }
}
