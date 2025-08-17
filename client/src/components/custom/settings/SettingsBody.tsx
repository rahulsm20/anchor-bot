"use client";
import ABSelect from "@/components/custom/input/ABSelect";
import SpotifyLogin from "@/components/custom/SpotifyLogin";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSpotifySession } from "@/hooks/SpotifySessionProvider";
import {
  ACCESS_OPTIONS,
  ACCESS_OPTIONS_MAP,
  FEATURE_ACCESS_LABELS,
} from "@/lib/constants";
import { serverHandlers } from "@/lib/services";
import { AccessOption, MappedPermissions, PermissionType } from "@/types";
import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { LoaderEllipsis } from "../Loader-Spin";

const SettingsBody = () => {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<MappedPermissions>({});

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const data = await serverHandlers.getPermissions();
      const mappedPermissions = data.reduce(
        (acc: MappedPermissions, permission: PermissionType) => {
          const { feature, authorizedPersonnel } = permission;
          acc[feature] = authorizedPersonnel;
          return acc;
        },
        {}
      );
      setValue(mappedPermissions);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const updatePermissions = async () => {
    setLoading(true);
    try {
      const updatedPermissions = FEATURE_ACCESS_LABELS.map((feature) => ({
        feature: feature.key,
        authorizedPersonnel: value[feature.key],
      }));

      const data = await serverHandlers.updatePermissions({
        permissions: updatedPermissions,
      });
      const mappedPermissions = data.reduce(
        (acc: MappedPermissions, permission: PermissionType) => {
          const { feature, authorizedPersonnel } = permission;
          acc[feature] = authorizedPersonnel;
          return acc;
        },
        {}
      );
      setValue(mappedPermissions);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  return (
    <div>
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
            {loading ? (
              <LoaderEllipsis loading={loading} />
            ) : (
              FEATURE_ACCESS_LABELS.map((feature) => (
                <ABSelect
                  key={feature.key}
                  value={value[feature.key]}
                  options={ACCESS_OPTIONS}
                  onChange={(value) => {
                    setValue((prev) => ({
                      ...prev,
                      [feature.key]: value as AccessOption,
                    }));
                  }}
                  defaultValue={ACCESS_OPTIONS_MAP.EVERYONE}
                />
              ))
            )}
          </div>
          <div className="flex flex-col gap-2 justify-end items-end">
            <Button
              className="mt-5 min-w-min"
              disabled={loading}
              onClick={updatePermissions}
            >
              Save Settings
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const InfoTable = () => {
  const { fetching, session, isAuthenticated } = useSpotifySession();
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
              <LoaderEllipsis loading={fetching} />
            </TableCell>
          </TableRow>
        ) : (
          <>
            <TableRow>
              <TableCell>Spotify</TableCell>
              <TableCell
                title={
                  isAuthenticated
                    ? "Spotify is currently enabled"
                    : "Spotify is currently disabled"
                }
              >
                {isAuthenticated ? (
                  <Check className="text-green-600" />
                ) : (
                  <X className="text-red-600" />
                )}
              </TableCell>
              <TableCell>
                <SpotifyLogin
                  session={session}
                  fetching={fetching}
                  isAuthenticated={isAuthenticated}
                />
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
export default SettingsBody;
