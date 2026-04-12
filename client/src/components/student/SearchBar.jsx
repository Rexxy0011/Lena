import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ data, onQueryChange }) => {
  const navigate = useNavigate();
  const [input, setInput] = useState(data ? data : "");

  useEffect(() => {
    setInput(data ? data : "");
  }, [data]);

  const onSearchHandler = (e) => {
    e.preventDefault();
    navigate("/course-list/" + input);
  };

  return (
    <form
      onSubmit={onSearchHandler}
      className="max-w-xl w-full md:h-14 h-12 flex items-center bg-white border border-gray-300 rounded-xl"
    >
      <img
        src={assets.search_icon}
        alt="search"
        className="md:w-auto w-10 px-3"
      />

      <input
        onChange={(e) => {
          const val = e.target.value;
          setInput(val);
          onQueryChange?.(val);
        }}
        value={input}
        type="text"
        placeholder="Search for courses"
        className="w-full outline-none text-gray-500/80"
      />

      <button
        type="submit"
        className="bg-[#4e91fd] rounded text-white md:px-10 px-7 h-[calc(100%-6px)] mx-1"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
