'use client';

import { useState } from 'react';
import type { PetSearchParams } from '@/lib/petfinder';
import { ChevronDownIcon } from 'lucide-react';

import { PetCard } from '@/components/PetCard';
import { PetSearchForm } from '@/components/PetSearchForm';
import { PetSearchHeader } from '@/components/PetSearchHeader';
import { petfinderService } from '@/lib/petfinder';
import { FilterDialog } from '@/components/FilterDialog';

interface Animal {
  id: number;
  name: string;
  type: string;
  breeds: {
    primary: string;
    secondary?: string;
  };
  age: string;
  photos: Array<{
    small: string;
    medium: string;
    large: string;
    full: string;
  }>;
  contact: {
    address: {
      city: string;
      state: string;
    };
  };
  status: string;
}

interface PetfinderResponse {
  animals: Animal[];
  pagination: {
    count_per_page: number;
    total_count: number;
    current_page: number;
    total_pages: number;
  };
}

interface FilterFormValues {
  breed?: string;
  age?: string;
  size?: string;
  gender?: string;
  coat?: string;
  goodWith?: string[];
  care?: string[];
}

export default function Home() {
  const [pets, setPets] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [currentView, setCurrentView] = useState<'grid' | 'list'>('grid');
  const [breeds, setBreeds] = useState<string[]>([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [searchParams, setSearchParams] = useState<PetSearchParams>({
    type: '',
    location: '',
  });
  const [filterValues, setFilterValues] = useState<FilterFormValues>({
    breed: 'any',
    age: 'any',
    size: 'any',
    gender: 'any',
    coat: 'any',
    goodWith: [],
    care: [],
  });

  const handleSearch = async (params: PetSearchParams) => {
    setLoading(true);
    try {
      // Combine search params with filter values
      const combinedParams = {
        ...params,
        ...(filterValues.breed !== 'any' && { breed: filterValues.breed }),
        ...(filterValues.age !== 'any' && { age: filterValues.age }),
        ...(filterValues.size !== 'any' && { size: filterValues.size }),
        ...(filterValues.gender !== 'any' && { gender: filterValues.gender }),
        ...(filterValues.coat !== 'any' && { coat: filterValues.coat }),
        ...(filterValues.goodWith?.includes('kids') && { good_with_children: true }),
        ...(filterValues.goodWith?.includes('dogs') && { good_with_dogs: true }),
        ...(filterValues.goodWith?.includes('cats') && { good_with_cats: true }),
        ...(filterValues.care?.includes('house_trained') && { house_trained: true }),
        ...(filterValues.care?.includes('special_needs') && { special_needs: true }),
      };

      const results = await petfinderService.searchPets(combinedParams);
      setPets(results.animals);
      setTotalResults(results.pagination.total_count);
      setError(null);
      setSearchParams(params);

      // Fetch breeds for the selected animal type
      if (params.type) {
        const breedsData = await petfinderService.getBreeds(params.type);
        setBreeds(breedsData.map(breed => breed.name));
      }
    } catch (err) {
      setPets([]);
      setError('Failed to fetch pets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (values: FilterFormValues) => {
    setFilterValues(values);
  };

  const handleSort = async (sortValue: string) => {
    await handleSearch({ ...searchParams, sort: sortValue });
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-4xl font-bold">Find Your Perfect Pet</h1>
      
      {/* Desktop Search Form */}
      <div className="mb-8">
        <PetSearchForm 
          onSearch={handleSearch} 
          breeds={breeds}
          onFilter={handleFilter}
        />
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex-1">
          {loading && (
            <div className="flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          )}

          {error && (
            <div className="mb-8 rounded-md bg-destructive/15 p-4 text-destructive">
              {error}
            </div>
          )}

          {pets.length > 0 ? (
            <>
              <PetSearchHeader
                totalResults={totalResults}
                onSortChange={handleSort}
                onViewChange={setCurrentView}
                currentView={currentView}
                className="mb-6"
              />

              <div className={
                currentView === 'grid'
                  ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                  : "flex flex-col gap-4"
              }>
                {pets.map((pet) => (
                  <PetCard
                    key={pet.id}
                    name={pet.name}
                    type={pet.type}
                    breed={pet.breeds.primary}
                    age={pet.age}
                    location={`${pet.contact.address.city}, ${pet.contact.address.state}`}
                    imageUrl={pet.photos[0]?.medium}
                    status={pet.status.toLowerCase()}
                    layout={currentView}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center text-muted-foreground">
              Search for pets by selecting an animal type and entering your ZIP code.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
