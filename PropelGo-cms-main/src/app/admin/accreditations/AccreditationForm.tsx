"use client";

import AdminEntityForm from "@/components/AdminEntityForm";

type Props = {
  mode: "create" | "edit";
  accreditationId?: string;
};

export default function AccreditationForm({
  mode,
  accreditationId,
}: Props) {
  return (
    <AdminEntityForm
      kind="accreditations"
      mode={mode}
      entityId={accreditationId}
    />
  );
}