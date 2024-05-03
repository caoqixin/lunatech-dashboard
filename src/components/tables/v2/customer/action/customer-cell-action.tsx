import { EditCustomer } from "./edit-customer";
import { Customer } from "@prisma/client";
import ViewItem from "@/components/tables/table-component/view-item";
import { getRepairsForCustomer } from "@/lib/actions/server/customers";

export default function CustomerCellAction(customer: Customer) {
  const { name, id } = customer;

  const loadData = async () => {
    const data = await getRepairsForCustomer(id);

    return data;
  };
  return (
    <div className="flex items-center gap-3 justify-end">
      <ViewItem
        title="维修记录"
        label={`${name} 的维修记录`}
        loadData={loadData}
        type="customers"
      />

      <EditCustomer {...customer} />
    </div>
  );
}
