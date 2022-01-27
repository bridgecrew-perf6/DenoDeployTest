export class Room {
  public readonly id: string;
  public readonly web: WebSocket;
  public readonly webStatus: boolean;
  private _pc: WebSocket;
  private _pcStatus: boolean;

  constructor(web: WebSocket) {
    this.id = crypto.randomUUID();
    this.web = web;
    this.webStatus = true;
    this._pc = web;
    this._pcStatus = false;
  }

  get pc(): WebSocket {
    return this._pc;
  }
  set pc(pc: WebSocket) {
    this._pc = pc;
    this._pcStatus = true;
  }

  get pcStatus(): boolean {
    return this._pcStatus;
  }
}
