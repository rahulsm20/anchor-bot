"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSpotifySession } from "@/hooks/SpotifySessionProvider";
import { ACCESS_OPTIONS, ACCESS_OPTIONS_MAP } from "@/lib/constants";
import { Check, Settings, X } from "lucide-react";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import ABSelect from "./input/ABSelect";
import LoaderSpin from "./Loader-Spin";
import Modal from "./modals/Modal";
import SpotifyLogin from "./SpotifyLogin";

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
      <Tabs defaultValue="general">
        <TabsList className="flex items-start justify-start">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="access">Access</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <InfoTable />
        </TabsContent>
        <TabsContent value="access">
          <div className="grid grid-cols-2 justify-center items-center gap-2">
            <p>{`Who's allowed to request songs?`}</p>
            <ABSelect
              options={ACCESS_OPTIONS}
              defaultValue={ACCESS_OPTIONS_MAP.EVERYONE}
            />
          </div>
        </TabsContent>
      </Tabs>
    </Modal>
  );
};
const InfoTable = () => {
  const { fetching, isAuthenticated } = useSpotifySession();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Provider</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Required Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {fetching ? (
          <TableRow>
            <TableCell colSpan={3} className="h-24 text-center">
              <LoaderSpin loading={fetching} />
            </TableCell>
          </TableRow>
        ) : (
          <>
            <TableRow>
              <TableCell>Spotify</TableCell>
              <TableCell title="Spotify is currently enabled">
                {isAuthenticated ? (
                  <Check className="text-green-600" />
                ) : (
                  <X className="text-red-600" />
                )}
              </TableCell>
              <TableCell>
                <SpotifyLogin />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Youtube</TableCell>
              <TableCell title="Youtube is currently enabled">
                <Check className="text-green-600" />
              </TableCell>
              <TableCell>
                <span>None</span>
              </TableCell>
            </TableRow>
          </>
        )}
      </TableBody>
    </Table>
  );
};
export default SongResourceSettings;
