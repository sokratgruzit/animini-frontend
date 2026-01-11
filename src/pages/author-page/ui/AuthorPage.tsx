import { AuthorSeriesList, CreateSeriesForm } from '../../../features/video/ui';
import { useAuthorWorkspace } from '../../../features/video/model';

const AuthorPage = () => {
  const { series, isLoading, error, refresh } = useAuthorWorkspace();

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="space-y-6">
        <h2 className="text-xs font-black uppercase tracking-super-wide text-surface-400 px-1">
          Production Management
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 items-stretch">
          <CreateSeriesForm onSuccess={refresh} />
          <AuthorSeriesList
            series={series}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};

export default AuthorPage;
