import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import StripeIntegration from "@/components/pages/Dashboard/Integration/StripeIntegration"
import PaddleIntegration from "@/components/pages/Dashboard/Integration/PaddleIntegration"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { OrgIdProps } from "@/lib/types/orgId"
import { requireSellerWithOrg } from "@/lib/server/authGuards"

export default async function IntegrationPage({ params }: OrgIdProps) {
  const orgId = await getValidatedOrgFromParams({ params })
  await requireSellerWithOrg(orgId)

  return (
    <div className="p-8 flex justify-center">
      <Tabs defaultValue="stripe" className="w-full max-w-2xl">
        {/* Darker gray box with border, no shadow */}
        <TabsList className="flex justify-center items-center gap-6 mb-10 bg-slate-300 py-10 px-8 rounded-2xl">
          {/* Stripe */}
          <TabsTrigger
            value="stripe"
            className="group rounded-lg transition p-0 data-[state=active]:scale-[1.06]"
          >
            <div
              className="bg-white border rounded-lg p-5 flex items-center justify-center w-48 h-16 transition-all duration-200
                            group-data-[state=active]:border-blue-500
                            group-data-[state=active]:bg-blue-50"
            >
              <img
                src="/stripe-logo.svg"
                alt="Stripe"
                width={95}
                height={95}
                className="object-contain"
              />
            </div>
          </TabsTrigger>

          {/* Paddle */}
          <TabsTrigger
            value="paddle"
            className="group rounded-lg transition p-0 data-[state=active]:scale-[1.06]"
          >
            <div
              className="bg-white border rounded-lg p-5 flex items-center justify-center w-48 h-16 transition-all duration-200
                            group-data-[state=active]:border-blue-500
                            group-data-[state=active]:bg-blue-50"
            >
              <img
                src="/paddle-logo.svg"
                alt="Paddle"
                width={95}
                height={95}
                className="object-contain"
              />
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stripe">
          <StripeIntegration />
        </TabsContent>
        <TabsContent value="paddle">
          <PaddleIntegration />
        </TabsContent>
      </Tabs>
    </div>
  )
}
