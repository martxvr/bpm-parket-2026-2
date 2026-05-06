import { getActiveBrands } from '@/lib/db/brands';
import { Navbar } from './Navbar';

export async function NavbarServer() {
  const brands = (await getActiveBrands()).slice(0, 4);
  return (
    <Navbar
      brands={brands.map((b) => ({
        slug: b.slug,
        name: b.name,
        logo_url: b.logo_url,
        description: b.description,
      }))}
    />
  );
}
