interface BaseData {
  id: string
  name: string
  email: string
  image?: string | null
}

interface AffiliateData extends BaseData {
  paypalEmail: string | null
}

type SellerData = BaseData

export interface ProfileProps {
  AffiliateData?: AffiliateData
  UserData?: SellerData
  isPreview?: boolean
  affiliate: boolean
  orgId: string
}
