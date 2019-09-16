export interface IProductCategoryFragmentProductCategorySelect {
  id: string;
  title: string;
  child_category: {
    id: string;
    title: string;
    child_category: {
      id: string;
      title: string;
    };
  };
}
