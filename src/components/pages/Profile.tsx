import React, { useState } from "react";
import { GiReceiveMoney, GiTakeMyMoney } from "react-icons/gi";
import { TbDeviceAnalytics } from "react-icons/tb";
import { IoSettingsOutline } from "react-icons/io5";
const Profile = ({
  selected,
  setSelected,
  setType,
}: {
  selected: number;
  setSelected: React.Dispatch<React.SetStateAction<number>>;
  setType: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [tabArray] = useState([
    {
      data: "Income",
      el: GiReceiveMoney,
    },
    {
      data: "Expense",
      el: GiTakeMyMoney,
    },
    {
      data: "Analytics",
      el: TbDeviceAnalytics,
    },
    {
      data: "Settings",
      el: IoSettingsOutline,
    },
  ]);
  return (
    <div
      className="bg-[#f8f8f8] flex-[1] rounded-md font-geist"
      style={{
        height: "calc(100vh - 88px)",
      }}
    >
      <div className="flex items-center py-2 px-3 border-b border-b-[#e6e6e6] rounded-t-md gap-5">
        <div>
          <img
            className="w-10 cursor-pointer rounded-full"
            alt="Profile Image"
            src="https://img.freepik.com/free-vector/boy-cartoon-head-isolated_1308-141056.jpg"
          />
        </div>
        <div>
          <p draggable className="font-semibold cursor-pointer">
            Name
          </p>
          <p className="text-[0.8rem] cursor-pointer">Description</p>
        </div>
      </div>
      <div className="px-4 py-3 text-[#464646]">
        {tabArray.map((tab, i) => {
          return (
            <Tab
              selected={selected}
              data={tab.data}
              setSelected={setSelected}
              Icon={tab.el}
              i={i}
              key={i}
              setType={setType}
            />
          );
        })}
      </div>
    </div>
  );
};

const Tab = ({
  setSelected,
  Icon,
  data,
  i,
  selected,
  setType,
}: {
  setSelected: React.Dispatch<React.SetStateAction<number>>;
  Icon: any;
  data: string;
  i: number;
  selected: number;
  setType: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const listStyle =
    "flex items-center font-medium py-2 mb-[2px] px-2 rounded-md gap-3 text-sm cursor-pointer hover:bg-[#f1f1f1] hover:text-black";
  return (
    <p
      style={{
        backgroundColor: selected === i + 1 ? "#f1f1f1" : "",
        color: selected === i + 1 ? "#000000" : "",
      }}
      className={listStyle}
      onClick={() => {
        setSelected(i + 1);
        if (i === 0) {
          setType("income");
        } else if (i === 1) {
          setType("expense");
        }
      }}
    >
      <span>{<Icon size={25} />}</span>
      <span>{data}</span>
    </p>
  );
};
export default Profile;
