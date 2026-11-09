import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import RegisterForm from "@/components/auth/register-form";
import "../login/login.css";

export default async function RegisterPage() {
  if (await getSession()) redirect("/cms");
  return <RegisterForm />;
}