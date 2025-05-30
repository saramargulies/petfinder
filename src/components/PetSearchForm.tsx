import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useState } from 'react';
import { toast } from 'sonner';
import { Cat, Dog, Bird, Rabbit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FilterDialog } from '@/components/FilterDialog';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const searchFormSchema = z.object({
  type: z.string().min(1, 'Please select an animal type'),
  location: z.string().min(2, 'Please enter a valid location'),
  distance: z.string().optional(),
});

type SearchFormValues = z.infer<typeof searchFormSchema>;

interface PetSearchFormProps {
  onSearch: (values: SearchFormValues) => void;
  breeds?: string[];
  onFilter?: (values: any) => void;
}

const animalTypes = [
  { value: 'dog', label: 'Dogs', icon: Dog },
  { value: 'cat', label: 'Cats', icon: Cat },
  { value: 'rabbit', label: 'Rabbits', icon: Rabbit },
  { value: 'bird', label: 'Birds', icon: Bird },
] as const;

const distances = [
  { value: '10', label: '10 miles' },
  { value: '25', label: '25 miles' },
  { value: '50', label: '50 miles' },
  { value: '100', label: '100 miles' },
  { value: '500', label: 'Any distance' },
] as const;

export function PetSearchForm({ onSearch, breeds = [], onFilter }: PetSearchFormProps) {
  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      type: '',
      location: '',
      distance: '25',
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: SearchFormValues) => {
    setIsLoading(true);
    try {
      await onSearch(data);
    } catch (error) {
      toast.error('Failed to search for pets. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-2xl mx-auto">
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">I'm looking for...</FormLabel>
                <FormMessage />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {animalTypes.map((animal) => {
                    const Icon = animal.icon;
                    return (
                      <Button
                        key={animal.value}
                        type="button"
                        variant={field.value === animal.value ? "outline" : "outline"}
                        className={cn(
                          "h-24 flex-col gap-2 rounded-lg bg-white",
                          field.value === animal.value && "bg-blue-50 border-blue-500"
                        )}
                        onClick={() => field.onChange(animal.value)}
                      >
                        <Icon className="h-8 w-8" />
                        {animal.label}
                      </Button>
                    );
                  })}
                </div>
              </FormItem>
            )}
          />

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <FormLabel className="block pb-1.5">Near ZIP code</FormLabel>
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <input
                        {...field}
                        className="flex h-12 w-full rounded-lg border border-input bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Enter ZIP code"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex-1 md:w-[140px]">
              <FormLabel className="block pb-1.5">Within</FormLabel>
              <FormField
                control={form.control}
                name="distance"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="!h-12 w-full bg-white rounded-lg">
                          <SelectValue placeholder="Select distance" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {distances.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-4 w-full md:w-auto md:self-end">
              {onFilter && (
                <FilterDialog breeds={breeds} onFilter={onFilter} />
              )}
              
              <Button 
                type="submit" 
                size="lg"
                className="h-12 flex-1 md:flex-none md:w-auto px-8 rounded-lg bg-[#10182C] text-white hover:bg-[#10182C]/90" 
                disabled={isLoading}
              >
                {isLoading ? 'Searching...' : 'Search Pets'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
} 