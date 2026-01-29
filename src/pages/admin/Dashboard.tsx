import { Users, Upload, Megaphone, Image } from "lucide-react";
import { Link } from "react-router-dom";
import { adminTheme } from "@/styles/adminTheme";

export default function AdminDashboard() {
  return (
    <div className={adminTheme.container}>
      <div className={adminTheme.pageHeader}>
        <h1 className={adminTheme.pageTitle} style={adminTheme.pageTitleStyle}>
          Admin Dashboard
        </h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Link to="/admin/journalists">
          <div className={adminTheme.card + " " + adminTheme.cardPad + " " + adminTheme.cardHover + " cursor-pointer"}>
            <div className="flex items-center justify-between mb-3">
              <h3 className={adminTheme.cardTitle}>Manage Journalists</h3>
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-sm text-slate-500">
              View, edit, and create journalist profiles
            </p>
          </div>
        </Link>

        <Link to="/admin/import">
          <div className={adminTheme.card + " " + adminTheme.cardPad + " " + adminTheme.cardHover + " cursor-pointer"}>
            <div className="flex items-center justify-between mb-3">
              <h3 className={adminTheme.cardTitle}>CSV Import</h3>
              <Upload className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-sm text-slate-500">
              Bulk import journalist profiles from CSV files
            </p>
          </div>
        </Link>

        <Link to="/admin/banners">
          <div className={adminTheme.card + " " + adminTheme.cardPad + " " + adminTheme.cardHover + " cursor-pointer"}>
            <div className="flex items-center justify-between mb-3">
              <h3 className={adminTheme.cardTitle}>Banner Management</h3>
              <Image className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-sm text-slate-500">
              Create and manage dashboard banners for users
            </p>
          </div>
        </Link>

        <Link to="/admin/story-requests">
          <div className={adminTheme.card + " " + adminTheme.cardPad + " " + adminTheme.cardHover + " cursor-pointer"}>
            <div className="flex items-center justify-between mb-3">
              <h3 className={adminTheme.cardTitle}>Story Request Broadcasts</h3>
              <Megaphone className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-sm text-slate-500">
              Create and broadcast story requests to journalists
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
