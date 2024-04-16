"use server";

import * as cheerio from "cheerio";
import { CrawlBrandData, DataReturnType } from "../definitions";

function fetchPhone(
  $: cheerio.CheerioAPI,
  list?: cheerio.Element
): DataReturnType | CrawlBrandData[] {
  if (!list) {
    return {
      msg: "无法从该网址中导入数据, 请换一个网址",
      status: "error",
    };
  }

  const brandList = $($(list)).children("ul");
  const result = brandList
    .map((i, el) => {
      const baseList = $(el).children("li");
      const brandName = baseList
        .children("a")
        .attr("title")
        ?.replace("手机", "")
        .replace("iPhone&iPod", "")
        .trim();

      const models = baseList
        .children("ul")
        .children("li")
        .map((mi, mel) => {
          return {
            name: $(mel).children("a").attr("title"),
            isTablet: false,
          };
        })
        .toArray();

      return {
        brandName,
        models,
      };
    })
    .toArray();

  return result;
}

function fetchTablet(
  $: cheerio.CheerioAPI,
  list?: cheerio.Element
): DataReturnType | CrawlBrandData[] {
  if (!list) {
    return {
      msg: "无法从该网址中导入数据, 请换一个网址",
      status: "error",
    };
  }

  const brandList = $($(list)).children("ul");

  const result = brandList
    .map((i, el) => {
      const baseList = $(el).children("li");
      const brandName = baseList
        .children("a")
        .attr("title")
        ?.replace("Tablet", "")
        .replace("MiPad", "")
        .replace("iPad", "")
        .trim();

      const resortedName = brandName?.split("/")[1];

      const models = baseList
        .children("ul")
        .children("li")
        .map((mi, mel) => {
          return {
            name: $(mel).children("a").attr("title"),
            isTablet: true,
          };
        })
        .toArray();

      return {
        brandName: resortedName ?? brandName,
        models,
      };
    })
    .toArray();

  return result;
}

function mergeData(
  phones: CrawlBrandData[],
  tablets: CrawlBrandData[]
): CrawlBrandData[] {
  const mergedArr = phones.concat(tablets).reduce((acc, obj) => {
    const existingBrand = acc.find(
      (brand) => brand.brandName === obj.brandName
    );
    if (existingBrand) {
      existingBrand.models = existingBrand.models.concat(obj.models);
    } else {
      acc.push(obj);
    }
    return acc;
  }, [] as CrawlBrandData[]);

  return mergedArr;
}

export async function fetchFrom37(
  url: string
): Promise<DataReturnType | CrawlBrandData[]> {
  const res = await fetch(url);
  if (res.ok) {
    const page = await res.text();
    const $ = cheerio.load(page);
    const categoryList = $("#category-list");
    // 手机列表
    const phoneList = categoryList.children("li").get(0);
    // 平板
    const tabletList = categoryList.children("li").get(1);
    const phones = fetchPhone($, phoneList);
    const tablets = fetchTablet($, tabletList);

    const list = mergeData(
      phones as CrawlBrandData[],
      tablets as CrawlBrandData[]
    );

    return list;
  }

  return {
    msg: "无法从该网址中导入数据, 请换一个网址",
    status: "error",
  };
}
