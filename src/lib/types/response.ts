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
export type MutationData =
  | Omit<Extract<ResponseData<any>, { ok: true }>, "data">
  | Extract<ResponseData<any>, { ok: false }>
