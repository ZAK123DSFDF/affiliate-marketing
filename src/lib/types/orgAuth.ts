import { InferSelectModel } from "drizzle-orm";
import { organization } from "@/db/schema";

export type Organization = InferSelectModel<typeof organization>;
export type OrgAuthResult = {
  domain: Organization["domainName"];
  param: Organization["referralParam"];
};
