import { useState } from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PetFilterSidebar } from '@/components/PetFilterSidebar';

const defaultFilters = {
  breed: 'any',
  age: 'any',
  size: 'any',
  gender: 'any',
  coat: 'any',
  goodWith: [],
  care: [],
};

interface FilterDialogProps {
  breeds: string[];
  onFilter: (values: any) => void;
}

export function FilterDialog({ breeds, onFilter }: FilterDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog modal open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-12 gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Filters</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <PetFilterSidebar
            breeds={breeds}
            onFilter={(values) => {
              onFilter(values);
              setOpen(false);
            }}
            defaultValues={defaultFilters}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
} 