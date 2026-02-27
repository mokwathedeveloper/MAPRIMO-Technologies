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
import { deleteLead } from "@/lib/actions/portfolio";
import { toast } from "sonner";

interface DeleteLeadButtonProps {
  id: string;
  name: string;
  onDelete?: (id: string) => void;
}

export function DeleteLeadButton({ id, name, onDelete }: DeleteLeadButtonProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      const result = await deleteLead(id);
      if (result.ok) {
        setOpen(false);
        toast.success("Lead deleted successfully");
        if (onDelete) onDelete(id);
      } else {
        toast.error(result.error.message);
      }
    } catch (error) {
      toast.error("Failed to delete lead");
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
          <DialogTitle>Delete Lead</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the lead from <strong>{name}</strong>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? "Deleting..." : "Delete Lead"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
