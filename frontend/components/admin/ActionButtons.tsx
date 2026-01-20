'use client';

import { useState } from 'react';
import { Button } from '@/design-system/components/Button';
import { Modal } from '@/components/shared/Modal';
import { ContentEditor } from './ContentEditor';
import { toast } from '@/components/shared/Toast';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

interface ActionButtonsProps {
  actions: {
    label: string;
    icon?: any;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    onClick: () => void;
  }[];
}

export function ActionButtons({ actions }: ActionButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action, index) => (
        <Button
          key={index}
          variant={action.variant || 'primary'}
          size="sm"
          leftIcon={action.icon}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
}

interface BlogActionsProps {
  postId: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
}

export function BlogActions({ postId, onEdit, onDelete, onView }: BlogActionsProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDelete = () => {
    onDelete?.(postId);
    setIsDeleteModalOpen(false);
    toast.success('Post deleted successfully');
  };

  return (
    <div className="flex items-center gap-2">
      {onView && (
        <button
          onClick={() => onView(postId)}
          className="p-2 hover:bg-background-100 rounded-lg transition-colors text-text-500 hover:text-primary-600"
          title="View"
        >
          <Eye className="w-4 h-4" />
        </button>
      )}
      {onEdit && (
        <button
          onClick={() => onEdit(postId)}
          className="p-2 hover:bg-background-100 rounded-lg transition-colors text-text-500 hover:text-primary-600"
          title="Edit"
        >
          <Edit className="w-4 h-4" />
        </button>
      )}
      {onDelete && (
        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className="p-2 hover:bg-error-50 rounded-lg transition-colors text-text-500 hover:text-error-600"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Post"
      >
        <div className="space-y-4">
          <p className="text-text-700">
            Are you sure you want to delete this post? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
