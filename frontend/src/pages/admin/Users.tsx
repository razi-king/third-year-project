import { AdminLayout } from "@/pages/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService, UserDto } from "@/services/adminService";
import { Badge } from "@/components/ui/badge";
import { Loader2, Users as UsersIcon, Search, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const ROLES = ["CUSTOMER", "VENDOR", "ADMIN"] as const;
type Role = typeof ROLES[number];

const ROLE_COLORS: Record<Role, string> = {
  ADMIN:    "bg-red-100 text-red-800 border-red-200",
  VENDOR:   "bg-blue-100 text-blue-800 border-blue-200",
  CUSTOMER: "bg-gray-100 text-gray-700 border-gray-200",
};

const Users = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: () => adminService.getAllUsers(),
  });

  const changeRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      adminService.updateUserRole(userId, role),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      toast({
        title: "Role updated",
        description: `${updated.name}'s role changed to ${updated.role}.`,
      });
    },
    onError: (err: any) => {
      toast({
        title: "Failed to update role",
        description: err?.response?.data?.message || "An error occurred.",
        variant: "destructive",
      });
    },
  });

  const filteredUsers = (users || []).filter((user: UserDto) =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Manage Users</h1>
            <p className="text-muted-foreground mt-1">Platform-wide user directory and access control</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Directory</CardTitle>
            <CardDescription>
              A list of all registered accounts. Use the Role column to change a user's access level.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <div className="py-12 flex flex-col items-center justify-center text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p>Loading users...</p>
                </div>
              ) : error ? (
                <div className="py-12 text-center text-destructive">
                  <p>Failed to load users. Please try again later.</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="p-4 bg-primary/10 rounded-full inline-flex mb-4">
                    <UsersIcon className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No users found</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    {searchQuery ? "No users matched your search criteria." : "No users exist on the platform."}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-muted/50 rounded-t-lg">
                      <tr>
                        <th className="px-4 py-3 font-medium">User ID</th>
                        <th className="px-4 py-3 font-medium">Name</th>
                        <th className="px-4 py-3 font-medium">Email</th>
                        <th className="px-4 py-3 font-medium">Current Role</th>
                        <th className="px-4 py-3 font-medium">Change Role</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user: UserDto) => {
                        const currentRole = user.role as Role;
                        const isPending =
                          changeRoleMutation.isPending &&
                          (changeRoleMutation.variables as any)?.userId === user.id;

                        return (
                          <tr key={user.id} className="border-b hover:bg-muted/50 transition-colors">
                            <td className="px-4 py-4 font-medium max-w-[120px] truncate" title={user.id}>
                              #{String(user.id).split('-')[0]}
                            </td>
                            <td className="px-4 py-4 font-semibold">{user.name}</td>
                            <td className="px-4 py-4 text-muted-foreground">{user.email}</td>

                            {/* Current role badge */}
                            <td className="px-4 py-4">
                              <Badge
                                variant="outline"
                                className={`text-xs font-medium ${ROLE_COLORS[currentRole] ?? "bg-muted text-muted-foreground"}`}
                              >
                                {currentRole}
                              </Badge>
                            </td>

                            {/* Role change select */}
                            <td className="px-4 py-4">
                              <Select
                                value={currentRole}
                                disabled={isPending}
                                onValueChange={(newRole) => {
                                  if (newRole !== currentRole) {
                                    changeRoleMutation.mutate({ userId: user.id, role: newRole });
                                  }
                                }}
                              >
                                <SelectTrigger className="w-[130px] h-8 text-xs">
                                  {isPending ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    <>
                                      <ShieldCheck className="h-3 w-3 mr-1 text-muted-foreground" />
                                      <SelectValue />
                                    </>
                                  )}
                                </SelectTrigger>
                                <SelectContent>
                                  {ROLES.map((role) => (
                                    <SelectItem key={role} value={role}>
                                      {role}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </td>

                            <td className="px-4 py-4">
                              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 text-xs">
                                Active
                              </Badge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Users;
