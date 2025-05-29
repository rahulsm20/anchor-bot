import { useQueueStore } from "@/hooks/QueueProvider";
import { YTPlayer } from "@/types";
import { ChevronRight, Pause, Play } from "lucide-react";
import { Button } from "../ui/button";
import QueueTable from "./QueueTable";
import { AddVideoForm } from "./sr";
import { Heading } from "./Tags";

interface QueueProps {
  youtubePlayerRef: React.MutableRefObject<YTPlayer | null> | null;
  isPlaying: boolean;
  skipVideo: () => void;
  controlPlayback: () => void;
}

const Queue = ({ isPlaying, skipVideo, controlPlayback }: QueueProps) => {
  const {
    queue,
    currentVideo,
    loading,
    removeFromQueue,
    moveUpInQueue,
    moveToTop,
    addToQueue,
  } = useQueueStore();

  return (
    <div className="queue-container flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <Heading className="flex justify-between items-center">
          <span>Queue</span>
          <div className="flex gap-2">
            <AddVideoForm onAdd={addToQueue} loading={loading} />
            <Button
              variant={"ghost"}
              onClick={skipVideo}
              disabled={queue.length === 0}
              title="Skip"
            >
              <ChevronRight />
            </Button>
            <Button
              variant={"ghost"}
              onClick={controlPlayback}
              disabled={!currentVideo}
              title={`${isPlaying ? "Pause" : "Play"}`}
            >
              {isPlaying ? <Pause /> : <Play />}
            </Button>
          </div>
        </Heading>
        <QueueTable
          loading={loading}
          queue={queue}
          moveToTop={moveToTop}
          removeFromQueue={removeFromQueue}
          moveUpInQueue={moveUpInQueue}
        />
      </div>
    </div>
  );
};
export default Queue;
