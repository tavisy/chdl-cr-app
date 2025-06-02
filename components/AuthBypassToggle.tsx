"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Copy, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { getBypassStatus } from "@/lib/auth-bypass"

export default function AuthBypassToggle() {
  const [bypassStatus, setBypassStatus] = useState<{
    isActive: boolean
    reason: string
    envValue: string | undefined
  }>({ isActive: false, reason: "", envValue: undefined })

  const [copied, setCopied] = useState<string>("")

  useEffect(() => {
    setBypassStatus(getBypassStatus())
  }, [])

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(label)
      setTimeout(() => setCopied(""), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Authentication Bypass Control
              {bypassStatus.isActive ? (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  ACTIVE
                </Badge>
              ) : (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  DISABLED
                </Badge>
              )}
            </CardTitle>
            <CardDescription>Temporarily disable authentication for web crawlers and public access</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {bypassStatus.isActive && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Security Warning:</strong> Authentication is currently bypassed. All site content is publicly
              accessible without login.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium mb-2">Current Status</h4>
            <div className="flex items-center gap-2">
              {bypassStatus.isActive ? (
                <XCircle className="h-4 w-4 text-red-500" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
              <span className="text-sm">{bypassStatus.reason}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Environment value: {bypassStatus.envValue || "not set"}
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="text-sm font-medium mb-3">Environment Variable Controls</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-muted rounded">
                <div>
                  <code className="text-xs">NEXT_PUBLIC_BYPASS_AUTH=true</code>
                  <div className="text-xs text-muted-foreground">Enable bypass (disable auth)</div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard("NEXT_PUBLIC_BYPASS_AUTH=true", "enable")}
                >
                  <Copy className="h-3 w-3 mr-1" />
                  {copied === "enable" ? "Copied!" : "Copy"}
                </Button>
              </div>

              <div className="flex items-center justify-between p-2 bg-muted rounded">
                <div>
                  <code className="text-xs">NEXT_PUBLIC_BYPASS_AUTH=false</code>
                  <div className="text-xs text-muted-foreground">Disable bypass (enable auth)</div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard("NEXT_PUBLIC_BYPASS_AUTH=false", "disable")}
                >
                  <Copy className="h-3 w-3 mr-1" />
                  {copied === "disable" ? "Copied!" : "Copy"}
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="text-sm font-medium mb-2">Instructions</h4>
            <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Copy the desired environment variable value above</li>
              <li>Go to your Vercel project settings → Environment Variables</li>
              <li>Update the NEXT_PUBLIC_BYPASS_AUTH variable</li>
              <li>Redeploy your application</li>
              <li>Verify the change by visiting the site in incognito mode</li>
            </ol>
          </div>

          {bypassStatus.isActive && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Remember:</strong> Re-enable authentication after crawling is complete by setting the
                environment variable to <code>false</code> or removing it entirely.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
