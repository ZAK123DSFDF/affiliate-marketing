export type ResponseData<T> =
  | {
      ok: true
      data: T
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
