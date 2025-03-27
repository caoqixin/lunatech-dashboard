import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

type UseTabQueryParamOptions = {
  defaultTab?: string;
};

const useTabQueryParam = ({ defaultTab }: UseTabQueryParamOptions) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 获取当前的 tab 值，如果没有则使用默认值
  const tab = useMemo(
    () => searchParams.get("tab") || defaultTab,
    [searchParams, defaultTab]
  );

  // 更新 tab 查询参数
  const setTab = useCallback(
    (value: string) => {
      if (value === tab) return; // 避免重复更新
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", value);

      router.replace(`?${params.toString()}`, { scroll: false }); // 避免页面滚动
    },
    [router, searchParams, tab]
  );

  return { tab, setTab };
};

export default useTabQueryParam;
