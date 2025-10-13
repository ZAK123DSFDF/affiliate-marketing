interface BaseData {
  id: string
  name: string
  email: string
  image?: string | null
  canChangeEmail?: boolean
  canChangePassword?: boolean
}

export interface AffiliateData extends BaseData {
  paypalEmail: string | null
}

export type OrganizationData = BaseData

export interface ProfileProps {
  AffiliateData?: AffiliateData
  UserData?: OrganizationData
  isPreview?: boolean
  affiliate: boolean
  orgId: string
}
