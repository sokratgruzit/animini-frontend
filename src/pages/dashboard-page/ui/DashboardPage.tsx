import { useDispatch, useSelector } from 'react-redux';
import { Container, Button, Card } from '../../../shared/ui';
import { logout } from '../../../entities/user';
import { type RootState } from '../../../app/store';

/**
 * DashboardPage Component.
 * The main protected area of the application.
 */
const DashboardPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.data);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Container isCentered>
      <Card className="w-full max-w-2xl text-center flex flex-col gap-6">
        <h1 className="text-white text-3xl font-bold">Welcome to Dashboard</h1>

        <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-left">
          <p className="text-gray-400 text-sm mb-1">Authenticated as:</p>
          <p className="text-indigo-400 font-mono font-medium">
            {user?.email || 'Unknown User'}
          </p>
        </div>

        <p className="text-gray-400">
          This is a protected area. Only authorized users can see this content.
        </p>

        <Button
          variant="outline"
          onClick={handleLogout}
          className="mt-4 border-red-500/50 text-red-400 hover:bg-red-500/10"
        >
          Logout Session
        </Button>
      </Card>
    </Container>
  );
};

export default DashboardPage;
