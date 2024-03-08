import CategoryItemPage from "@/components/pages/categories/category-items-page";

export default function Page({ params }: { params: { categoryId: string } }) {
  const categoryId = parseInt(params.categoryId);

  return <CategoryItemPage categoryId={categoryId} />;
}
