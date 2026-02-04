import { useState } from 'react';
import { IoPlayCircleOutline, IoTimeOutline } from 'react-icons/io5';
import { VideoStatsCard, Modal, VideoPlayer, Button } from '../../../shared/ui';
import { useAppSelector } from '../../../app/store';
import { selectIsAuthor } from '../../../entities/user';
import { type VideoItem } from '../api';

interface EpisodeListProps {
  videos: VideoItem[];
  isLoading: boolean;
  error: string | null;
}

export const EpisodeList = ({ videos, isLoading, error }: EpisodeListProps) => {
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const isAuthor = useAppSelector(selectIsAuthor);

  if (isLoading) {
    return (
      <>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-full min-h-80 w-full panel-glass animate-pulse rounded-xl"
          />
        ))}
      </>
    );
  }

  if (error) {
    return (
      <div className="md:col-span-2 p-6 panel-glass border-brand-danger/20 text-brand-danger text-xs font-bold uppercase tracking-widest">
        Error: {error}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="md:col-span-2 panel-glass p-16 text-center border-dashed border-glass-border rounded-2xl">
        <div className="flex justify-center mb-4">
          <IoPlayCircleOutline
            size={48}
            className="text-surface-600 opacity-20"
          />
        </div>
        <p className="text-sm text-surface-400 italic font-medium">
          No episodes have been added to this production yet.
        </p>
      </div>
    );
  }

  return (
    <>
      {videos.map((video, index) => {
        const canWatch = isAuthor || video.isReleased;

        const displayStatus = video.isReleased
          ? 'RELEASED'
          : video.status === 'MODERATION'
            ? 'MODERATION'
            : 'FUNDING';

        return (
          <VideoStatsCard
            key={video.id}
            title={video.title}
            url={video.url}
            status={displayStatus}
            index={index + 1}
            collected={video.collectedFunds}
            required={video.votesRequired}
            className="w-full h-full"
            metadata={
              <div className="flex items-center gap-2 text-[10px] text-surface-400 font-bold uppercase tracking-wider">
                <IoTimeOutline size={12} />
                {new Date(video.createdAt).toLocaleDateString()}
              </div>
            }
            actions={
              <Button
                variant={canWatch ? 'primary' : 'outline'}
                onClick={() => setSelectedVideo(video)}
                className="py-1 px-4 text-[10px] font-black uppercase tracking-widest w-auto rounded-lg"
              >
                {isAuthor ? 'Review' : video.isReleased ? 'Watch' : 'Preview'}
              </Button>
            }
          />
        );
      })}

      <Modal
        isOpen={Boolean(selectedVideo)}
        onClose={() => setSelectedVideo(null)}
      >
        {selectedVideo && (
          <div className="flex flex-col">
            <div className="p-6 border-b border-glass-border bg-white/5">
              <h2 className="text-lg font-black text-white uppercase tracking-tight truncate pr-12">
                {selectedVideo.title}
              </h2>
            </div>
            {/* FORCE RELOAD WITH KEY */}
            <div className="bg-black">
              <VideoPlayer
                key={selectedVideo.id}
                url={selectedVideo.url}
                autoPlay={true}
              />
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};
