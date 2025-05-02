import React from "react";

const subDomainPage = async ({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}) => {
  const { subdomain } = await params;
  return (
    <>
      <div>the page: {subdomain}</div>
    </>
  );
};
export default subDomainPage;
