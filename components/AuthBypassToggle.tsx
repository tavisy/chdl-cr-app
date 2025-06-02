"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, ShieldOff, AlertTriangle, Copy, Check } from "lucide-react"
import { shouldBypassAuth } from "@/lib/auth-bypass"

export default function AuthBypassToggle() {
  const [bypassEnabled, setBypassEnabled] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setBypassEnabled(shouldBypassAuth())
  }, [])

  const copyEnvVariable = async () => {
    try {
      await navigator.clipboard.writeText("NEXT_PUBLIC_BYPASS_AUTH=true")
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {bypassEnabled ? (
            <ShieldOff className="h-5 w-5 text-red-500" />
          ) : (
            <Shield className="h-5 w-5 text-green-500" />
          )}
          Authentication Control
        </CardTitle>
        <CardDescription>Temporarily disable authentication for web crawlers and indexing</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h4 className="font-medium">Current Status</h4>
            <p className="text-sm text-muted-foreground">
              Authentication is currently {bypassEnabled ? "DISABLED" : "ENABLED"}
            </p>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              bypassEnabled ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
            }`}
          >
            {bypassEnabled ? "BYPASS ACTIVE" : "PROTECTED"}
          </div>
        </div>

        {bypassEnabled && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Warning:</strong> Authentication is currently disabled. All site content is publicly accessible
              without login.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          <h4 className="font-medium">How to Control Authentication</h4>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              <strong>To DISABLE authentication (for crawling):</strong>
            </p>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded border">
              <code className="flex-1 text-sm">NEXT_PUBLIC_BYPASS_AUTH=true</code>
              <Button variant="outline" size="sm" onClick={copyEnvVariable} className="h-8 px-2">
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              <strong>To ENABLE authentication (normal operation):</strong>
            </p>
            <div className="p-3 bg-gray-50 rounded border">
              <code className="text-sm">NEXT_PUBLIC_BYPASS_AUTH=false</code>
              <br />
              <span className="text-xs text-muted-foreground">or remove the variable entirely</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <h4 className="font-medium mb-2">Instructions</h4>
          <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
            <li>Add the environment variable to your deployment platform</li>
            <li>Redeploy the application</li>
            <li>Verify the bypass is working by visiting the site in incognito mode</li>
            <li>Run your web crawler</li>
            <li>Remove/disable the environment variable when crawling is complete</li>
            <li>Redeploy to restore authentication</li>
          </ol>
        </div>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Security Note:</strong> Only use this bypass temporarily. Always re-enable authentication after
            crawling is complete.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
