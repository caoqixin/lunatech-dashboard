import React from "react";
import DashboardNav from "../dashboard-nav";
import { routes } from "@/route/routes";

const Sidebar = () => {
  return (
    <nav className="sticky z-10 top-0 hidden h-screen pt-16 lg:block w-72 overflow-auto">
      <div className="space-y-4 px-4">
        <div className="space-y-1">
          <h2 className="mb-2 px-4 text-xl font-semibold text-center tracking-tight">
            Luna Tech
          </h2>
          <DashboardNav routes={routes} />
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
