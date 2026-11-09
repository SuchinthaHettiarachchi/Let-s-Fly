import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import LoginForm from "@/components/auth/login-form";
import "./login.css";

export default async function LoginPage() {
  if (await getSession()) redirect("/cms");
  return <LoginForm />;
}