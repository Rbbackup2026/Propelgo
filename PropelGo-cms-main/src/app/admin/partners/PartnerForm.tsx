"use client";

import AdminEntityForm from "@/components/AdminEntityForm";

type Props = {
  mode: "create" | "edit";
  partnerId?: string;
};

export default function PartnerForm({ mode, partnerId }: Props) {
  return (
    <AdminEntityForm
      kind="partners"
      mode={mode}
      entityId={partnerId}
    />
  );
}