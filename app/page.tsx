import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/options";
import { ClientPage } from "./components/ClientPage";
import { Suspense } from "react";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientPage session={session} />
    </Suspense>
  );
}
