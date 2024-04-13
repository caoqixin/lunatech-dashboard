"use server";

import { fetchFrom37 } from "../crawler/37smart";
import { DataReturnType, CrawlBrandData } from "@/lib/definitions";
import { importBrandAndPhone } from "./phone";

interface UrlAccept {
  id: string;
  url: string;
}

const ACCEPT_URL_LIST = [
  {
    id: "37Smart",
    url: "https://www.37smart.com/zh/",
  },
];

function getAcceptUrlList(list: UrlAccept[]) {
  return list.map(({ url }) => url);
}

function getAccetId(list: UrlAccept[], url: string) {
  return list.find((value) => value.url == url)!;
}

async function fetchUrl(
  accept: UrlAccept
): Promise<DataReturnType | CrawlBrandData[]> {
  if (accept.id === "37Smart") {
    const response = await fetchFrom37(accept.url);

    if ((response as DataReturnType).status == "error") {
      return {
        msg: "无法从该网址中导入数据, 请换一个网址",
        status: "error",
      };
    }

    return response as CrawlBrandData[];
  }

  return {
    msg: "无法从该网址中导入数据, 请换一个网址",
    status: "error",
  };
}

export async function importFromUrl(url: string): Promise<DataReturnType> {
  if (!getAcceptUrlList(ACCEPT_URL_LIST).includes(url)) {
    return {
      msg: "无法从该网址中导入数据, 请换一个网址",
      status: "error",
    };
  }

  // 爬取网址
  const acceptId = getAccetId(ACCEPT_URL_LIST, url);

  const res = await fetchUrl(acceptId);

  if ((res as DataReturnType).status == "error") {
    return {
      msg: "无法从该网址中导入数据, 请换一个网址",
      status: "error",
    };
  }

  const isSuccess = await importBrandAndPhone(res as CrawlBrandData[]);

  if (!isSuccess) {
    return {
      msg: "导入失败, 请重试",
      status: "error",
    };
  }

  return {
    msg: "导入成功",
    status: "success",
  };
}
