"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

const page = () => {
  const [count, setCount] = useState<number>(0);

  const increment = () => {
    setCount((prev) => prev + 1);
  };

  const decrement = () => {
    setCount((prev) => prev - 1);
  };

  const reset = () => {
    setCount(0);
  };

  return (
    <div className="mt-5 ">
      <h1 className=" flex items-center justify-center mb-4">
        Counter : {count}
      </h1>{" "}
      <div className="flex flex-row gap-4 items-center justify-center">
        <Button onClick={increment}>Increment</Button>
        <Button onClick={decrement}>Decrement</Button>
        <Button onClick={reset}>Reset</Button>
      </div>
    </div>
  );
};

export default page;
