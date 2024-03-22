import { EditSupplier } from "./edit-supplier";
import { DeleteSupplier } from "./delete-supplier";
import ViewInfo from "./view-info";
import { Supplier } from "@prisma/client";

const SupplierCellAction = (supplier: Supplier) => {
  return (
    <div className="flex items-center gap-3 justify-end">
      <ViewInfo {...supplier} />
      <EditSupplier {...supplier} />
      <DeleteSupplier {...supplier} />
    </div>
  );
};

export default SupplierCellAction;
