// Country filtering utility
export function filterCountries(
  countries: CountryRegion[],
  searchTerm: string
) {
  if (!searchTerm) return countries;

  return countries.filter(
    country =>
      country.countryName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.countryShortCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );
}

// Dummy type for country region data
export interface CountryRegion {
  countryName: string;
  countryShortCode: string;
  regions: Array<{
    name: string;
    shortCode: string;
  }>;
}
