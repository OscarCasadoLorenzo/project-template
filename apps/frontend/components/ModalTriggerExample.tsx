"use client";

import { Button, ConfigurableModal, useModal } from "@project-template/ui";
import { toast } from "sonner";

export function ModalTriggerExample() {
  const { openModal, closeModal } = useModal();

  const handleOpenModal = () => {
    const modalId = "confirm-example";

    openModal({
      id: modalId,
      content: ConfigurableModal,
      props: {
        title: "Confirm Action",
        description: "Are you sure you want to proceed with this action?",
        children: (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              This action cannot be undone. Please confirm to continue.
            </p>
          </div>
        ),
        buttons: [
          {
            label: "Cancel",
            onClick: () => {
              closeModal(modalId);
              toast.info("Action cancelled");
            },
            variant: "ghost",
          },
          {
            label: "Confirm",
            onClick: () => {
              closeModal(modalId);
              toast.success("Action confirmed!");
            },
            variant: "default",
          },
        ],
      },
    });
  };

  return (
    <Button onClick={handleOpenModal} variant="outline" size="sm">
      Open Modal
    </Button>
  );
}
