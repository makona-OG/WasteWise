import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

export default function Users() {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return <div className="p-8">Access Denied</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">User Management</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Registered Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="font-medium">admin@wastefix.com</p>
                <p className="text-sm text-gray-500">Admin</p>
              </div>
              <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                Active
              </span>
            </div>
            {/* Add more users here when connected to a real backend */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}