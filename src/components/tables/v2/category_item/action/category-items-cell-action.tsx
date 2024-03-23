import { EditCategoryItems } from "./edit-category-items";
import { DeleteCategoryItems } from "./delete-category-items";
import { CategoryItem } from "@prisma/client";

const CategoryItemsCellAction = (category: CategoryItem) => {
  return (
    <div className="flex items-center gap-3 justify-end">
      <EditCategoryItems {...category} />
      <DeleteCategoryItems {...category} />
    </div>
  );
};

export default CategoryItemsCellAction;
