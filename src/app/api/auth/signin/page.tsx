import { getProviders } from "next-auth/react"
import { getServerAuthSession } from "~/server/auth"
import Link from "next/link";
import SignInList from "~/app/_components/widgets/signin-buttons";
import { errorMessages } from "../messages";
import { redirect } from "next/navigation";

type Props = {
  searchParams?: {
    action?: string;
    error?: string;
  };
};

export default async function SignIn(props: Props) {
  const session = await getServerAuthSession();

  if (session) {
    redirect("/dashboard");
  }

  const providers = await getProviders() ?? [];
  const action = props.searchParams?.action ?? "signin";

  return (
    <main>
      <div className="flex flex-col items-center min-h-screen text-black">
        <div className="container flex flex-col items-center justify-center gap-2 px-4 mt-32">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            <span className="text-fuchsia-500">Sign</span> {action === "signin" ? "in" : "up"}!
          </h1>
          <h3 className="text-2xl text-center">{action === "signin" ? "Welcome back." : "Create an account."}</h3>
          {props.searchParams?.error && (
            <div className="p-1 mt-3 text-red-600 bg-red-200 rounded">
              <p>{errorMessages[props.searchParams.error]}</p>
            </div>
          )}
          <div className="my-5 space-y-2">
            <SignInList providers={providers} className="my-5 space-y-2" actionString={action === "signin" ? "Sign in" : "Sign up"} />
            <Link href={{ pathname: "/api/auth/signin", query: { action: action === "signin" ? "signup" : "signin" } }}>
              <p className="mt-2 text-sm text-center underline">{action === "signin" ? "Sign up" : "Sign in"} instead</p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}