import { describe, it, expect, vi, beforeEach } from 'vitest';
import { assertAdmin } from './auth';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

describe('assertAdmin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns the user when authenticated', async () => {
    const { createClient } = await import('@/lib/supabase/server');
    const mockUser = { id: 'user-123', email: 'bodhi@bpmparket.nl' };
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
      },
    } as never);

    const user = await assertAdmin();

    expect(user).toEqual(mockUser);
  });

  it('throws AuthError when no user is present', async () => {
    const { createClient } = await import('@/lib/supabase/server');
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      },
    } as never);

    await expect(assertAdmin()).rejects.toThrow('Not authenticated');
  });

  it('throws AuthError when getUser returns an error', async () => {
    const { createClient } = await import('@/lib/supabase/server');
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
          error: { message: 'JWT expired' },
        }),
      },
    } as never);

    await expect(assertAdmin()).rejects.toThrow('Not authenticated');
  });
});
