"use client";

import type { ApiUser } from "../redux/api/usersApi";
import Button from "./ui/Button";

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
    <Button
      type="button"
      onClick={handleEdit}
      variant="outline"
      className="px-3 py-1 text-sm"
      disabled={!onEdit}
    >
      Edit
    </Button>
  );
};

export default EditUserButton;
