"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { RoleSelector } from "./role-selector";
import { DatePicker } from "@/components/date-picker";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemTitle,
} from "@/components/ui/item";
import { Edit, Plus, Trash } from "lucide-react";
import { format, isBefore, isSameDay } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const schema = z
  .object({
    id: z.number().nullish(),
    firstName: z.string().min(2, { message: "Min. 2 characters required" }),
    lastName: z.string().min(2, { message: "Min. 2 characters required" }),
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 chars" }),
    role: z.enum(["admin", "teacher", "student"]),
    startDate: z.date(),
    dueDate: z.date().nullish(),
    createdAt: z.date().nullish(),
  })
  .refine(
    (data) => {
      if (data.dueDate && isBefore(data.dueDate, data.startDate)) {
        return false;
      }
      return true;
    },
    {
      message: "Due date should be after start date",
      path: ["dueDate"],
    }
  );

type User = z.infer<typeof schema>;

export default function UserListPage() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [role, setRole] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("users");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const restored = parsed.map((u: any) => ({
          ...u,
          startDate: u.startDate ? new Date(u.startDate) : undefined,
          dueDate: u.dueDate ? new Date(u.dueDate) : undefined,
          createdAt: u.createdAt ? new Date(u.createdAt) : undefined,
        }));
        setUsers(restored);
      } catch (e) {
        console.error("Failed to parse users from localStorage", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  const handleSave = useCallback(
    (user: Omit<User, "id"> & { id?: number | null }) => {
      if (user.id) {
        setUsers((prev) => prev.map((u) => (u.id === user.id ? user : u)));
      } else {
        setUsers((prev) => [
          { ...user, id: Date.now(), createdAt: new Date() },
          ...prev,
        ]);
      }
      setActiveUser(null);
      setOpen(false);
    },
    []
  );

  const handleDelete = (id: number) =>
    setUsers((prev) => prev.filter((u) => u.id !== id));

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        searchText.trim() === "" ||
        `${user.firstName} ${user.lastName} ${user.username}`
          .toLowerCase()
          .includes(searchText.toLowerCase());

      const matchesRole = !role || user.role === role;
      const matchesDate = !date || isSameDay(user.startDate, date);

      return matchesSearch && matchesRole && matchesDate;
    });
  }, [users, searchText, role, date]);

  return (
    <main className="flex flex-col gap-4 items-center p-6">
      <h1>User Management</h1>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search by name or username..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <RoleSelector value={role} setValue={setRole} />
        </div>

        <div className="self-end">
          <DatePicker label="Start Date" date={date} setDate={setDate} />
        </div>

        <div className="self-end">
          <Button
            onClick={() => {
              setActiveUser(null);
              setOpen(true);
            }}
          >
            <Plus className="size-4" /> Create User
          </Button>
        </div>

        {filteredUsers.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onEdit={(user: User) => {
              setActiveUser(user);
              setOpen(true);
            }}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <CreateEditUserDialog
        open={open}
        setOpen={setOpen}
        onSave={handleSave}
        activeUser={activeUser || undefined}
      />
    </main>
  );
}

function UserCard({
  user,
  onEdit,
  onDelete,
}: {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <Item variant={"outline"}>
      <ItemContent>
        <div className="flex items-center gap-4">
          <ItemTitle>
            {user.firstName} {user.lastName}
          </ItemTitle>
          <Badge variant={"secondary"}>{user.role}</Badge>
        </div>
        <ItemDescription>@{user.username}</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button
          onClick={() => onEdit(user)}
          variant={"outline"}
          size={"icon"}
          className="size-8"
        >
          <Edit className="size-4" />
        </Button>
        <Button
          onClick={() => (user.id ? onDelete(user.id) : undefined)}
          variant={"outline"}
          size={"icon"}
          className="size-8"
        >
          <Trash className="size-4" />
        </Button>
      </ItemActions>
      <ItemFooter>
        Start Date: {format(user.startDate, "PPP")}
        {user.dueDate && (
          <span> | Due Date: {format(user.dueDate, "PPP")}</span>
        )}
      </ItemFooter>
    </Item>
  );
}

function CreateEditUserDialog({
  open,
  setOpen,
  onSave,
  activeUser,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSave: (data: User) => void;
  activeUser?: User;
}) {
  const form = useForm<User>({
    resolver: zodResolver(schema),
    defaultValues: { role: "student" },
  });

  function onSubmit(data: User) {
    onSave(data);
  }

  useEffect(() => {
    if (open && activeUser) {
      form.reset({ ...activeUser });
    } else {
      form.reset({ role: "student" });
    }
  }, [activeUser, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create / Edit User</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
          >
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <RoleSelector
                      value={field.value as any}
                      setValue={field.onChange as any}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <DatePicker
                        label="Start Date"
                        date={field.value}
                        setDate={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <DatePicker
                        label="Due Date"
                        date={field.value || undefined}
                        setDate={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex items-center gap-2 self-end">
              <Button
                type="button"
                variant={"secondary"}
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
