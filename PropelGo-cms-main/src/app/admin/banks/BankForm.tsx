"use client";

import AdminEntityForm from "@/components/AdminEntityForm";

type Props = {
  mode: "create" | "edit";
  bankId?: string;
};

export default function BankForm({ mode, bankId }: Props) {
  return (
    <AdminEntityForm
      kind="banks"
      mode={mode}
      entityId={bankId}
    />
  );
}