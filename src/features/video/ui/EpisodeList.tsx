import { IoPlayCircleOutline, IoTimeOutline } from 'react-icons/io5';
import { type VideoItem } from '../api';

interface EpisodeListProps {
  videos: VideoItem[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Renders episodes as individual grid items to align with the creation form.
 */
export const EpisodeList = ({ videos, isLoading, error }: EpisodeListProps) => {
  if (isLoading) {
    return (
      <>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-104px w-full panel-glass animate-pulse rounded-xl"
          />
        ))}
      </>
    );
  }

  if (error) {
    return (
      <div className="md:col-span-2 xl:col-span-3 p-6 panel-glass border-brand-danger/20 text-brand-danger text-xs font-bold uppercase tracking-widest">
        {error}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="md:col-span-2 xl:col-span-3 panel-glass p-16 text-center border-dashed border-glass-border rounded-2xl">
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
      {videos.map((video, index) => (
        <div
          key={video.id}
          className="group flex items-center gap-5 p-4 panel-glass hover:bg-white/0.03 transition-all duration-300 rounded-xl border-glass-border overflow-hidden h-104px"
        >
          {/* Index / Number */}
          <div className="text-xl font-black text-surface-600 group-hover:text-brand-primary transition-colors min-w-2rem">
            {(index + 1).toString().padStart(2, '0')}
          </div>

          {/* Mini Preview */}
          <div className="relative h-16 aspect-video bg-dark-base rounded-lg overflow-hidden border border-glass-border shrink-0">
            <video
              src={`${video.url}#t=0.5`}
              className="w-full h-full object-cover opacity-60"
              preload="metadata"
            />
          </div>

          {/* Metadata */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-surface-100 truncate group-hover:text-brand-primary transition-colors">
              {video.title}
            </h4>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1 text-[10px] text-surface-500 font-bold uppercase tracking-wider">
                <IoTimeOutline size={12} />
                {new Date(video.createdAt).toLocaleDateString()}
              </span>
              <span className="h-1 w-1 rounded-full bg-surface-700" />
              <span className="text-[10px] text-brand-primary font-black uppercase tracking-widest">
                {video.status}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity pr-2">
            <button className="text-xs font-black text-surface-400 hover:text-white uppercase tracking-widest">
              View
            </button>
          </div>
        </div>
      ))}
    </>
  );
};
