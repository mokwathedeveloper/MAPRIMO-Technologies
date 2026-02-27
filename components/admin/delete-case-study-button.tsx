"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteCaseStudy } from "@/lib/actions/portfolio";
import { toast } from "sonner";

interface DeleteCaseStudyButtonProps {
  id: string;
  title: string;
  onDelete?: (id: string) => void;
}

export function DeleteCaseStudyButton({ id, title, onDelete }: DeleteCaseStudyButtonProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      const result = await deleteCaseStudy(id);
      if (result.ok) {
        setOpen(false);
        toast.success("Case study deleted successfully");
        if (onDelete) onDelete(id);
      } else {
        toast.error(result.error.message);
      }
    } catch (error) {
      toast.error("Failed to delete case study");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Case Study</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the case study for <strong>{title}</strong>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? "Deleting..." : "Delete Case Study"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
