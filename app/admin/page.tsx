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
  RefreshCw,
} from "lucide-react"

export default function AdminDashboard() {
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState([])
  const [accessLogs, setAccessLogs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
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

  // Helper function to get date cutoff based on time range
  const getDateCutoff = (range) => {
    const now = new Date()
    switch (range) {
      case "24h":
        return new Date(now.getTime() - 24 * 60 * 60 * 1000)
      case "7d":
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      case "30d":
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      case "90d":
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
      default:
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    }
  }

  // Helper functions defined early to avoid initialization errors
  const getUserEmail = (userId) => {
    const user = users.find((u) => u.id === userId)
    return user?.email || `User ${userId?.substring(0, 8)}...` || "Unknown"
  }

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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const exportCSV = (data, filename) => {
    if (!data || !data.length) return

    const headers = Object.keys(data[0])
    const csvRows = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) =>
            typeof row[header] === "string" && row[header]?.includes(",") ? `"${row[header]}"` : row[header],
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

        // Check if user is admin
        const isAdmin =
          currentUser.email?.includes("@carterhales") ||
          currentUser.email?.includes("@bignerdsolutions") ||
          currentUser.email?.includes("admin") ||
          currentUser.email === "tavis@gmail.com" ||
          currentUser.email === "tavis@carterhales.com" ||
          currentUser.email === "tav@bignerdsolutions.com"

        console.log("Is admin:", isAdmin, "Email:", currentUser.email)

        if (!isAdmin) {
          console.log("User is not admin")
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
      setIsRefreshing(true)
      console.log("Loading dashboard data via API...")

      // Fetch users via admin API (bypasses RLS) - include time range parameter
      const usersResponse = await fetch(`/api/admin/users?timeRange=${timeRange}`)
      if (!usersResponse.ok) {
        throw new Error(`Users API error: ${usersResponse.status}`)
      }
      const usersData = await usersResponse.json()
      console.log("Users fetched via API:", usersData.users?.length || 0)
      setUsers(usersData.users || [])

      // Fetch access logs via admin API (bypasses RLS)
      const logsResponse = await fetch(`/api/admin/logs?timeRange=${timeRange}`)
      if (!logsResponse.ok) {
        throw new Error(`Logs API error: ${logsResponse.status}`)
      }
      const logsData = await logsResponse.json()
      console.log("Access logs fetched via API:", logsData.logs?.length || 0)
      setAccessLogs(logsData.logs || [])

      // Calculate statistics
      const users = usersData.users || []
      const logs = logsData.logs || []

      if (users && logs) {
        const uniqueVisitors = new Set(logs.map((log) => log.user_id)).size
        const googleLogins = logs.filter((log) => log.login_method === "google").length
        const emailLogins = logs.filter((log) => log.login_method === "email").length

        setStats({
          totalUsers: users.length,
          totalLogins: logs.length,
          uniqueVisitors,
          googleLogins,
          emailLogins,
        })

        console.log("Stats calculated:", {
          totalUsers: users.length,
          totalLogins: logs.length,
          uniqueVisitors,
          googleLogins,
          emailLogins,
        })
      }

      setIsLoading(false)
      setIsRefreshing(false)
      console.log("Dashboard data loaded successfully")
    } catch (error) {
      console.error("Error loading dashboard data:", error)
      setAuthError(`Failed to load dashboard data: ${error.message}`)
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  // Reload data when time range changes
  useEffect(() => {
    if (isAuthorized && !isLoading) {
      console.log("Time range changed to:", timeRange, "- reloading data...")
      loadDashboardData()
    }
  }, [timeRange, isAuthorized])

  // Client-side filtering as backup (in case API doesn't handle time filtering properly)
  const getFilteredUsers = () => {
    const dateCutoff = getDateCutoff(timeRange)
    
    return users.filter((user) => {
      const matchesSearch =
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())

      // Filter by creation date or last login date within time range
      const createdAt = user.created_at ? new Date(user.created_at) : null
      const lastLogin = user.last_login_at ? new Date(user.last_login_at) : null
      
      const withinTimeRange = 
        (createdAt && createdAt >= dateCutoff) || 
        (lastLogin && lastLogin >= dateCutoff)

      return matchesSearch && withinTimeRange
    })
  }

  const getFilteredLogs = () => {
    const dateCutoff = getDateCutoff(timeRange)
    
    return accessLogs.filter((log) => {
      const matchesSearch =
        log.user_agent?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.login_method?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getUserEmail(log.user_id)?.toLowerCase().includes(searchTerm.toLowerCase())

      // Filter by access date within time range
      const accessedAt = log.accessed_at ? new Date(log.accessed_at) : null
      const withinTimeRange = accessedAt && accessedAt >= dateCutoff

      return matchesSearch && withinTimeRange
    })
  }

  // Get filtered data
  const filteredUsers = getFilteredUsers()
  const filteredLogs = getFilteredLogs()

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
              <p className="text-xs text-slate-500">Admin access requires an authorized email address</p>
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
        <Button
          onClick={loadDashboardData}
          variant="outline"
          size="sm"
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Refreshing..." : "Refresh Data"}
        </Button>
      </div>

      {/* Debug Info */}
      <Card className="mb-6 border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800">Debug Information</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Total Users (All Time):</strong> {users.length}
            </div>
            <div>
              <strong>Filtered Users ({timeRange}):</strong> {filteredUsers.length}
            </div>
            <div>
              <strong>Total Access Logs (All Time):</strong> {accessLogs.length}
            </div>
            <div>
              <strong>Filtered Access Logs ({timeRange}):</strong> {filteredLogs.length}
            </div>
            <div>
              <strong>Time Range:</strong> {timeRange}
            </div>
            <div>
              <strong>Date Cutoff:</strong> {getDateCutoff(timeRange).toLocaleString()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time range selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button 
          variant={timeRange === "24h" ? "default" : "outline"} 
          onClick={() => {
            console.log("Setting time range to 24h")
            setTimeRange("24h")
          }} 
          size="sm"
        >
          Last 24 Hours
        </Button>
        <Button 
          variant={timeRange === "7d" ? "default" : "outline"} 
          onClick={() => {
            console.log("Setting time range to 7d")
            setTimeRange("7d")
          }} 
          size="sm"
        >
          Last 7 Days
        </Button>
        <Button 
          variant={timeRange === "30d" ? "default" : "outline"} 
          onClick={() => {
            console.log("Setting time range to 30d")
            setTimeRange("30d")
          }} 
          size="sm"
        >
          Last 30 Days
        </Button>
        <Button 
          variant={timeRange === "90d" ? "default" : "outline"} 
          onClick={() => {
            console.log("Setting time range to 90d")
            setTimeRange("90d")
          }} 
          size="sm"
        >
          Last 90 Days
        </Button>
      </div>

      {/* Stats cards - now showing filtered data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Users ({timeRange})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredUsers.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Logins ({timeRange})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredLogs.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Unique Visitors ({timeRange})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(filteredLogs.map((log) => log.user_id)).size}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredUsers.length > 0 && filteredLogs.length > 0
                ? `${Math.round((new Set(filteredLogs.map((log) => log.user_id)).size / filteredUsers.length) * 100)}%`
                : "0%"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Login methods visualization - based on filtered logs */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Login Methods ({timeRange})</CardTitle>
          <CardDescription>Distribution of authentication methods used</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm font-medium">Google</div>
                <div className="text-sm text-muted-foreground">
                  {filteredLogs.length > 0 
                    ? `${Math.round((filteredLogs.filter(log => log.login_method === "google").length / filteredLogs.length) * 100)}%` 
                    : "0%"
                  }
                </div>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ 
                    width: `${filteredLogs.length > 0 
                      ? (filteredLogs.filter(log => log.login_method === "google").length / filteredLogs.length) * 100 
                      : 0
                    }%` 
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm font-medium">Email</div>
                <div className="text-sm text-muted-foreground">
                  {filteredLogs.length > 0 
                    ? `${Math.round((filteredLogs.filter(log => log.login_method === "email").length / filteredLogs.length) * 100)}%` 
                    : "0%"
                  }
                </div>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ 
                    width: `${filteredLogs.length > 0 
                      ? (filteredLogs.filter(log => log.login_method === "email").length / filteredLogs.length) * 100 
                      : 0
                    }%` 
                  }}
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
            <span>Users ({filteredUsers.length})</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Activity size={16} />
            <span>Activity Logs ({filteredLogs.length})</span>
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
                <CardDescription>Users active in the selected time range</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportCSV(filteredUsers, `users-export-${timeRange}`)}
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
                      <th className="text-left py-3 px-4 font-medium">Last Login</th>
                      <th className="text-left py-3 px-4 font-medium">Login Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-slate-50">
                          <td className="py-3 px-4">{user.full_name || "N/A"}</td>
                          <td className="py-3 px-4">{user.email}</td>
                          <td className="py-3 px-4">{formatDate(user.created_at)}</td>
                          <td className="py-3 px-4">{formatDate(user.last_login_at)}</td>
                          <td className="py-3 px-4">{user.login_count || 0}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center py-4">
                          {searchTerm 
                            ? "No users match your search criteria" 
                            : `No users found in the ${timeRange} time range`
                          }
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
                <CardDescription>User login and access history for {timeRange}</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportCSV(filteredLogs, `access-logs-export-${timeRange}`)}
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
                      <th className="text-left py-3 px-4 font-medium">User Agent</th>
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
                          <td className="py-3 px-4">
                            <div className="max-w-xs truncate text-xs text-muted-foreground" title={log.user_agent}>
                              {log.user_agent || "N/A"}
                            </div>
                          </td>
                          <td className="py-3 px-4">{log.ip_address || "N/A"}</td>
                          <td className="py-3 px-4">{formatDate(log.accessed_at)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center py-4">
                          {searchTerm 
                            ? "No logs match your search criteria" 
                            : `No activity logs found in the ${timeRange} time range`
                          }
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
              <CardTitle>Analytics ({timeRange})</CardTitle>
              <CardDescription>User engagement and system metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {/* Recent activity feed - showing filtered logs */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {filteredLogs.slice(0, 5).map((log) => (
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

                    {filteredLogs.length === 0 && (
                      <div className="text-center py-4 text-muted-foreground">
                        No recent activity to display for {timeRange}
                      </div>
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

                {/* User engagement metrics */}
                <div>
                  <h3 className="text-lg font-medium mb-4">User Engagement</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold mb-1">
                            {filteredUsers.length > 0 
                              ? Math.round(filteredLogs.length / filteredUsers.length * 100) / 100
                              : 0
                            }
                          </div>
                          <p className="text-sm text-muted-foreground">Avg. Logins per User</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold mb-1">
                            {filteredUsers.length > 0 && filteredLogs.length > 0
                              ? `${Math.round((new Set(filteredLogs.map(log => log.user_id)).size / filteredUsers.length) * 100)}%`
                              : "0%"
                            }
                          </div>
                          <p className="text-sm text-muted-foreground">Active User Rate</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Device breakdown */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Device Usage</h3>
                  <div className="space-y-4">
                    {["Mobile", "Desktop", "Tablet", "Unknown"].map((deviceType) => {
                      const deviceCount = filteredLogs.filter(log => getDeviceType(log.user_agent) === deviceType).length
                      const percentage = filteredLogs.length > 0 ? (deviceCount / filteredLogs.length) * 100 : 0
                      
                      return (
                        <div key={deviceType}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-sm font-medium flex items-center gap-2">
                              {deviceType === "Mobile" && <Smartphone size={14} />}
                              {deviceType === "Desktop" && <Laptop size={14} />}
                              {deviceType === "Unknown" && <Info size={14} />}
                              {deviceType}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {Math.round(percentage)}% ({deviceCount})
                            </div>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                deviceType === "Mobile" ? "bg-purple-500" :
                                deviceType === "Desktop" ? "bg-orange-500" :
                                deviceType === "Tablet" ? "bg-cyan-500" : "bg-gray-500"
                              }`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      )
                    })}
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
