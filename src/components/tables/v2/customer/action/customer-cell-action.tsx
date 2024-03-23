import { EditCustomer } from "./edit-customer";
import ViewInfo from "./view-info";
import ShowRepairData from "./show-repairs";
import { Suspense } from "react";
import { Customer } from "@prisma/client";

const CustomerCellAction = (customer: Customer) => {
  return (
    <div className="flex items-center gap-3 justify-end">
      <ViewInfo name={customer.name}>
        {" "}
        <Suspense fallback={<div>loading....</div>}>
          <ShowRepairData customerId={customer.id} />
        </Suspense>
      </ViewInfo>
      <EditCustomer {...customer} />
    </div>
  );
};

export default CustomerCellAction;
