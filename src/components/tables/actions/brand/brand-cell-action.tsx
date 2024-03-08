import { Brand } from "@/lib/definitions";
import { EditBrand } from "./edit-brand";
import { DeleteBrand } from "./delete-brand";

const BrandCellAction = (brand: Brand) => {
  return (
    <div className="flex items-center gap-3 justify-end">
      <EditBrand {...brand} />
      <DeleteBrand {...brand} />
    </div>
  );
};

export default BrandCellAction;
