import React from "react";
import DashboardNav from "../dashboard-nav";
import { routes } from "@/route/routes";

const Sidebar = () => {
  return (
    <nav className="relative hidden h-screen border-r pt-16 lg:block w-72">
      <div className="space-y-4 px-4">
        <div className="space-y-1">
          <h2 className="mb-2 px-4 text-xl font-semibold tracking-tight">
            Xintech - Admin
          </h2>
          <DashboardNav routes={routes} />
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
