export type ResponseData<T = undefined> =
  | {
      ok: true
      data?: T
      redirectUrl?: string
      toast?: string
      message?: string
    }
  | {
      ok: false
      error: string
      status: number
      toast?: string
      redirectUrl?: string
    }
