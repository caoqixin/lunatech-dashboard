"use client";

import { Component } from "@/lib/types";
import { ViewComponent } from "@/views/component/components/view-component";
import { DeleteComponent } from "@/views/component/components/delete-component";
import { EditComponent } from "@/views/component/components/edit-component";

interface ComponentActionWrapperProps {
  component: Component;
}

export const ComponentActionWrapper = ({
  component,
}: ComponentActionWrapperProps) => {
  return (
    <div className="flex items-center justify-end gap-2">
      <ViewComponent component={component} />
      <EditComponent component={component} />
      <DeleteComponent component={component} />
    </div>
  );
};

export default ComponentActionWrapper;
