import { FiPlus } from "react-icons/fi";

const AddButton = () => {
  return (
    <div className="text-[2rem] flex items-center justify-center fixed bottom-7 right-9 p-2 w-10 h-10 bg-black text-white font-thin rounded-full hover:bg-[#000000ee]">
      <FiPlus color="white" />
    </div>
  );
};
export default AddButton;
