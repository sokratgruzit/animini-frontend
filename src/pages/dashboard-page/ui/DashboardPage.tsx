import { useDispatch, useSelector } from 'react-redux';
import { Container, Button, Card } from '../../../shared/ui';
/**
 * 1. Import userLogout thunk instead of the old logout action
 */
import { userLogout } from '../../../entities/user';
import { type RootState, type AppDispatch } from '../../../app/store';

export const DashboardPage = () => {
  /**
   * 2. Use AppDispatch type to properly handle async thunks
   */
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.data);

  const handleLogout = () => {
    /**
     * 3. Dispatch the async thunk to clear server session AND local state
     */
    dispatch(userLogout());
  };

  return (
    <Container isCentered>
      <Card className="w-full max-w-2xl text-center flex flex-col gap-6 panel-glass p-10">
        <h1 className="text-surface-100 text-3xl font-bold tracking-tight">
          Welcome to Dashboard
        </h1>

        <div className="p-4 bg-glass-bg rounded-xl border border-glass-border text-left">
          <p className="text-surface-300 text-micro uppercase tracking-super-wide mb-1 font-black">
            Authenticated as:
          </p>
          <p className="text-brand-primary font-mono font-medium">
            {user?.email || 'Unknown User'}
          </p>
        </div>

        <p className="text-surface-200">
          This is a protected area. Only authorized users can see this content.
        </p>

        <Button
          variant="outline"
          onClick={handleLogout}
          className="mt-4 border-brand-danger/20 text-brand-danger hover:bg-brand-danger/10 transition-all"
        >
          Logout Session
        </Button>
      </Card>
    </Container>
  );
};

export default DashboardPage;
