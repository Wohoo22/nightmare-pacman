export default interface Cache {
  setSize: (value: number) => void
  getData: (input: GetDataInput) => Promise<any>
}

export interface GetDataInput {
  identifier: string,
  callback: () => Promise<any>,
  args: any,
  refreshAfter: Time,
  expireAfter: Time,
  refreshTimeOutAfter: Time
}

export interface Time {
  milliseconds: number,
  seconds: number,
  minutes: number,
}