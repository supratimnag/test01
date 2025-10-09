"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { StatusSelector } from "./status-selector";
import { DatePicker } from "@/components/date-picker";
import { useCallback, useEffect, useState } from "react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemTitle,
} from "@/components/ui/item";
import { Edit, Plus, Trash } from "lucide-react";
import { format, isBefore } from "date-fns";
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
import { Textarea } from "@/components/ui/textarea";

const schema = z
  .object({
    id: z.number().nullish(),
    title: z
      .string()
      .min(2, {
        message: "Min. 2 characters required",
      })
      .max(100, "Max. 100 characters allowed"),
    description: z.string().max(255).nullish(),
    status: z.enum(["pending", "completed", "incomplete", "in-progress"]),
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

type Todo = z.infer<typeof schema>;

export default function Home() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [status, setStatus] = useState<string>("pending");
  const [open, setOpen] = useState(false);
  const [activeTodo, setActiveTodo] = useState<Todo | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);

  const handleSave = useCallback(
    (todo: Omit<Todo, "id"> & { id?: number | null }) => {
      if (todo.id) {
        setTodos((prev) =>
          prev.map((t) => {
            if (t.id === todo.id) {
              return todo;
            } else {
              return t;
            }
          })
        );
      } else {
        setTodos((prev) => [{ ...todo, id: Date.now() }, ...prev]);
      }
      setActiveTodo(null);
      setOpen(false);
    },
    []
  );

  const handleDelete = (id: number) =>
    setTodos((prev) => {
      return prev.filter((t) => {
        if (t.id === id) {
          return false;
        } else {
          return true;
        }
      });
    });

  return (
    <main className="flex flex-col gap-4 items-center p-6">
      <h1>Todo List App</h1>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Input placeholder="Search..." />
          <StatusSelector value={status} setValue={setStatus} />
        </div>
        <div className="self-end">
          <DatePicker label="Start Date" date={date} setDate={setDate} />
        </div>
        <div className="self-end">
          <Button
            onClick={() => {
              setActiveTodo(null);
              setOpen(true);
            }}
          >
            <Plus className="size-4" /> Create Todo
          </Button>
        </div>
        {todos.map((todo) => (
          <TodoCard
            key={todo.id}
            todo={todo}
            onEdit={(todo: Todo) => {
              setActiveTodo(todo);
              setOpen(true);
            }}
            onDelete={handleDelete}
          />
        ))}
      </div>
      <CreateEditTodoDialog
        open={open}
        setOpen={setOpen}
        onSave={handleSave}
        activeTodo={activeTodo || undefined}
      />
    </main>
  );
}

function TodoCard({
  todo,
  onEdit,
  onDelete,
}: {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <Item variant={"outline"}>
      <ItemContent>
        {/* <ItemHeader> */}
        <div className="flex items-center gap-4">
          <ItemTitle>{todo.title}</ItemTitle>
          <Badge variant={"secondary"}>{todo.status}</Badge>
        </div>
        <ItemDescription>{todo.description}</ItemDescription>
        {/* </ItemHeader> */}
      </ItemContent>
      <ItemActions>
        <Button
          onClick={() => onEdit(todo)}
          variant={"outline"}
          size={"icon"}
          className="size-8"
        >
          <Edit className="size-4" />
        </Button>
        <Button
          onClick={() => (todo.id ? onDelete(todo.id) : undefined)}
          variant={"outline"}
          size={"icon"}
          className="size-8"
        >
          <Trash className="size-4" />
        </Button>
      </ItemActions>
      <ItemFooter>
        Start Date: {format(todo.startDate, "PPP")}
        <span>
          {todo.dueDate && <>Due Date: {format(todo.dueDate, "PPP")}</>}
        </span>
      </ItemFooter>
    </Item>
  );
}

function CreateEditTodoDialog({
  open,
  setOpen,
  onSave,
  activeTodo,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSave: (data: Todo) => void;
  activeTodo?: Todo;
}) {
  const form = useForm<Todo>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: "pending",
    },
  });

  function onSubmit(data: Todo) {
    onSave(data);
  }

  useEffect(() => {
    if (open && activeTodo) {
      form.reset({
        ...activeTodo,
      });
    } else {
      form.reset({
        status: "pending",
      });
    }
  }, [activeTodo, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create / Edit Todo</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <StatusSelector
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
                    {/* <FormLabel>Start Date</FormLabel> */}
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
                onClick={() => {
                  setOpen(false);
                }}
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
