const Button = ({ onClick, name }: { onClick: () => void; name: string }) => {
  return (
    <button
      className="border-2 border-[#F4C842] text-[#F4C842] font-bold 
			px-4 py-2 rounded hover:bg-[#F4C842] hover:text-black 
			transition-all cursor-pointer shadow-md hover:shadow-[0_0_10px_#F4C842]"
      onClick={onClick}
    >
      {name}
    </button>
  );
};

export default Button;
