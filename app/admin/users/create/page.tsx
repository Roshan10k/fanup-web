import CreateUserForm from "../_components/CreateUserForm";

export default function Page() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Create New User</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Add a new user to the system
                </p>
            </div>

            <div className="rounded-lg border bg-card p-6">
                <CreateUserForm />
            </div>
        </div>
    );
}