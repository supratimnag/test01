import { DialogCloseButton } from "@/components/Dialogue";
import SheetPage from "@/components/Sheet";
import { SkeletonCard } from "@/components/SkeletonCard";
import { TableDemo } from "@/components/TableDemo";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function DashboardPage() {
  return (
    <main>
      <span className="mr-2">Dialogue Boxes :</span>
      <DialogCloseButton />

      <SheetPage />
      <SkeletonCard />
      <TableDemo />
    </main>
  );
}
