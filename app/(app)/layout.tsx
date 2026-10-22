
import { Suspense, type ReactNode } from "react";
import { redirect } from "next/navigation";
import Sidebar from "@/components/app/Sidebar";
import VaniAssistant from "@/components/app/VaniAssistant";
import { createClient } from "@/lib/superbase/server";

async function ProtectedContent({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect("/");
  }

  return (
    <>
      <Sidebar />
      <div className="min-h-screen pt-16 lg:pt-0">{children}</div>
      <VaniAssistant />
    </>
  );
}

export default function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#070B18] lg:pl-[270px]">
      <Suspense fallback={<div className="min-h-screen bg-[#070B18]" />}>
        <ProtectedContent>{children}</ProtectedContent>
      </Suspense>
    </div>
  );
}
