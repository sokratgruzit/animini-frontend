import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, ErrorMessage } from '../../../shared/ui';
import { activateRequest } from '../../../entities/user/api/user-api';
import { ROUTES } from '../../../shared/config/routes';

/**
 * ActivatePage Component.
 * Handles automatic account activation via link from email.
 */
const ActivatePage = () => {
  const { link } = useParams<{ link: string }>();
  const navigate = useNavigate();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const triggerActivation = async () => {
      if (!link) return;

      try {
        await activateRequest(link);
        setStatus('success');
      } catch (e: any) {
        setStatus('error');
        setError(e.response?.data?.message || 'Activation failed');
      }
    };

    triggerActivation();
  }, [link]);

  return (
    <Container isCentered>
      <Card className="w-full max-w-md text-center flex flex-col gap-6 panel-glass p-8">
        <h2 className="text-surface-100 text-2xl font-bold tracking-tight">
          Account Activation
        </h2>

        {status === 'loading' && (
          <p className="text-surface-300 animate-pulse">
            Verifying your link...
          </p>
        )}

        {status === 'success' && (
          <>
            <p className="text-brand-success font-medium">
              Success! Your account has been activated.
            </p>
            <Button
              onClick={() => navigate(ROUTES.AUTH)}
              className="shadow-brand-glow bg-brand-primary"
            >
              Go to Login
            </Button>
          </>
        )}

        {status === 'error' && (
          <>
            <ErrorMessage message={error} />
            <Button
              variant="outline"
              onClick={() => navigate(ROUTES.AUTH)}
              className="border-glass-border hover:bg-glass-hover text-surface-200"
            >
              Back to Login
            </Button>
          </>
        )}
      </Card>
    </Container>
  );
};

export default ActivatePage;
