import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import StripeIntegration from "@/components/pages/Dashboard/Integration/StripeIntegration"
import PaddleIntegration from "@/components/pages/Dashboard/Integration/PaddleIntegration"

export default function IntegrationPage() {
  return (
    <div className="p-4">
      <Tabs defaultValue="stripe" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="stripe">Stripe</TabsTrigger>
          <TabsTrigger value="paddle">Paddle</TabsTrigger>
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
