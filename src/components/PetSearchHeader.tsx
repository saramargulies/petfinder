import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List } from 'lucide-react';

interface PetSearchHeaderProps {
  totalResults: number;
  onSortChange: (value: string) => void;
  onViewChange: (view: 'grid' | 'list') => void;
  currentView: 'grid' | 'list';
  className?: string;
}

export function PetSearchHeader({
  totalResults,
  onSortChange,
  onViewChange,
  currentView,
  className = '',
}: PetSearchHeaderProps) {
  return (
    <header className={`flex flex-col gap-4 md:flex-row md:items-center md:justify-between p-4 bg-card rounded-lg ${className}`}>
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold">
          {totalResults} Pets Found
        </h2>
        <div className="flex-1 md:w-48">
          <Select onValueChange={onSortChange} defaultValue="recent">
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="-recent">Oldest First</SelectItem>
              <SelectItem value="distance">Nearest</SelectItem>
              <SelectItem value="-distance">Farthest</SelectItem>
              <SelectItem value="random">Random</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={currentView === 'grid' ? 'default' : 'outline'}
          size="icon"
          onClick={() => onViewChange('grid')}
          title="Grid view"
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
        <Button
          variant={currentView === 'list' ? 'default' : 'outline'}
          size="icon"
          onClick={() => onViewChange('list')}
          title="List view"
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
} 