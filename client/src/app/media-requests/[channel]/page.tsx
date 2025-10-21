"use client";
import QueueTable from "@/components/custom/QueueTable";
import { Heading } from "@/components/custom/Tags";
import { getPublicQueueByChannel } from "@/lib/services";
import { VideoQueueItem } from "@/types";
import { useEffect, useState } from "react";

type PageProps = {
  params: {
    channel: string;
  };
};
const PublicQueueRoute = ({ params }: PageProps) => {
  const channel = params.channel;
  const [queue, setQueue] = useState<VideoQueueItem[]>([]);
  const [loading, setLoading] = useState(false);
  const fetchData = async () => {
    setLoading(true);
    if (!channel) {
      console.error("Channel parameter is missing");
      setLoading(false);
      return;
    }
    const res = await getPublicQueueByChannel(channel);
    for (const item of res.items) {
      if (item.requested_by == "system") {
        item.requested_by = channel;
      }
    }
    setQueue(res.items);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="w-1/2">
      <Heading>{`${channel}'s`} Queue </Heading>
      <QueueTable queue={queue} loading={loading} />
    </div>
  );
};

export default PublicQueueRoute;
