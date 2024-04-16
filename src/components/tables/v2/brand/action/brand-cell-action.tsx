import { EditBrand } from "./edit-brand";
import { DeleteBrand } from "./delete-brand";
import { Brand } from "@prisma/client";

const BrandCellAction = (brand: Brand) => {
  return (
    <div className="flex items-center gap-3 justify-end">
      <EditBrand {...brand} />
      <DeleteBrand {...brand} />
    </div>
  );
};

export default BrandCellAction;
