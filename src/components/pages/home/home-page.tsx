"use client";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PublicPhone } from "@/lib/definitions";
import { useDebounce } from "@uidotdev/usehooks";
import { ChangeEvent, useEffect, useState } from "react";

export default function HomePage() {
  const [searchValue, setSearchValue] = useState<string>("");
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const [resultsVisible, setResultVisible] = useState(false);

  const [phones, updatePhones] = useState<PublicPhone[] | null>(null);

  const getPhones = async (name: string) => {
    const res = await fetch(`/api/v2/phones?name=${name}`, {
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      updatePhones(data);
    } else {
      updatePhones(null);
    }
  };

  const onSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  useEffect(() => {
    if (debouncedSearchValue !== "") {
      getPhones(debouncedSearchValue);
      setResultVisible(true);
    } else {
      updatePhones(null);
      setResultVisible(false);
    }
  }, [debouncedSearchValue]);

  return (
    <div className="h-full w-full flex flex-col space-y-2 ">
      <div className="flex flex-col gap-4 w-full items-center p-12 bg-gradient-to-r from-sky-500 to-indigo-500">
        <h1 className="text-3xl font-bold">Luna Tech</h1>
        <p className="text-sm text-muted-foreground">
          Preventivo per il tuo riparazione
        </p>
      </div>
      <div className="flex flex-col w-full items-center">
        <Input
          placeholder="Inserisci il modello di tuo telefono"
          className="w-6/12 rounded-3xl"
          value={searchValue}
          onChange={onSearch}
        />
        <ScrollArea
          className={`w-[48%] h-0 ${
            resultsVisible ? "h-64" : "h-0"
          } transition-all duration-300 ease-in-out rounded-lg bg-slate-100`}
        >
          <div className="flex flex-col py-2 px-3 space-y-2">
            {phones &&
              phones.map((phone) => <li key={phone.id}>{phone.name}</li>)}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
