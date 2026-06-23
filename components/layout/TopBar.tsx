"use client";

import Link from "next/link";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Plus } from "lucide-react";

interface TopBarProps {
  title: string;
  subtitle?: string;
  action?: { label: string; href: string };
  search?: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  };
}

export function TopBar({ title, subtitle, action, search }: TopBarProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-slate-200 bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>
      {(search || action) && (
        <div className="flex items-center gap-3">
          {search && (
            <Input
              placeholder={search.placeholder ?? "Search..."}
              value={search.value}
              onChange={(e) => search.onChange(e.target.value)}
              className="w-48"
              aria-label="Search"
            />
          )}
          {action && (
            <Link href={action.href} className="shrink-0">
              <Button>
                <Plus className="h-4 w-4" />
                {action.label}
              </Button>
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
