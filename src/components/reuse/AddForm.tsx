"use client";
import { collection, addDoc } from "firebase/firestore";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { db } from "@/utils/firebase";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useSelector } from "react-redux";
import { serverTimestamp } from "firebase/firestore";
import { RootState } from "@/states/store/store";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Select } from "@radix-ui/react-select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";

const FormSchemaIncome = z.object({
  date: z.date({
    required_error: "A date is required.",
  }),
  income: z.string(),
  status: z.string(),
  amount: z.string().transform((value) => parseFloat(value)),
});

const FormSchemaExpense = z.object({
  date: z.date({
    required_error: "A date is required.",
  }),
  expense: z.string(),
  amount: z
    .string()
    .refine(
      (value: any) => !isNaN(value) && value.trim() !== "",
      "Age must be a valid number"
    )
    .transform((value) => parseFloat(value)),
});

export function AddForm({ type }: { type: string }) {
  const user:
    | {
        displayName: string | null;
        email: string;
        uid: string;
      }
    | any = useSelector((store: RootState) => store.user);
  const incomeForm = useForm<z.infer<typeof FormSchemaIncome>>({
    resolver: zodResolver(FormSchemaIncome),
    defaultValues: {
      income: "",
      status: "",
      amount: 0,
    },
  });
  const expenseForm = useForm<z.infer<typeof FormSchemaExpense>>({
    resolver: zodResolver(FormSchemaExpense),
    defaultValues: {
      expense: "",
      amount: 0,
    },
  });
  const form: any = type === "income" ? incomeForm : expenseForm;
  async function handleSubmitExpense(
    values: z.infer<typeof FormSchemaExpense>
  ) {
    try {
      const docRef = await addDoc(collection(db, "expenses"), {
        ...values,
        date: JSON.stringify(values.date),
        uid: user?.uid,
        createdAt: serverTimestamp(),
      });
      console.log("Document written with ID: ", docRef.id);
      console.log(typeof values.amount);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
  async function handleSubmitIncome(values: z.infer<typeof FormSchemaIncome>) {
    try {
      const docRef = await addDoc(collection(db, "incomes"), {
        ...values,
        date: JSON.stringify(values.date),
        uid: user?.uid,
        createdAt: serverTimestamp(),
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          type === "income" ? handleSubmitIncome : handleSubmitExpense
        )}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between">
          <FormField
            control={form.control}
            name={type === "income" ? "income" : "expense"}
            render={({ field }) => (
              <FormItem
                style={{
                  marginTop: "1rem",
                  width: "50%",
                }}
              >
                <FormLabel>
                  {type === "income" ? "Income" : "Expense"}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={type === "income" ? "Income" : "Expense"}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {type === "income" && (
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem
                  style={{
                    marginTop: "1rem",
                  }}
                >
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="received">Received</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem
              style={{
                marginTop: "1rem",
              }}
            >
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input placeholder="Amount" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
}

export default AddForm;
