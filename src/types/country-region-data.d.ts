declare module 'country-region-data/dist/data-umd' {
  interface Country {
    countryName: string;
    countryShortCode: string;
    regions: Region[];
  }

  interface Region {
    name: string;
    shortCode: string;
  }

  const countryRegionData: Country[];
  export default countryRegionData;
}
