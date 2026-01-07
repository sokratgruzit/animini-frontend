import { AuthorVideoList, CreateVideoForm } from '../../../features/video/ui';
import { useAuthorVideos } from '../../../features/video/model';

const AuthorPage = () => {
  const { refresh } = useAuthorVideos();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-black text-surface-100 tracking-tight">
          Author Workspace
        </h1>
        <p className="text-sm text-surface-300">
          Manage your series and track community support.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Management */}
        <aside className="lg:col-span-4 space-y-6">
          <section className="space-y-4">
            <h2 className="text-xs font-black uppercase tracking-super-wide text-surface-400 px-1">
              New Publication
            </h2>
            {/* We pass the refresh method to update the list after success */}
            <CreateVideoForm onSuccess={refresh} />
          </section>
        </aside>

        {/* Right Column: Video Feed */}
        <main className="lg:col-span-8 space-y-6">
          <h2 className="text-xs font-black uppercase tracking-super-wide text-surface-400 px-1">
            Your Projects
          </h2>
          <AuthorVideoList />
        </main>
      </div>
    </div>
  );
};

export default AuthorPage;
