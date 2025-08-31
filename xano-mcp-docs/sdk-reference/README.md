# Xano MCP SDK Documentation

Welcome to the comprehensive documentation for the Xano MCP SDK. This SDK allows you to write API endpoints using familiar JavaScript syntax that translates to XanoScript.

## Documentation Structure

### 📚 [SDK Overview](./sdk-overview.md)
Start here to understand what the SDK is, how it works, and when to use it.
- Architecture overview
- Key features and benefits
- Success metrics
- Getting started guide

### 📖 [API Reference](./sdk-api-reference.md)
Complete reference for all SDK methods and functions.
- Core methods (create, input, response, build)
- Database operations (dbQuery, dbGet, dbAdd, dbEdit, dbDelete)
- Authentication methods
- Control flow (conditionals, loops)
- External APIs and storage
- Filter reference

### 🎯 [Common Patterns](./sdk-patterns.md)
Best practices and real-world examples.
- Authentication flows
- CRUD operations
- Error handling
- Caching strategies
- External API integration
- Performance optimization

### ⚙️ [SDK Internals](./sdk-internals.md)
Deep dive into how the SDK works under the hood.
- Translation pipeline
- Auto-fixing mechanism
- XanoScript generation
- Deployment process
- Performance considerations

### 🔧 [Troubleshooting Guide](./sdk-troubleshooting.md)
Solutions to common problems and debugging techniques.
- Error message meanings
- Common mistakes and fixes
- Debugging strategies
- FAQ

## Quick Start

### 1. Basic Endpoint
```javascript
const endpoint = create('hello-world', 'GET')
  .input('name', 'text', { required: false, defaultValue: 'World' })
  .response({ message: '"Hello, "|concat:$input.name|concat:"!"' });

return endpoint.build().script;
```

### 2. Database Query
```javascript
const endpoint = create('list-users', 'GET')
  .requiresAuth('👤 users')
  .dbQuery('users', {
    filters: { status: 'active' },
    pagination: { page: '$input.page', per_page: 20 }
  }, 'users')
  .response({ 
    data: '$users.items',
    total: '$users.itemsTotal'
  });

return endpoint.build().script;
```

### 3. External API Call
```javascript
const endpoint = create('weather', 'GET')
  .input('city', 'text', { required: true })
  .apiGet('https://api.openweathermap.org/data/2.5/weather', {
    query: buildObject({
      q: '$input.city',
      appid: '$env.WEATHER_API_KEY'
    })
  }, 'weather')
  .response({ 
    temperature: '$weather.main.temp',
    description: '$weather.weather[0].description'
  });

return endpoint.build().script;
```

## Key Concepts

### 1. Global Functions
These are available without import:
- `create()` - Start building an endpoint
- `buildObject()` - Create dynamic objects
- `buildArray()` - Create dynamic arrays
- `filters` - Access filter methods

### 2. Method Chaining
All builder methods return the builder instance:
```javascript
create('endpoint', 'GET')
  .input(...)     // returns builder
  .var(...)       // returns builder
  .response(...)  // returns builder
```

### 3. Variable References
- Use `$` prefix: `$input.name`, `$user.id`
- Special values: `'now'`, `'uuid'`, `'"null"'`

### 4. Filter Pipelines
Transform data using pipes:
```javascript
'$text|lowercase|trim|replace:" ":"-"'
```

## Important Notes

### ✅ DO
- Always end with `return endpoint.build().script;`
- Use `filters` (plural) in dbQuery
- Use `forEach` with capital F
- Build complex objects as variables first
- Check the generated XanoScript preview

### ❌ DON'T
- Import global functions (create, buildObject, etc.)
- Use `filter` (singular) in dbQuery
- Use `foreach` (lowercase)
- Put nested objects directly in response
- Forget to close conditionals/loops

## Success Metrics

Based on extensive testing:
- **Core operations**: 95%+ success rate
- **Common patterns**: 95%+ success rate
- **Advanced patterns**: 76.4% success rate
- **Auto-fix rate**: 60-65% of common errors

## Version Information

- **Current SDK Version**: Production (August 2025)
- **Compatible Instance**: `xnwv-v1z6-dvnr`
- **Success Rate**: 76.4% overall
- **Tested Patterns**: 200+

## Contributing

The SDK is actively maintained and improved based on real-world usage. Common patterns that fail are identified and fixed in regular updates.

## Support

For issues not covered in the documentation:
1. Check the [Troubleshooting Guide](./sdk-troubleshooting.md)
2. Review the [SDK Internals](./sdk-internals.md) for deeper understanding
3. Test incrementally with simple patterns first
4. Always check the `xanoscript_preview` in deployment responses

---

*This documentation reflects the current state of the SDK as of August 2025, with 95%+ confidence based on multi-model analysis and production testing.*