import { type ComponentType } from "react";

/**
 * 搜索参数接口
 */
export interface SearchParams {
  [key: string]: string | string[] | undefined;
}

/**
 * 选项接口
 */
export interface Option {
  /**
   * 选项显示文本
   */
  label: string;

  /**
   * 选项值
   */
  value: string;

  /**
   * 选项图标
   */
  icon?: ComponentType<{ className?: string }>;
}
/**
 * 表格过滤选项接口
 */
export interface DataTableFilterOption<TData> {
  /**
   * 过滤选项ID
   */
  id?: string;

  /**
   * 过滤选项显示文本
   */
  label: string;

  /**
   * 过滤选项值
   */
  value: keyof TData | string;

  /**
   * 过滤选项列表
   */
  items: Option[];

  /**
   * 是否多选
   * @default false
   */
  isMulti?: boolean;
}

/**
 * 表格可搜索列接口
 */
export interface DataTableSearchableColumn<TData> {
  /**
   * 列ID，用于搜索
   */
  id: keyof TData | string;

  /**
   * 搜索输入框占位文本
   */
  placeholder?: string;
}

/**
 * 表格可过滤列接口
 */
export interface DataTableFilterableColumn<TData> {
  /**
   * 列ID
   */
  id: keyof TData;

  /**
   * 列标题
   */
  title: string;

  /**
   * 过滤选项
   */
  options: Option[] | null;
}

/**
 * 表格可隐藏列接口
 */
export interface DataTableHideColumn<TData> {
  /**
   * 列ID
   */
  id: keyof TData;

  /**
   * 是否隐藏
   */
  value: boolean;
}

/**
 * 表格状态接口
 */
export interface DataTableState {
  /**
   * 当前页码
   */
  page: number;

  /**
   * 每页显示数量
   */
  perPage: number;

  /**
   * 排序信息
   */
  sort?: string;
}
