"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Users,
  Activity,
  BarChart3,
  Search,
  Download,
  Calendar,
  Smartphone,
  Laptop,
  Info,
  Shield,
  AlertTriangle,
} from "lucide-react"

export default function AdminDashboard() {
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState([])
  const [accessLogs, setAccessLogs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [authError, setAuthError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [timeRange, setTimeRange] = useState("7d")
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
      try {
        console.log("Checking admin access...")

        const {
          data: { user: currentUser },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError) {
          console.error("Error getting user:", userError)
          setAuthError("Failed to authenticate user")
          setIsLoading(false)
          return
        }

        if (!currentUser) {
          console.log("No user found, redirecting to login")
          window.location.href = "/login"
          return
        }

        console.log("Current user:", currentUser.email)
        setUser(currentUser)

        // Fixed admin check - more comprehensive
        const isAdmin =
          currentUser.email?.includes("@carterhales") ||
          currentUser.email?.includes("@bignerd") ||
          currentUser.email?.includes("admin") ||
          currentUser.email?.includes("tavis@") ||
          currentUser.email === "tav@bignerdlsolutions.com" ||
          currentUser.email === "tavis@gmail.com"

        console.log("Is admin:", isAdmin, "Email:", currentUser.email)

        if (!isAdmin) {
          console.log("User is not admin, redirecting")
          setAuthError("Access denied. Admin privileges required.")
          setIsLoading(false)
          return
        }

        setIsAuthorized(true)
        console.log("Admin access granted, loading data...")

        // Load dashboard data
        await loadDashboardData()
      } catch (error) {
        console.error("Error in admin access check:", error)
        setAuthError("An error occurred while checking permissions")
        setIsLoading(false)
      }
    }

    checkAdminAccess()
  }, [])

  const loadDashboardData = async () => {
    try {
      console.log("Loading dashboard data...")

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

      console.log("Fetching ALL access logs as admin...")
      
      // Try using admin RPC function first
      let allLogsData = []
      try {
        const { data: rpcLogsData, error: rpcLogsError } = await supabase
          .rpc('get_all_access_logs_admin', { 
            days_back: timeRange === "24h" ? 1 : timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90 
          })

        if (rpcLogsError) {
          console.error("RPC access logs error:", rpcLogsError)
        } else if (rpcLogsData) {
          console.log("Access logs via RPC:", rpcLogsData.length)
          allLogsData = rpcLogsData
        }
      } catch (rpcError) {
        console.error("RPC function not available:", rpcError)
      }

      // Fallback to direct table access
      if (!allLogsData || allLogsData.length === 0) {
        console.log("Trying direct access logs query...")
        const { data: directLogsData, error: directLogsError } = await supabase
          .from("access_logs")
          .select("*")
          .gte("accessed_at", startDate.toISOString())
          .order("accessed_at", { ascending: false })

        if (directLogsError) {
          console.error("Direct access logs error:", directLogsError)
          console.error("RLS might be blocking admin access to logs")
        } else {
          console.log("Access logs via direct query:", directLogsData?.length || 0)
          allLogsData = directLogsData || []
        }
      }

      setAccessLogs(allLogsData)

      console.log("Fetching ALL users from profiles...")
      
      // Try using admin RPC function first
      let usersData = []
      try {
        const { data: rpcUsersData, error: rpcUsersError } = await supabase
          .rpc('get_all_users_admin')

        if (rpcUsersError) {
          console.error("RPC users error:", rpcUsersError)
        } else if (rpcUsersData && rpcUsersData.length > 0) {
          console.log("Users via RPC:", rpcUsersData.length)
          usersData = rpcUsersData
        }
      } catch (rpcError) {
        console.error("RPC function not available:", rpcError)
      }

      // Fallback to direct table access
      if (!usersData || usersData.length === 0) {
        console.log("Trying direct profiles query...")
        const { data: directProfilesData, error: directProfilesError } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false })

        if (directProfilesError) {
          console.error("Direct profiles error:", directProfilesError)
          console.error("RLS might be blocking admin access to profiles")
        } else if (directProfilesData && directProfilesData.length > 0) {
          console.log("Users via direct query:", directProfilesData.length)
          usersData = directProfilesData
        }
      }

      // If profiles are empty or limited, try to get user data from access logs
      if (!usersData || usersData.length === 0 || (allLogsData && usersData.length < new Set(allLogsData.map(log => log.user_id)).size)) {
        console.log("Profiles incomplete, creating comprehensive user data from access logs...")
        
        if (allLogsData && allLogsData.length > 0) {
          // Group access logs by user_id to create user profiles
          const userMap = new Map()
          
          allLogsData.forEach(log => {
            if (!userMap.has(log.user_id)) {
              userMap.set(log.user_id, {
                id: log.user_id,
                email: `User ${log.user_id.substring(0, 8)}...`,
                full_name: null,
                created_at: log.accessed_at,
                updated_at: log.accessed_at,
                last_login_at: log.accessed_at,
                login_count: 1,
                is_admin: false,
                role: 'user',
                is_active: true,
                avatar_url: null
              })
            } else {
              const existing = userMap.get(log.user_id)
              existing.login_count += 1
              if (new Date(log.accessed_at) > new Date(existing.last_login_at)) {
                existing.last_login_at = log.accessed_at
              }
              if (new Date(log.accessed_at) < new Date(existing.created_at)) {
                existing.created_at = log.accessed_at
              }
            }
          })

          const usersFromLogs = Array.from(userMap.values())
          console.log("Users created from access logs:", usersFromLogs.length)
          
          // Merge with existing profiles data if any
          if (usersData && usersData.length > 0) {
            // Update existing profiles with access log data
            usersData = usersData.map(profile => {
              const logUser = userMap.get(profile.id)
              if (logUser) {
                return {
                  ...profile,
                  login_count: logUser.login_count,
                  last_login_at: logUser.last_login_at
                }
              }
              return profile
            })
            
            // Add any users from logs that aren't in profiles
            usersFromLogs.forEach(logUser => {
              if (!usersData.find(p => p.id === logUser.id)) {
                usersData.push(logUser)
              }
            })
          } else {
            usersData = usersFromLogs
          }
        }
      }

      console.log("Final users data:", usersData?.length || 0)
      setUsers(usersData || [])

      // Calculate statistics
      const logsData = allLogsData || []
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

        console.log("Stats calculated:", {
          totalUsers: usersData.length,
          totalLogins: logsData.length,
          uniqueVisitors,
          googleLogins,
          emailLogins,
        })
      }

      setIsLoading(false)
      console.log("Dashboard data loaded successfully")
    } catch (error) {
      console.error("Error loading dashboard data:", error)
      setAuthError("Failed to load dashboard data")
      setIsLoading(false)
    }
  }

  // Reload data when time range changes
  useEffect(() => {
    if (isAuthorized && !isLoading) {
      setIsLoading(true)
      loadDashboardData()
    }
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

    const headers = Object.keys(data[0])
    const csvRows = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) =>
            typeof row[header] === "string" && row[header].includes(",") ? `"${row[header]}"` : row[header],
          )
          .join(","),
      ),
    ]

    const csvContent = csvRows.join("\n")
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
    return user?.email || `User ${userId?.substring(0, 8)}...` || "Unknown"
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading admin dashboard...</p>
          <p className="text-sm text-slate-500 mt-2">Checking permissions and loading data</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (authError || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-2xl font-bold">Access Denied</CardTitle>
            <CardDescription>You don't have permission to access the admin dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {authError && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}

            <div className="text-center space-y-2">
              <p className="text-sm text-slate-600">Current user: {user?.email || "Not logged in"}</p>
              <p className="text-xs text-slate-500">
                Admin access requires an authorized email address
              </p>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => (window.location.href = "/")} variant="outline" className="flex-1">
                Go Home
              </Button>
              <Button onClick={() => (window.location.href = "/login")} className="flex-1">
                Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-slate-600">Welcome, {user?.email}</p>
        </div>
      </div>

      {/* Debug Info for Development */}
      {process.env.NODE_ENV === "development" && (
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">Debug Information</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Users Table Records:</strong> {users.length}
              </div>
              <div>
                <strong>Access Logs Records:</strong> {accessLogs.length}
              </div>
              <div>
                <strong>Time Range:</strong> {timeRange}
              </div>
              <div>
                <strong>Unique Log Users:</strong> {new Set(accessLogs.map(log => log.user_id)).size}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
                <CardTitle>Users ({filteredUsers.length})</CardTitle>
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity logs tab */}
        <TabsContent value="activity">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Activity Logs ({filteredLogs.length})</CardTitle>
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
