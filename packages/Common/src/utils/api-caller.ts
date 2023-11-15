type HTTPMethodString = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export default class APICaller {
  private static readonly FETCH_COMMON_OPTIONS: Partial<RequestInit> = {
    headers: { "Content-Type": "application/json" },
    cache: "no-cache",
    redirect: "error",
  };

  constructor(private readonly apiHost: string, private readonly apiGroup: string = "", private readonly getAuthorizationToken: (() => string) | null | undefined, private readonly teapotPath: string = "teapot") {}

  /* Basic fetch function */
  public async callAPI(method: HTTPMethodString, path: string, payload?: Record<string, unknown>, containAuthCredential: boolean = true): Promise<Record<string, unknown>> {
    const url: string = `${this.apiHost}${this.apiGroup.length > 0 ? `/${this.apiGroup}` : ""}/${path}`;

    const response = await fetch(url, {
      ...APICaller.FETCH_COMMON_OPTIONS,
      method,
      body: payload ? JSON.stringify(payload) : undefined,
      headers: {
        ...APICaller.FETCH_COMMON_OPTIONS.headers,
        ...containAuthCredential && this.getAuthorizationToken ? { Authorization: `Bearer ${this.getAuthorizationToken()}` } : { },
      },
    });

    return await response.json() as Record<string, unknown>;
  }

  /* Fetch function shortcuts */
  public GET = async (path: string, payload?: Record<string, unknown>, containAuthCredential = true) => await this.callAPI("GET", path, payload, containAuthCredential);
  public POST = async (path: string, payload: Record<string, unknown>, containAuthCredential = true) => await this.callAPI("POST", path, payload, containAuthCredential);
  public PUT = async (path: string, payload: Record<string, unknown>, containAuthCredential = true) => await this.callAPI("PUT", path, payload, containAuthCredential);
  public PATCH = async (path: string, payload: Record<string, unknown>, containAuthCredential = true) => await this.callAPI("PATCH", path, payload, containAuthCredential);
  public DELETE = async (path: string, payload?: Record<string, unknown>, containAuthCredential = true) => await this.callAPI("DELETE", path, payload, containAuthCredential);

  public async checkAPIServerAlive(): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiHost}/${this.teapotPath}`, APICaller.FETCH_COMMON_OPTIONS);

      if(response && response.status === 418) return true;
      else return false;
    } catch(error) {
      console.debug("Can't connect to API server! ;(");
      return false;
    }
  }
}
