import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { FormLabel } from '@/components/ui/form';

interface FilterValues {
  breed: string;
  age: string;
  size: string;
  gender: string;
  coat: string;
  goodWith: string[];
  care: string[];
}

interface PetFilterSidebarProps {
  breeds?: string[];
  onFilter: (values: FilterValues) => void;
  className?: string;
  defaultValues?: FilterValues;
}

export function PetFilterSidebar({ 
  breeds = [], 
  onFilter, 
  className = '',
  defaultValues = {
    breed: 'any',
    age: 'any',
    size: 'any',
    gender: 'any',
    coat: 'any',
    goodWith: [],
    care: [],
  }
}: PetFilterSidebarProps) {
  const [values, setValues] = useState<FilterValues>(defaultValues);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(values);
  };

  const handleSelectChange = (value: string, field: keyof FilterValues) => {
    setValues(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (checked: boolean | 'indeterminate', value: string, field: 'goodWith' | 'care') => {
    if (typeof checked !== 'boolean') return;
    
    setValues(prev => {
      const current = prev[field];
      const updated = checked
        ? [...current, value]
        : current.filter((v) => v !== value);
      return { ...prev, [field]: updated };
    });
  };

  return (
    <aside className={`w-full bg-card rounded-lg ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* First Column - Breed, Age, Size */}
            <div className="space-y-4">
              <div>
                <FormLabel>Breed</FormLabel>
                <Select value={values.breed} onValueChange={(value) => handleSelectChange(value, 'breed')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any breed" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any breed</SelectItem>
                    {breeds.map((breed) => (
                      <SelectItem key={breed} value={breed}>
                        {breed}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <FormLabel>Age</FormLabel>
                <Select value={values.age} onValueChange={(value) => handleSelectChange(value, 'age')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any age" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any age</SelectItem>
                    <SelectItem value="baby">Baby</SelectItem>
                    <SelectItem value="young">Young</SelectItem>
                    <SelectItem value="adult">Adult</SelectItem>
                    <SelectItem value="senior">Senior</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <FormLabel>Size</FormLabel>
                <Select value={values.size} onValueChange={(value) => handleSelectChange(value, 'size')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any size</SelectItem>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                    <SelectItem value="xlarge">Extra Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Second Column - Gender, Coat */}
            <div className="space-y-4">
              <div>
                <FormLabel>Gender</FormLabel>
                <Select value={values.gender} onValueChange={(value) => handleSelectChange(value, 'gender')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any gender</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <FormLabel>Coat</FormLabel>
                <Select value={values.coat} onValueChange={(value) => handleSelectChange(value, 'coat')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any coat type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any coat type</SelectItem>
                    <SelectItem value="short">Short</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="long">Long</SelectItem>
                    <SelectItem value="wire">Wire</SelectItem>
                    <SelectItem value="hairless">Hairless</SelectItem>
                    <SelectItem value="curly">Curly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="grid grid-cols-2 gap-8">
            {/* Good With Column */}
            <div className="space-y-4">
              <FormLabel>Good With</FormLabel>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="kids"
                    checked={values.goodWith.includes('kids')}
                    onCheckedChange={(checked) => handleCheckboxChange(checked, 'kids', 'goodWith')}
                  />
                  <label htmlFor="kids" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Kids</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="dogs"
                    checked={values.goodWith.includes('dogs')}
                    onCheckedChange={(checked) => handleCheckboxChange(checked, 'dogs', 'goodWith')}
                  />
                  <label htmlFor="dogs" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Dogs</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="cats"
                    checked={values.goodWith.includes('cats')}
                    onCheckedChange={(checked) => handleCheckboxChange(checked, 'cats', 'goodWith')}
                  />
                  <label htmlFor="cats" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Cats</label>
                </div>
              </div>
            </div>

            {/* Care & Behavior Column */}
            <div className="space-y-4">
              <FormLabel>Care & Behavior</FormLabel>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="house_trained"
                    checked={values.care.includes('house_trained')}
                    onCheckedChange={(checked) => handleCheckboxChange(checked, 'house_trained', 'care')}
                  />
                  <label htmlFor="house_trained" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">House Trained</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="special_needs"
                    checked={values.care.includes('special_needs')}
                    onCheckedChange={(checked) => handleCheckboxChange(checked, 'special_needs', 'care')}
                  />
                  <label htmlFor="special_needs" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Special Needs</label>
                </div>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Apply Filters
          </Button>
        </div>
      </form>
    </aside>
  );
} 