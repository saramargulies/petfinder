import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PawIcon } from '@/components/icons/PawIcon';

interface PetCardProps {
  name: string;
  type: string;
  breed: string;
  age: string;
  location: string;
  imageUrl?: string;
  status: string;
  layout?: 'grid' | 'list';
}

export function PetCard({
  name,
  type,
  breed,
  age,
  location,
  imageUrl,
  status,
  layout = 'grid',
}: PetCardProps) {
  if (layout === 'list') {
    return (
      <Card className="overflow-hidden">
        <div className="flex">
          <div className="relative h-40 w-40 flex-shrink-0">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={`Photo of ${name}`}
                fill
                className="object-cover"
                sizes="160px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <PawIcon className="h-16 w-16 text-muted-foreground/25" />
              </div>
            )}
          </div>
          <div className="flex flex-1 flex-col justify-between p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{name}</h3>
                <p className="text-sm text-muted-foreground">{breed}</p>
                <p className="mt-2 text-sm text-muted-foreground">{location}</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">{type}</div>
                <div className="text-sm text-muted-foreground">{age}</div>
                <Badge
                  variant={status === 'adoptable' ? 'default' : 'secondary'}
                  className="mt-2"
                >
                  {status}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-square w-full">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`Photo of ${name}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <PawIcon className="h-24 w-24 text-muted-foreground/25" />
          </div>
        )}
        <div className="absolute right-2 top-2">
          <Badge variant={status === 'adoptable' ? 'default' : 'secondary'}>
            {status}
          </Badge>
        </div>
      </div>
      <CardHeader className="space-y-1">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold">{name}</h3>
            <p className="text-sm text-muted-foreground">{breed}</p>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">{type}</div>
            <div className="text-sm text-muted-foreground">{age}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{location}</p>
      </CardContent>
    </Card>
  );
}
