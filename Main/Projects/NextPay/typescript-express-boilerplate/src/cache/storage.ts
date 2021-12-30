export default interface Storage {
  set: (k: string, v: any) => void
  get: (k: string) => void
  has: (k: string) => boolean
  startRefreshing: (k: string) => void
  stopRefreshing: (k: string) => void
  setSize: (val: number) => void
  isRefreshing: (k: string, refreshTimeOutAfterMillis: number) => boolean
  getAliveTimeInMillis: (k: string) => number
}
