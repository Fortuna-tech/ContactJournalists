interface AuthDebugPanelProps {
  route: string;
  authReady: boolean;
  sessionUserId: string | null;
  subscriptionStatus: "active" | "inactive" | "unknown" | "error";
  lastRedirectReason: string;
}

/**
 * Lightweight debug panel that only appears when ?debug=1 is in the URL.
 * Shows auth and subscription state for debugging redirect issues.
 */
const AuthDebugPanel = ({
  route,
  authReady,
  sessionUserId,
  subscriptionStatus,
  lastRedirectReason,
}: AuthDebugPanelProps) => {
  const statusColors: Record<string, string> = {
    active: "text-green-600",
    inactive: "text-yellow-600",
    unknown: "text-gray-500",
    error: "text-red-600",
  };

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg text-xs font-mono z-50 max-w-sm">
      <div className="font-bold text-yellow-400 mb-2">🔧 Auth Debug Panel</div>
      <div className="space-y-1">
        <div>
          <span className="text-gray-400">route:</span>{" "}
          <span className="text-blue-300">{route}</span>
        </div>
        <div>
          <span className="text-gray-400">authReady:</span>{" "}
          <span className={authReady ? "text-green-400" : "text-red-400"}>
            {authReady ? "true" : "false"}
          </span>
        </div>
        <div>
          <span className="text-gray-400">session.user.id:</span>{" "}
          <span className={sessionUserId ? "text-green-400" : "text-red-400"}>
            {sessionUserId ? sessionUserId.slice(0, 8) + "..." : "none"}
          </span>
        </div>
        <div>
          <span className="text-gray-400">subscription:</span>{" "}
          <span className={statusColors[subscriptionStatus] || "text-gray-400"}>
            {subscriptionStatus}
          </span>
        </div>
        <div>
          <span className="text-gray-400">lastRedirectReason:</span>{" "}
          <span className="text-purple-300">{lastRedirectReason}</span>
        </div>
      </div>
    </div>
  );
};

export default AuthDebugPanel;
