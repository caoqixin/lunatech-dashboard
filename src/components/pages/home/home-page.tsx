"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { signOut } from "@/lib/actions/auth";
import { Preventivo, PublicPhone } from "@/lib/definitions";
import { toEUR } from "@/lib/utils";
import { UpdateIcon } from "@radix-ui/react-icons";
import { useDebounce } from "@uidotdev/usehooks";
import _ from "lodash";
import Link from "next/link";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import PriceTable from "./price-table";

export default function HomePage() {
  const [searchValue, setSearchValue] = useState<string>("");
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const [resultsVisible, setResultVisible] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [searchingPrice, updateSearchingPrice] = useState(false);
  const [readyResult, setReadyResult] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);

  const [phones, updatePhones] = useState<PublicPhone[] | null>(null);
  const [priceData, updatePriceData] = useState<Preventivo[] | null>(null);

  const getPhones = async (name: string) => {
    setIsNotFound(false);
    setResultVisible(true);
    setIsSearching(true);
    const res = await fetch(`/api/v2/phones?name=${name}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if ((data as PublicPhone[]).length == 0) {
        setIsNotFound(true);
      }
      updatePhones(data);
    } else {
      updatePhones(null);
    }

    setIsSearching(false);
  };

  const logout = async () => {
    await signOut();
  };

  const onSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const getPriceData = async (model: string) => {
    const res = await fetch(`/api/v2/components`, {
      cache: "no-store",
      method: "POST",
      body: JSON.stringify({ model }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.status == "error") {
        updatePriceData(null);
      }

      updatePriceData(data.components);
      setReadyResult(true);
    }

    updateSearchingPrice(false);
  };

  const onSelect = (name: string) => {
    setReadyResult(false);
    setIsSelected(true);
    setSearchValue(name);
    setResultVisible(false);
    if (searchRef.current) {
      searchRef.current.focus();
    }
    updateSearchingPrice(true);
  };

  useEffect(() => {
    if (!isSelected) {
      if (debouncedSearchValue !== "") {
        getPhones(debouncedSearchValue);
      } else {
        setResultVisible(false);
        updatePhones(null);
        setIsNotFound(false);
      }
    }
  }, [debouncedSearchValue]);

  useEffect(() => {
    if (searchingPrice) {
      getPriceData(searchValue);
    }
  }, [searchingPrice]);

  return (
    <div className="min-h-screen w-full flex flex-col space-y-2">
      <div className="flex flex-col gap-4 w-full items-center p-8 bg-gradient-to-r from-sky-500 to-indigo-500">
        <div className="flex gap-3 self-end p-0">
          <Button onClick={logout}>退出</Button>
          <Button asChild>
            <Link href="/dashboard">进入后台</Link>
          </Button>
        </div>
        <h1 className="text-3xl font-bold">Luna Tech</h1>
        <p className="text-sm text-muted-foreground">
          Preventivo per il tuo riparazione
        </p>
      </div>
      <div className="flex flex-col w-full items-center ">
        <Input
          ref={searchRef}
          placeholder="Inserisci il modello di tuo telefono"
          className="w-6/12 rounded-3xl"
          value={searchValue}
          onChange={onSearch}
          onKeyDown={() => setIsSelected(false)}
        />
        <ScrollArea
          className={`w-[48%] h-0 ${
            resultsVisible ? (isNotFound ? "h-12" : "h-64") : "h-0"
          } transition-all duration-300 ease-in-out rounded-lg bg-slate-100 absolute z-10`}
        >
          <ul className="flex flex-col w-full">
            {isSearching ? (
              <div className="h-64 w-full flex items-center justify-center">
                <UpdateIcon className="animate-spin" /> 正在搜索中, 请耐心等待
                ...
              </div>
            ) : (
              phones &&
              (!isNotFound ? (
                phones.map((phone) => (
                  <li
                    className="flex text-gray-900 select-none py-2 px-3 hover:bg-indigo-500 w-full cursor-pointer"
                    key={phone.id}
                    onClick={() => {
                      onSelect(phone.name);
                    }}
                  >
                    {phone.name}
                  </li>
                ))
              ) : (
                <div className="flex w-full h-12 items-center justify-center">
                  目前暂无数据, 请重试
                </div>
              ))
            )}
          </ul>
        </ScrollArea>
      </div>
      <div className="flex-1 flex min-w-fulll justify-center ">
        {searchingPrice ? (
          <div className="flex gap-3 items-center">
            <UpdateIcon className="animate-spin" />
            正在搜索价格中, 请稍等 ...
          </div>
        ) : (
          readyResult && <PriceTable priceData={priceData} />
        )}
      </div>
    </div>
  );
}
