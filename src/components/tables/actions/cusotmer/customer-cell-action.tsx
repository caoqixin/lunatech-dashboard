import { Customer } from "@/lib/definitions";
import { EditCustomer } from "./edit-customer";
import ViewInfo from "./view-info";
import ShowRepairData from "./show-repairs";

const CustomerCellAction = (customer: Customer) => {
  return (
    <div className="flex items-center gap-3 justify-end">
      <ViewInfo name={customer.name}>
        {" "}
        <ShowRepairData customerId={customer.id} />
      </ViewInfo>
      <EditCustomer {...customer} />
    </div>
  );
};

export default CustomerCellAction;
