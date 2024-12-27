export interface SearchParams {
  [key: string]: string | string[] | undefined;
}

export type Option = {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
};

export interface DataTableFilterOption<TData> {
  id?: string;
  label: string;
  value: keyof TData | string;
  items: Option[];
  isMulti?: boolean;
}

export interface DataTableSearchableColumn<TData> {
  id: keyof TData | string;
  placeholder?: string;
}

export interface DataTableFilterableColumn<TData> {
  id: keyof TData;
  title: string;
  options: Option[] | null;
}

export interface DataTableHideColumn<TData> {
  id: keyof TData;
  value: boolean;
}
