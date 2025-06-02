import AuthBypassToggle from "@/components/AuthBypassToggle"

export default function AdminPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p className="mb-4">Welcome to the admin area!</p>

      <div className="mb-8">
        <AuthBypassToggle />
      </div>
    </div>
  )
}
