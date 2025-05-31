"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth/AuthProvider"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Users,
  Activity,
  BarChart3,
  Shield,
  Search,
  Download,
  Globe,
  Smartphone,
  Monitor,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
} from "lucide-react"
import { createClient } from "@/lib/supabase"
import type { Profile, AccessLog } from "@/lib/supabase"

interface DashboardStats {
  totalUsers: number
  totalLogins: number
  uniqueVisitors: number
  avgSessionTime: number
  topLoginMethods: { method: string; count: number }[]
  recentActivity: AccessLog[]
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [users, setUsers] = useState<Profile[]>([])
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState("7") // days
  const [error, setError] = useState("")

  const supabase = createClient()

  // Check if user is admin (you can implement your own admin logic)
  const isAdmin =
    user?.email?.includes("admin") || user?.email?.includes("@bignerd") || user?.email?.includes("@carterhales")

  useEffect(() => {
    if (isAdmin) {
      loadDashboardData()
    }
  }, [isAdmin, dateFilter])

  const loadDashboardData = async () => {
    try {
      setLoading(true)

      // Calculate date range
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - Number.parseInt(dateFilter))

      // Load users
      const { data: usersData, error: usersError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })

      if (usersError) throw usersError

      // Load access logs
      const { data: logsData, error: logsError } = await supabase
        .from("access_logs")
        .select("*")
        .gte("accessed_at", startDate.toISOString())
        .lte("accessed_at", endDate.toISOString())
        .order("accessed_at", { ascending: false })

      if (logsError) throw logsError

      setUsers(usersData || [])
      setAccessLogs(logsData || [])

      // Calculate stats
      const uniqueUserIds = new Set(logsData?.map((log) => log.user_id) || [])
      const loginMethods =
        logsData?.reduce(
          (acc, log) => {
            const method = log.login_method || "unknown"
            acc[method] = (acc[method] || 0) + 1
            return acc
          },
          {} as Record<string, number>,
        ) || {}

