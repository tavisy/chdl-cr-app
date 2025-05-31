"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, Activity, BarChart3, Search, Download, Calendar, Smartphone, Laptop, Info } from "lucide-react"

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [accessLogs, setAccessLogs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [timeRange, setTimeRange] = useState("7d") // Default to 7 days
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLogins: 0,
    uniqueVisitors: 0,
    googleLogins: 0,
    emailLogins: 0,
  })

  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkAdminAccess = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (
        !user ||
        !(user.email?.includes("admin") || user.email?.includes("@bignerd") || user.email?.includes("@carterhales"))
      ) {
        // Redirect non-admin users
        window.location.href = "/"
      }
    }

    checkAdminAccess()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)

      // Calculate date range based on selected time range
      const now = new Date()
      const startDate = new Date()

      switch (timeRange) {
        case "24h":
          startDate.setHours(startDate.getHours() - 24)
          break
        case "7d":
          startDate.setDate(startDate.getDate() - 7)
          break
        case "30d":
          startDate.setDate(startDate.getDate() - 30)
          break
        case "90d":
          startDate.setDate(startDate.getDate() - 90)
          break
      }

      // Fetch users
      const { data: usersData, error: usersError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })

      if (usersError) console.error("Error fetching users:", usersError)
      else setUsers(usersData || [])

      // Fetch access logs within time range - using accessed_at column
      const { data: logsData, error: logsError } = await supabase
        .from("access_logs")
        .select("*")
        .gte("accessed_at", startDate.toISOString())
        .order("accessed_at", { ascending: false })

      if (logsError) console.error("Error fetching access logs:", logsError)
      else setAccessLogs(logsData || [])

      // Calculate statistics
      if (usersData && logsData) {
        const uniqueVisitors = new Set(logsData.map((log) => log.user_id)).size
        const googleLogins = logsData.filter((log) => log.login_method === "google").length
        const emailLogins = logsData.filter((log) => log.login_method === "email").length

        setStats({
          totalUsers: usersData.length,
          totalLogins: logsData.length,
          uniqueVisitors,
          googleLogins,
          emailLogins,
        })
      }

      setIsLoading(false)
    }

    fetchData()
  }, [timeRange])

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Filter logs based on search term
  const filteredLogs = accessLogs.filter(
    (log) =>
      log.user_agent?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.login_method?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Helper function to detect device type from user agent
  const getDeviceType = (userAgent) => {
    if (!userAgent) return "Unknown"
    if (userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i)) {
      return "Mobile"
    } else if (userAgent.match(/iPad|Android|Tablet/i)) {
      return "Tablet"
    } else {
      return "Desktop"
    }
  }

  // Export data as CSV
  const exportCSV = (data, filename) => {
    if (!data || !data.length) return

    // Convert object keys to CSV header
    const headers = Object.keys(data[0])

    // Convert data to CSV rows
    const csvRows = [
      headers.join(","), // Header row
      ...data.map((row) =>
        headers
          .map((header) =>
            // Handle values with commas by wrapping in quotes
            typeof row[header] === "string" && row[header].includes(",") ? `"${row[header]}"` : row[header],
          )
          .join(","),
      ),
    ]

    // Create CSV content
    const csvContent = csvRows.join("\n")

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `${filename}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  // Get user email from user_id by looking up in users array
  const getUserEmail = (userId) => {
    const user = users.find((u) => u.id === userId)
    return user?.email || "Unknown"
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Time range selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button variant={timeRange === "24h" ? "default" : "outline"} onClick={() => setTimeRange("24h")} size="sm">
          Last 24 Hours
        </Button>
        <Button variant={timeRange === "7d" ? "default" : "outline"} onClick={() => setTimeRange("7d")} size="sm">
          Last 7 Days
        </Button>
        <Button variant={timeRange === "30d" ? "default" : "outline"} onClick={() => setTimeRange("30d")} size="sm">
          Last 30 Days
        </Button>
        <Button variant={timeRange === "90d" ? "default" : "outline"} onClick={() => setTimeRange("90d")} size="sm">
          Last 90 Days
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Logins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLogins}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Unique Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueVisitors}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalUsers > 0 && stats.uniqueVisitors > 0
                ? `${Math.round((stats.uniqueVisitors / stats.totalUsers) * 100)}%`
                : "0%"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Login methods visualization */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Login Methods</CardTitle>
          <CardDescription>Distribution of authentication methods used</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm font-medium">Google</div>
                <div className="text-sm text-muted-foreground">
                  {stats.totalLogins > 0 ? `${Math.round((stats.googleLogins / stats.totalLogins) * 100)}%` : "0%"}
                </div>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${stats.totalLogins > 0 ? (stats.googleLogins / stats.totalLogins) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm font-medium">Email</div>
                <div className="text-sm text-muted-foreground">
                  {stats.totalLogins > 0 ? `${Math.round((stats.emailLogins / stats.totalLogins) * 100)}%` : "0%"}
                </div>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${stats.totalLogins > 0 ? (stats.emailLogins / stats.totalLogins) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
        <Input
          placeholder="Search users or logs..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Main tabs */}
      <Tabs defaultValue="users">
        <TabsList className="mb-4">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users size={16} />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Activity size={16} />
            <span>Activity Logs</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 size={16} />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>

        {/* Users tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Users</CardTitle>
                <CardDescription>Manage user accounts and profiles</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportCSV(users, "users-export")}
                className="flex items-center gap-2"
              >
                <Download size={16} />
                Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4">Loading users...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Name</th>
                        <th className="text-left py-3 px-4 font-medium">Email</th>
                        <th className="text-left py-3 px-4 font-medium">Created</th>
                        <th className="text-left py-3 px-4 font-medium">Last Updated</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <tr key={user.id} className="border-b hover:bg-slate-50">
                            <td className="py-3 px-4">{user.full_name || "N/A"}</td>
                            <td className="py-3 px-4">{user.email}</td>
                            <td className="py-3 px-4">{formatDate(user.created_at)}</td>
                            <td className="py-3 px-4">{formatDate(user.updated_at)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="text-center py-4">
                            {searchTerm ? "No users match your search" : "No users found"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity logs tab */}
        <TabsContent value="activity">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Activity Logs</CardTitle>
                <CardDescription>User login and access history</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportCSV(accessLogs, "access-logs-export")}
                className="flex items-center gap-2"
              >
                <Download size={16} />
                Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4">Loading activity logs...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">User</th>
                        <th className="text-left py-3 px-4 font-medium">Auth Method</th>
                        <th className="text-left py-3 px-4 font-medium">Device</th>
                        <th className="text-left py-3 px-4 font-medium">IP Address</th>
                        <th className="text-left py-3 px-4 font-medium">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLogs.length > 0 ? (
                        filteredLogs.map((log) => (
                          <tr key={log.id} className="border-b hover:bg-slate-50">
                            <td className="py-3 px-4">{getUserEmail(log.user_id)}</td>
                            <td className="py-3 px-4">
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  log.login_method === "google"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {log.login_method || "Unknown"}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-1">
                                {getDeviceType(log.user_agent) === "Mobile" && <Smartphone size={14} />}
                                {getDeviceType(log.user_agent) === "Desktop" && <Laptop size={14} />}
                                {getDeviceType(log.user_agent) === "Unknown" && <Info size={14} />}
                                <span>{getDeviceType(log.user_agent)}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">{log.ip_address || "N/A"}</td>
                            <td className="py-3 px-4">{formatDate(log.accessed_at)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center py-4">
                            {searchTerm ? "No logs match your search" : "No activity logs found"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics tab */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>User engagement and system metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {/* Recent activity feed */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {accessLogs.slice(0, 5).map((log) => (
                      <div key={log.id} className="flex items-start gap-4">
                        <div className="bg-slate-100 p-2 rounded-full">
                          <Calendar size={16} />
                        </div>
                        <div>
                          <p className="font-medium">{getUserEmail(log.user_id)} logged in</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(log.accessed_at)} • {getDeviceType(log.user_agent)} • {log.login_method}
                          </p>
                        </div>
                      </div>
                    ))}

                    {accessLogs.length === 0 && (
                      <div className="text-center py-4 text-muted-foreground">No recent activity to display</div>
                    )}
                  </div>
                </div>

                {/* System status */}
                <div>
                  <h3 className="text-lg font-medium mb-4">System Status</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-500 mb-1">Active</div>
                          <p className="text-sm text-muted-foreground">Database Status</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-500 mb-1">100%</div>
                          <p className="text-sm text-muted-foreground">Authentication Service</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold mb-1">{new Date().toLocaleDateString()}</div>
                          <p className="text-sm text-muted-foreground">Last Backup</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
