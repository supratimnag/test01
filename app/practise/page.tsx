"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { RoleSelector } from "./role-selector";
import { DatePick } from "./date-pick";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  role: "teacher" | "student" | "admin";
  startDate: Date;
  dueDaye?: Date;
  //   class?: "fifth" | "sixth" | "seventh";
  createdAt: Date;
};

const page = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  return (
    <main className="flex flex-col gap-4 items-center p-6">
      <h1>EduRag - SignUp</h1>
      <div className="flex flex-col gap-2 ">
        <div className="flex items-center gap-3">
          <Input type="text" placeholder="Search..." />
          <RoleSelector />
        </div>
        <div className="self-end">
          <DatePick label="Start Date" date={date} setDate={setDate} />
        </div>
        <UserCard />
      </div>
    </main>
  );
};

function UserCard() {
  return (
    <Item variant="outline">
      <ItemContent>
        <ItemTitle>Supratim Nag</ItemTitle>
        <ItemDescription>snsupratim</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button variant="destructive" size={"icon"}>
          <Trash className="size-4" />
        </Button>
      </ItemActions>
    </Item>
  );
}

export default page;
