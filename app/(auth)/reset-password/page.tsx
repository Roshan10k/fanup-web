import ResetPasswordForm from "../_components/ResetPasswordForm";
import Navbar from "@/app/_components/navbar";

export default async function Page({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const query = await searchParams;
    const token = query.token ? (query.token as string) : '';
    return (
        <div className="dark:bg-slate-950">
            <Navbar variant="auth" />
            <ResetPasswordForm token={token} />
        </div>
    );
}
