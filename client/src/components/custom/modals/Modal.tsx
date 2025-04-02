import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import React, { HTMLAttributes, useState } from "react";

type ModalProps = HTMLAttributes<HTMLDivElement> & {
  title?: string;
  subtitle?: string;
  triggerButton?: React.ReactNode;
  children?: React.ReactNode;
};
const Modal = ({
  title = "Title",
  subtitle = "",
  children,
  triggerButton,
  ...props
}: ModalProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>
        {triggerButton ? (
          triggerButton
        ) : (
          <Button title="Add Command">
            <Plus />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent {...props}>
        <DialogHeader>
          <DialogTitle className="underline underline-offset-8">
            {title}
          </DialogTitle>
        </DialogHeader>
        {subtitle && <DialogDescription>{subtitle}</DialogDescription>}
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
