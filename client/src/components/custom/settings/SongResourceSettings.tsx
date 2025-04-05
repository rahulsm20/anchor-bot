"use client";
import Modal from "@/components/custom/modals/Modal";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import SettingsBody from "./SettingsBody";

const SongResourceSettings = () => {
  return (
    <Modal
      title="Settings"
      className="h-96 flex flex-col gap-5"
      triggerButton={
        <Button>
          <Settings />
        </Button>
      }
    >
      <SettingsBody />
    </Modal>
  );
};
export default SongResourceSettings;
