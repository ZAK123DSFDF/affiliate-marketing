"use client"

import React, { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import StripeIntegration from "@/components/pages/Dashboard/Integration/StripeIntegration"
import PaddleIntegration from "@/components/pages/Dashboard/Integration/PaddleIntegration"

const IntegrationClientPage = () => {
  const [activeTab, setActiveTab] = useState("stripe")

  return (
    <div className="p-8 flex justify-start">
      {" "}
      {/* align everything to the left */}
      <Tabs
        defaultValue="stripe"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        {/* Tabs header */}
        <TabsList className="flex gap-6 mb-10 bg-slate-300 py-10 px-8 rounded-2xl">
          {/* Stripe */}
          <TabsTrigger
            value="stripe"
            onClick={() => setActiveTab("stripe")}
            className="rounded-lg transition p-0"
          >
            <div
              className={`bg-white border rounded-lg p-5 flex items-center justify-center w-48 h-16 transition-all duration-200 ${
                activeTab === "stripe"
                  ? "border-blue-500 scale-[1.06]"
                  : "border-gray-300"
              }`}
              style={
                activeTab === "stripe" ? { backgroundColor: "#E3F2FD" } : {}
              }
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
            onClick={() => setActiveTab("paddle")}
            className="rounded-lg transition p-0"
          >
            <div
              className={`bg-white border rounded-lg p-5 flex items-center justify-center w-48 h-16 transition-all duration-200 ${
                activeTab === "paddle"
                  ? "border-blue-500 scale-[1.06]"
                  : "border-gray-300"
              }`}
              style={
                activeTab === "paddle" ? { backgroundColor: "#E3F2FD" } : {}
              }
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

        {/* Content aligned left */}
        <div className="flex justify-start">
          <TabsContent value="stripe" className="w-full">
            <StripeIntegration />
          </TabsContent>
          <TabsContent value="paddle" className="w-full">
            <PaddleIntegration />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

export default IntegrationClientPage
