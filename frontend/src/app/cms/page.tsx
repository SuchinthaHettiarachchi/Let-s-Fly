import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import CmsFrame from "@/components/cms/cms-frame";

export const metadata = {
  title: "CMS | Let's Fly.lk",
};

export default async function CmsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return <CmsFrame />;
}