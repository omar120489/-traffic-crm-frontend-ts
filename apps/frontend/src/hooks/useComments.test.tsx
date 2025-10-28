/** @vitest-environment jsdom */

import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { useComments } from './useComments';
// Use shared frontend types via path alias
import type { Comment, CommentListResponse } from '@/types/api';

type ListParams = { entityType?: string; entityId?: string | number };
type CreatePayload = {
  entityType: string;
  entityId: string | number;
  content: string;
  mentions?: Array<string | number>;
};

const commentsMocks = vi.hoisted(() => ({
  list: vi.fn<[ListParams], Promise<CommentListResponse>>(),
  create: vi.fn<[CreatePayload], Promise<Comment>>(),
  update: vi.fn(),
  remove: vi.fn()
}));

vi.mock('services/comments', () => ({
  commentsService: {
    listComments: commentsMocks.list,
    createComment: commentsMocks.create,
    updateComment: commentsMocks.update,
    deleteComment: commentsMocks.remove
  }
}));

describe('useComments', () => {
  beforeAll(() => {
    (globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
      true;
  });

  beforeEach(() => {
    commentsMocks.list.mockReset();
    commentsMocks.create.mockReset();
    commentsMocks.update.mockReset();
    commentsMocks.remove.mockReset();
  });

  it('fetches comments on mount and creates a new comment', async () => {
    const initialComment: Comment = {
      id: 1,
      entityType: 'deal',
      entityId: '123',
      content: 'Initial comment',
      mentions: [],
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    };

    const newComment: Comment = {
      id: 2,
      entityType: 'deal',
      entityId: '123',
      content: 'Follow up',
      mentions: [],
      createdAt: '2024-01-02T00:00:00.000Z',
      updatedAt: '2024-01-02T00:00:00.000Z'
    };

    commentsMocks.list.mockResolvedValue({
      items: [initialComment],
      total: 1
    });
    commentsMocks.create.mockImplementation(async () => newComment);

    let hookValue: ReturnType<typeof useComments> | null = null;

    function TestComponent() {
      hookValue = useComments({
        entityType: 'deal',
        entityId: '123'
      });
      return null;
    }

    const container = document.createElement('div');
    const root = createRoot(container);

    await act(async () => {
      root.render(<TestComponent />);
    });

    expect(commentsMocks.list).toHaveBeenCalledWith({ entityType: 'deal', entityId: '123' });

    await act(async () => {});

    expect(hookValue).not.toBeNull();
    expect(hookValue?.comments).toHaveLength(1);
    expect(hookValue?.comments?.[0].content).toBe('Initial comment');
    expect(hookValue?.total).toBe(1);

    await act(async () => {
      await hookValue!.createComment({ content: 'Follow up' });
    });

    expect(commentsMocks.create).toHaveBeenCalledWith({
      entityType: 'deal',
      entityId: '123',
      content: 'Follow up',
      mentions: undefined
    });
    expect(hookValue?.comments).toHaveLength(2);
    expect(hookValue?.comments?.[0]).toEqual(newComment);
    expect(hookValue?.total).toBe(2);

    await act(async () => {
      root.unmount();
    });
    container.remove();
  });
});
