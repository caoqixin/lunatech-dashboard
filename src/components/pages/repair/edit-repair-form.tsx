"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import MultiSelect from "@/components/ui/multi-select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { updateRepair } from "@/lib/actions/server/repairs";
import { useProblem } from "@/lib/fetcher/use-problem";
import { RepairFormValue, RepairSchema } from "@/schemas/repair-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

interface EditRepairFormProps {
  initialData: any;
}
const statuses = ["未维修", "维修中", "已维修", "已取件", "无法维修"];
const rework_statuses = ["返修中", "返修完成", "已取件"];

export function EditRepairForm({ initialData }: EditRepairFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const problem = useProblem("repair_problem");
  const [isPending, startTransition] = useTransition();

  const onProblemChange = (value: any, data: string[]) => {
    form.setValue(value, data);
  };

  const form = useForm<RepairFormValue>({
    resolver: zodResolver(RepairSchema),
    defaultValues: {
      phone: initialData.phone,
      problem: initialData.problem,
      status: initialData.status,
      deposit: initialData.deposit,
      price: initialData.price,
      name: initialData.customer.name,
      tel: initialData.customer.tel,
      email: initialData.customer.email,
    },
  });

  const onSubmit = async (values: any) => {
    startTransition(async () => {
      const data = await updateRepair(initialData.id, values);

      if (data.status === "success") {
        toast({
          title: data.msg,
        });
        router.push("/dashboard/repairs");
      } else {
        toast({
          title: data.msg,
          variant: "destructive",
        });
      }
    });
  };
  return (
    <>
      <ScrollArea className="h-[calc(80vh-200px)]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-2">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium border-b-2">客人资料</h3>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>客户名称</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="客户名称"
                          {...field}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>联系方式</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="联系方式"
                          {...field}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>邮箱</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="邮箱"
                          {...field}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <h3 className="text-lg font-medium border-b-2">维修信息</h3>
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>手机型号</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="手机型号"
                          {...field}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="problem"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 pt-2">
                      <FormLabel>维修故障</FormLabel>
                      <MultiSelect
                        defaultValues={field.value}
                        placeholder="维修故障"
                        fieldName="problem"
                        options={problem?.data}
                        setField={onProblemChange}
                        disabled={isPending}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>维修状态</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isPending}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="维修状态" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {initialData.isRework
                            ? rework_statuses.map((status, index) => (
                                <SelectItem key={index} value={status}>
                                  {status}
                                </SelectItem>
                              ))
                            : statuses.map((status, index) => (
                                <SelectItem key={index} value={status}>
                                  {status}
                                </SelectItem>
                              ))}
                          {}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deposit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>订金</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="订金"
                          {...field}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>价格</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="价格"
                          {...field}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="mt-8 pt-5">
              <Button
                type="submit"
                disabled={isPending}
                className="flex gap-2 items-center"
              >
                {isPending && <ReloadIcon className="animate-spin" />}
                完成
              </Button>
            </div>
          </form>
        </Form>
      </ScrollArea>
    </>
  );
}
