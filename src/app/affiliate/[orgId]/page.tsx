import React from "react"

const subDomainPage = async ({
  params,
}: {
  params: Promise<{ orgId: string }>
}) => {
  const { orgId } = await params
  return (
    <>
      <div>the page: {orgId}</div>
    </>
  )
}
export default subDomainPage