      const topLoginMethods = Object.entries(loginMethods)
        .map(([method, count]) => ({ method, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

      setStats({
        totalUsers: usersData?.length || 0,
        totalLogins: logsData?.length || 0,
        uniqueVisitors: uniqueUserIds.size,
        avgSessionTime: 0, // You can calculate this based on your needs
        topLoginMethods,
        recentActivity: logsData?.slice(0, 10) || [],
      })
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const exportData = async (type: "users" | "logs") => {
    try {
      const data = type === "users" ? users : accessLogs
      const csv = convertToCSV(data)
      downloadCSV(csv, `${type}-export-${new Date().toISOString().split("T")[0]}.csv`)
    } catch (error: any) {
      setError(`Failed to export ${type}: ${error.message}`)
    }
  }

  const convertToCSV = (data: any[]) => {
    if (!data.length) return ""

    const headers = Object.keys(data[0]).join(",")
    const rows = data
      .map((row) =>
        Object.values(row)
          .map((value) => (typeof value === "string" ? `"${value.replace(/"/g, '""')}"` : value))
          .join(","),
      )
      .join("\n")

    return `${headers}\n${rows}`
  }

  const downloadCSV = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const filteredUsers = users.filter(
    (user) =>
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredLogs = accessLogs.filter(
    (log) =>
      log.user_agent?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.login_method?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="p-8 max-w-md mx-auto">
          <div className="text-center">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h1>
            <p className="text-slate-600">You don't have permission to access the admin dashboard.</p>
          </div>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-slate-900 text-white py-8">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-slate-300">Crown Royal Strategic Report Analytics</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="dateFilter" className="text-slate-300">
                  Period:
                </Label>
                <select
                  id="dateFilter"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="bg-slate-800 text-white border border-slate-700 rounded px-3 py-1 text-sm"
                >
                  <option value="1">Last 24 hours</option>
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Overview */}
        {stats && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Total Users</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.totalUsers}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Total Logins</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.totalLogins}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Unique Visitors</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.uniqueVisitors}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Conversion Rate</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {stats.totalUsers > 0 ? Math.round((stats.uniqueVisitors / stats.totalUsers) * 100) : 0}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Login Methods Chart */}
        {stats && stats.topLoginMethods.length > 0 && (
          <Card className="p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4 text-slate-900">Login Methods</h3>
            <div className="space-y-3">
              {stats.topLoginMethods.map((method, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        method.method === "google"
                          ? "bg-red-500"
                          : method.method === "email"
                            ? "bg-blue-500"
                            : "bg-gray-500"
                      }`}
                    ></div>
                    <span className="text-slate-700 capitalize">{method.method}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-slate-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          method.method === "google"
                            ? "bg-red-500"
                            : method.method === "email"
                              ? "bg-blue-500"
                              : "bg-gray-500"
                        }`}
                        style={{
                          width: `${stats.totalLogins > 0 ? (method.count / stats.totalLogins) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-slate-900 w-8">{method.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Tabs for detailed data */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="activity">Activity Logs</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">User Management</h3>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button onClick={() => exportData("users")} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-medium text-slate-900">User</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-900">Email</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-900">Created</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-900">Last Updated</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-900">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-purple-600">
                                {user.full_name?.charAt(0) || user.email?.charAt(0) || "?"}
                              </span>
                            </div>
                            <span className="font-medium text-slate-900">{user.full_name || "No name"}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-700">{user.email}</td>
                        <td className="py-3 px-4 text-slate-600 text-sm">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-slate-600 text-sm">
                          {new Date(user.updated_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredUsers.length === 0 && (
                <div className="text-center py-8 text-slate-500">No users found matching your search.</div>
              )}
            </Card>
          </TabsContent>

          {/* Activity Logs Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Access Logs</h3>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search logs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button onClick={() => exportData("logs")} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-medium text-slate-900">Time</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-900">User</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-900">Method</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-900">Device</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-900">IP Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map((log) => {
                      const user = users.find((u) => u.id === log.user_id)
                      const deviceType = getDeviceType(log.user_agent)

                      return (
                        <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-slate-400" />
                              <span className="text-sm text-slate-700">
                                {new Date(log.accessed_at).toLocaleString()}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-slate-900">{user?.email || "Unknown User"}</span>
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant="outline"
                              className={
                                log.login_method === "google"
                                  ? "border-red-200 text-red-700"
                                  : log.login_method === "email"
                                    ? "border-blue-200 text-blue-700"
                                    : "border-gray-200 text-gray-700"
                              }
                            >
                              {log.login_method || "unknown"}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              {deviceType === "mobile" ? (
                                <Smartphone className="h-4 w-4 text-slate-400" />
                              ) : deviceType === "tablet" ? (
                                <Monitor className="h-4 w-4 text-slate-400" />
                              ) : (
                                <Monitor className="h-4 w-4 text-slate-400" />
                              )}
                              <span className="text-sm text-slate-600 capitalize">{deviceType}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4 text-slate-400" />
                              <span className="text-sm text-slate-600">{log.ip_address || "Unknown"}</span>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {filteredLogs.length === 0 && (
                <div className="text-center py-8 text-slate-500">No access logs found matching your search.</div>
              )}
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-slate-900">Recent Activity</h3>
                <div className="space-y-3">
                  {stats?.recentActivity.slice(0, 5).map((log, index) => {
                    const user = users.find((u) => u.id === log.user_id)
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-900">{user?.email || "Unknown User"}</p>
                          <p className="text-xs text-slate-500">{new Date(log.accessed_at).toLocaleString()}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {log.login_method}
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-slate-900">System Health</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">Database Status</span>
                    <Badge className="bg-green-100 text-green-700">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Healthy
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">Authentication Service</span>
                    <Badge className="bg-green-100 text-green-700">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Online
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">Last Backup</span>
                    <span className="text-sm text-slate-600">{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">Uptime</span>
                    <span className="text-sm text-slate-600">99.9%</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Helper function to determine device type from user agent
function getDeviceType(userAgent: string | null): "mobile" | "tablet" | "desktop" {
  if (!userAgent) return "desktop"

  const ua = userAgent.toLowerCase()

  if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone")) {
    return "mobile"
  } else if (ua.includes("tablet") || ua.includes("ipad")) {
    return "tablet"
  } else {
    return "desktop"
  }
}
