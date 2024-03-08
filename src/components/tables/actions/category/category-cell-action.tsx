import { Category } from "@/lib/definitions";
import { EditCategory } from "./edit-category";
import { DeleteCategory } from "./delete-category";

const CategoryCellAction = (category: Category) => {
  return (
    <div className="flex items-center gap-3 justify-end">
      <EditCategory {...category} />
      <DeleteCategory {...category} />
    </div>
  );
};

export default CategoryCellAction;
