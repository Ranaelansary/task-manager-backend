import { AuthService } from '../services/auth.service';
import { SignupDto, SigninDto } from '../dtos/auth.dto';
import { ApiError } from '../utils/ApiError';

/**
 * Auth Service Tests
 * 
 * Note: These are integration tests that require a running database.
 * For unit tests, you would want to mock the database repository.
 */

describe('AuthService', () => {
  let authService: AuthService;

  beforeAll(() => {
    authService = new AuthService();
  });

  describe('signup', () => {
    it('should create a new user with valid credentials', async () => {
      const signupDto: SignupDto = {
        email: `test-${Date.now()}@example.com`,
        fullName: 'Test User',
        password: 'SecurePass123!@',
      };

      try {
        const result = await authService.signup(signupDto);
        
        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('token');
        expect(result.email).toBe(signupDto.email);
        expect(result.fullName).toBe(signupDto.fullName);
      } catch (error) {
        console.error('Signup test failed:', error);
        throw error;
      }
    });

    it('should throw error if email already exists', async () => {
      const email = `existing-${Date.now()}@example.com`;
      const signupDto: SignupDto = {
        email,
        fullName: 'Test User',
        password: 'SecurePass123!@',
      };

      // Create user first
      await authService.signup(signupDto);

      // Try to create again with same email
      try {
        await authService.signup(signupDto);
        fail('Expected error was not thrown');
      } catch (error) {
        if (error instanceof ApiError) {
          expect(error.statusCode).toBe(409);
          expect(error.message).toBe('Email already exists');
        } else {
          throw error;
        }
      }
    });
  });

  describe('signin', () => {
    it('should authenticate user with correct credentials', async () => {
      const email = `signin-test-${Date.now()}@example.com`;
      const password = 'SecurePass123!@';

      // Create user
      await authService.signup({
        email,
        fullName: 'Test User',
        password,
      });

      // Sign in
      const result = await authService.signin({
        email,
        password,
      });

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('token');
      expect(result.email).toBe(email);
    });

    it('should throw error with incorrect password', async () => {
      const email = `wrong-pass-${Date.now()}@example.com`;

      // Create user
      await authService.signup({
        email,
        fullName: 'Test User',
        password: 'SecurePass123!@',
      });

      // Try to sign in with wrong password
      try {
        await authService.signin({
          email,
          password: 'WrongPassword123!@',
        });
        fail('Expected error was not thrown');
      } catch (error) {
        if (error instanceof ApiError) {
          expect(error.statusCode).toBe(401);
          expect(error.message).toBe('Invalid email or password');
        } else {
          throw error;
        }
      }
    });

    it('should throw error if user not found', async () => {
      try {
        await authService.signin({
          email: 'nonexistent@example.com',
          password: 'SecurePass123!@',
        });
        fail('Expected error was not thrown');
      } catch (error) {
        if (error instanceof ApiError) {
          expect(error.statusCode).toBe(401);
          expect(error.message).toBe('Invalid email or password');
        } else {
          throw error;
        }
      }
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid JWT token', async () => {
      const email = `verify-${Date.now()}@example.com`;

      // Create user and get token
      const { token } = await authService.signup({
        email,
        fullName: 'Test User',
        password: 'SecurePass123!@',
      });

      // Verify token
      const decoded = await authService.verifyToken(token);
      expect(decoded).toHaveProperty('userId');
      expect(decoded).toHaveProperty('email');
      expect(decoded.email).toBe(email);
    });

    it('should throw error for invalid token', async () => {
      try {
        await authService.verifyToken('invalid.token.here');
        fail('Expected error was not thrown');
      } catch (error) {
        if (error instanceof ApiError) {
          expect(error.statusCode).toBe(401);
          expect(error.message).toBe('Invalid token');
        } else {
          throw error;
        }
      }
    });
  });
});
