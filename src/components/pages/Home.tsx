import { useEffect, useState } from "react";
import Profile from "./Profile";
import Expense from "./Expense";
import Income from "./Income";
import Analytics from "./Analytics";
import Settings from "./Settings";
import { useDispatch } from "react-redux";
import { addUser } from "@/states/slices/userSlice";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/utils/firebase";
const Home = () => {
  const [selected, setSelected] = useState(2);
  const [type, setType] = useState("expense");
  const dispatch = useDispatch();
  useEffect(() => {
    try {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          dispatch(
            addUser({
              displayName: user.displayName,
              email: user.email,
              uid: user.uid,
            })
          );
        } else {
          console.log("err");
        }
      });
    } catch (err: any) {
      console.log(err.message);
    }
  }, []);
  return (
    <div className="p-5 w-full font-geist">
      <div className="h-12 flex items-center">
        <h1 className="text-3xl" draggable>
          EXPENSE TRACKER
        </h1>
      </div>
      <div className="flex w-full gap-4">
        <Profile
          selected={selected}
          setSelected={setSelected}
          setType={setType}
        />
        <div
          className="flex-[4]"
          style={{
            height: "calc(100vh - 88px)",
          }}
        >
          {selected === 1 && <Income type={type} />}
          {selected === 2 && <Expense type={type} />}
          {selected === 3 && <Analytics />}
          {selected === 4 && <Settings />}
        </div>
      </div>
    </div>
  );
};

export default Home;
