"use client";

import { useState } from "react";
import type { Expense } from "@/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";

interface Props {
  expenses: Expense[];
  travelerName: string;
  onConfirm: (expenseIds: string[]) => void;
  onCancel: () => void;
}

export default function TravelerExpenseModal({
  expenses,
  travelerName,
  onConfirm,
  onCancel,
}: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    expenses.map((e) => e.id)
  );

  const toggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => setSelectedIds(expenses.map((e) => e.id));
  const deselectAll = () => setSelectedIds([]);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[110] flex items-center justify-center p-5">
      <Card className="relative p-6 md:p-8 max-w-[500px] w-full animate-pop-in flex flex-col max-h-[85vh]">
        <Typography variant="h3" className="mb-2 text-gold">
          Add {travelerName} to expenses?
        </Typography>
        <Typography variant="small" className="opacity-60 mb-6 block">
          Choose which existing expenses {travelerName} should be included in the split.
        </Typography>

        <div className="flex justify-between items-center mb-4">
          <Typography variant="small" className="font-bold uppercase tracking-widest opacity-40">
            {selectedIds.length} of {expenses.length} selected
          </Typography>
          <div className="flex gap-4">
            <button
              onClick={selectAll}
              className="text-[10px] font-bold uppercase tracking-wider text-gold hover:opacity-100 opacity-60 transition-opacity"
            >
              All
            </button>
            <button
              onClick={deselectAll}
              className="text-[10px] font-bold uppercase tracking-wider text-text-faint hover:text-white transition-colors"
            >
              None
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto mb-6 pr-2 space-y-2 custom-scrollbar">
          {expenses.map((e) => {
            const isSelected = selectedIds.includes(e.id);
            return (
              <div
                key={e.id}
                onClick={() => toggle(e.id)}
                className={`
                  flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer
                  ${isSelected
                    ? "bg-gold/10 border-gold/40"
                    : "bg-white/5 border-white/10 opacity-50 hover:opacity-100"}
                `}
              >
                <div className="min-w-0">
                  <Typography variant="body" className="font-medium truncate block">
                    {e.desc}
                  </Typography>
                  <Typography variant="small" className="opacity-50 text-[11px]">
                    {e.category}
                  </Typography>
                </div>
                <div className={`
                  w-5 h-5 rounded-full border-2 flex items-center justify-center
                  ${isSelected ? "bg-gold border-gold" : "border-white/20"}
                `}>
                  {isSelected && <span className="text-bg-deep text-[10px] font-bold">✓</span>}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button className="flex-1" onClick={() => onConfirm(selectedIds)}>
            Confirm & Add
          </Button>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
}
