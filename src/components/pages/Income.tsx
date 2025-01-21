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
import AddForm from "../reuse/AddForm";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "@/utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
const Income = ({ type }: { type: string }) => {
  const [update, setUpdate] = useState(false);
  const [incomes, setIncomes] = useState<any[]>([]);
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
      collection(db, "incomes"),
      where("uid", "==", user ? user.uid : ""),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const incomesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setIncomes(incomesData);
        console.log(incomesData);
      },
      (error) => {
        console.log(error);
      }
    );
    setUpdate(!false);
    return () => unsubscribe();
  }, [user]);
  return (
    <div className="relative bg-[#f8f8f8] flex-[4] h-full overflow-auto scrollbar-thin rounded-md p-3">
      <Table>
        <TableCaption>A list of your recent income.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Income</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {incomes &&
            incomes.map((income, i) => {
              return (
                <Dialog key={i}>
                  <DialogTrigger asChild>
                    <TableRow className="cursor-pointer hover:bg-[#f0efef]">
                      <TableCell className="font-medium">
                        {income.date.substring(6, 11)}
                      </TableCell>
                      <TableCell>{income.status}</TableCell>
                      <TableCell>{income.income}</TableCell>
                      <TableCell className="text-right text-green-600">
                        ${parseFloat(income.amount)}
                      </TableCell>
                    </TableRow>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add new income</DialogTitle>
                      <DialogDescription>
                        Include the date and status
                      </DialogDescription>
                    </DialogHeader>
                    <AddForm type={type} />
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
            <DialogTitle>Add new income</DialogTitle>
            <DialogDescription>Include the date and status</DialogDescription>
          </DialogHeader>
          <AddForm type={type} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Income;
