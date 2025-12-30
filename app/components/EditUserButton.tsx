"use client";

import type { ApiUser } from "../features/users/usersApi";

type EditUserButtonProps = {
  user: ApiUser;
  onEdit?: (user: ApiUser) => void;
};

const EditUserButton = ({ user, onEdit }: EditUserButtonProps) => {
  const handleEdit = () => {
    if (onEdit) {
      onEdit(user);
    }
  };

  return (
    <button
      type="button"
      onClick={handleEdit}
      className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1 text-sm text-[var(--color-text)] hover:opacity-90 disabled:opacity-60"
      disabled={!onEdit}
    >
      Edit
    </button>
  );
};

export default EditUserButton;
