import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import ForgotPasswordForm from "@/components/auth/forgot-password-form";
import "../login/login.css";

export default async function ForgotPasswordPage() {
  if (await getSession()) redirect("/cms");
  return <ForgotPasswordForm />;
}