import { Container } from '../../../shared/ui';
import { AuthForm } from '../../../widgets/auth-form';

/**
 * AuthPage Component.
 * The entry point for Login and Registration.
 */
const AuthPage = () => {
  return (
    <Container isCentered>
      {/* 
        The page just provides the layout. 
        All logic is encapsulated in the Widget. 
      */}
      <AuthForm />
    </Container>
  );
};

export default AuthPage;
