export default interface Cache {
  getData: (
    identifier: string,
    args: any[],
    refreshCycle: Time,
    expireCycle: Time,
    callback: any
  ) => Promise<any>
}

export interface Time {
  milliseconds?: number,
  seconds?: number,
  minutes?: number,
}
