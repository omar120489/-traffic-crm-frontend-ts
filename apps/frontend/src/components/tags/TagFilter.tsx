import { useState, useEffect } from 'react';
import { Chip, Box, Menu, MenuItem, Button, CircularProgress } from '@mui/material';
import { FilterList, Close } from '@mui/icons-material';
import { api } from '@/lib/api';

interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface TagFilterProps {
  readonly selectedTags: string[];
  readonly onTagsChange: (tagIds: string[]) => void;
  readonly orgId: string;
}

export function TagFilter({ selectedTags, onTagsChange, orgId }: TagFilterProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  useEffect(() => {
    loadTags();
  }, [orgId]);

  const loadTags = async () => {
    try {
      setLoading(true);
      const data = await api.tags.list(orgId);
      setTags(data);
    } catch (err) {
      console.error('Failed to load tags:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onTagsChange(selectedTags.filter((id) => id !== tagId));
    } else {
      onTagsChange([...selectedTags, tagId]);
    }
  };

  const handleClearAll = () => {
    onTagsChange([]);
    setMenuAnchor(null);
  };

  const selectedTagObjects = tags.filter((tag) => selectedTags.includes(tag.id));

  return (
    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', flexWrap: 'wrap' }}>
      {/* Selected tag chips */}
      {selectedTagObjects.map((tag) => (
        <Chip
          key={tag.id}
          label={tag.name}
          size="small"
          onDelete={() => handleToggleTag(tag.id)}
          sx={{
            bgcolor: tag.color,
            color: 'white',
            '& .MuiChip-deleteIcon': { color: 'rgba(255,255,255,0.7)' }
          }}
        />
      ))}

      {/* Filter button */}
      <Button
        size="small"
        variant={selectedTags.length > 0 ? 'contained' : 'outlined'}
        startIcon={loading ? <CircularProgress size={16} /> : <FilterList />}
        onClick={(e) => setMenuAnchor(e.currentTarget)}
        disabled={loading}
      >
        Tags {selectedTags.length > 0 && `(${selectedTags.length})`}
      </Button>

      {/* Tag selection menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        PaperProps={{
          sx: { maxHeight: 400, width: 250 }
        }}
      >
        {tags.length === 0 ? (
          <MenuItem disabled>No tags available</MenuItem>
        ) : (
          <>
            {tags.map((tag) => (
              <MenuItem
                key={tag.id}
                onClick={() => handleToggleTag(tag.id)}
                selected={selectedTags.includes(tag.id)}
              >
                <Chip
                  label={tag.name}
                  size="small"
                  sx={{
                    bgcolor: tag.color,
                    color: 'white',
                    mr: 1
                  }}
                />
                {selectedTags.includes(tag.id) && '✓'}
              </MenuItem>
            ))}
            {selectedTags.length > 0 && (
              <>
                <MenuItem divider />
                <MenuItem onClick={handleClearAll}>
                  <Close fontSize="small" sx={{ mr: 1 }} />
                  Clear all
                </MenuItem>
              </>
            )}
          </>
        )}
      </Menu>
    </Box>
  );
}

// Hook for URL-driven tag filtering
export function useTagFilter(
  searchParams: URLSearchParams,
  setSearchParams: (params: URLSearchParams) => void
) {
  const selectedTags = searchParams.get('tags')?.split(',').filter(Boolean) || [];

  const handleTagsChange = (tagIds: string[]) => {
    const params = new URLSearchParams(searchParams);
    if (tagIds.length > 0) {
      params.set('tags', tagIds.join(','));
    } else {
      params.delete('tags');
    }
    params.set('page', '1'); // Reset to first page
    setSearchParams(params);
  };

  return { selectedTags, handleTagsChange };
}
