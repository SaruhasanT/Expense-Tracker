import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddButton from "../reuse/AddButton";
import EditForm from "../reuse/AddForm";
import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "@/utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
const Expense = ({ type }: { type: string }) => {
  const [update, setUpdate] = useState(false);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return unsubscribe; //
  }, [update]);
  useEffect(() => {
    console.log(user);
    const q = query(
      collection(db, "expenses"),
      where("uid", "==", user ? user.uid : ""),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const expensesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setExpenses(expensesData);
        console.log(expensesData);
      },
      (error) => {
        console.log(error);
      }
    );
    setUpdate(!false);
    return () => unsubscribe();
  }, [user]);
  return (
    <div className="relative bg-[#f8f8f8] h-full overflow-auto scrollbar-thin rounded-md p-3">
      <Table>
        <TableCaption>A list of your recent Expense.</TableCaption>
        <TableHeader className="sticky top-0">
          <TableRow>
            <TableHead className="w-[100px]">Date</TableHead>
            <TableHead>Expense</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses &&
            expenses.map((expense, i) => {
              return (
                <Dialog key={i}>
                  <DialogTrigger asChild>
                    <TableRow className="cursor-pointer hover:bg-[#f0efef]">
                      <TableCell className="font-medium">
                        {expense.date.substring(6, 11)}
                      </TableCell>
                      <TableCell>{expense.expense}</TableCell>
                      <TableCell className="text-right text-red-600">
                        ${parseFloat(expense.amount)}
                      </TableCell>
                    </TableRow>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add new Expense</DialogTitle>
                      <DialogDescription>
                        Include the date and status
                      </DialogDescription>
                    </DialogHeader>
                    <EditForm type={type} />
                  </DialogContent>
                </Dialog>
              );
            })}
        </TableBody>
      </Table>
      <Dialog>
        <DialogTrigger>
          <AddButton />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add new Expense</DialogTitle>
            <DialogDescription>Include the date and status</DialogDescription>
          </DialogHeader>
          <EditForm type={type} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Expense;
