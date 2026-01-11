import { cn } from '../../lib/clsx';

interface VideoPlayerProps {
  url: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
}

/**
 * Universal Video Player.
 * Fix: Uses 'key' to force reload and 'crossOrigin' for storage compatibility.
 */
export const VideoPlayer = ({
  url,
  poster,
  className,
  autoPlay = true,
}: VideoPlayerProps) => {
  return (
    <div className={cn('relative w-full aspect-video bg-black', className)}>
      <video
        key={url} // Force re-mount on URL change
        src={url}
        poster={poster}
        controls
        autoPlay={autoPlay}
        playsInline
        crossOrigin="anonymous" // Helps with CDN/Storage CORS issues
        className="w-full h-full object-contain"
        controlsList="nodownload"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};
