interface BaseData {
  id: string
  name: string
  email: string
  image?: string | null
}

export interface AffiliateData extends BaseData {
  paypalEmail: string | null
}

export type SellerData = BaseData

export interface ProfileProps {
  AffiliateData?: AffiliateData
  UserData?: SellerData
  isPreview?: boolean
  affiliate: boolean
  orgId: string
}
