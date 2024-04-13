"use server";

import * as cheerio from "cheerio";
import { CrawlBrandData, DataReturnType } from "../definitions";

export async function fetchFrom37(
  url: string
): Promise<DataReturnType | CrawlBrandData[]> {
  const res = await fetch(url);
  if (res.ok) {
    const page = await res.text();
    const $ = cheerio.load(page);
    const categoryList = $("#category-list");
    const phoneList = categoryList.children("li").get(0);

    if (!phoneList) {
      return {
        msg: "无法从该网址中导入数据, 请换一个网址",
        status: "error",
      };
    }

    const brandList = $($(phoneList)).children("ul");
    const list = brandList
      .map((i, el) => {
        const baseList = $(el).children("li");
        const brandName = baseList
          .children("a")
          .attr("title")
          ?.replace("手机", "")
          .trim();

        const models = baseList
          .children("ul")
          .children("li")
          .map((mi, mel) => {
            return {
              name: $(mel).children("a").attr("title"),
            };
          })
          .toArray();

        return {
          brandName,
          models,
        };
      })
      .toArray();

    return list;
  }

  return {
    msg: "无法从该网址中导入数据, 请换一个网址",
    status: "error",
  };
}
