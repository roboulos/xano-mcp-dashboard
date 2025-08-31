# Xano MCP SDK Production Readiness PRD

## Executive Summary

The Xano MCP SDK is a powerful system that successfully reduces XanoScript complexity by ~95% through a JavaScript fluent-builder pattern. Currently at ~97% functionality, it needs specific fixes and enhancements to be production-ready. The SDK is the most differentiated part of the system and represents the key value proposition.

### Current State
- **Working Well**: Core CRUD, auth, external APIs, auto-fixing (65% of AI mistakes)
- **Critical Issues**: TypeScript type safety, missing methods, inconsistent patterns
- **Missing Features**: Task/function creation, realtime support, comprehensive error handling

### Priority Actions
1. Fix buildObject/setFilter type errors
2. Add task and function creation support
3. Improve TypeScript type safety
4. Standardize method naming and patterns
5. Complete documentation alignment

## 1. Current SDK Issues & Fixes

### 1.1 buildObject/setFilter Type Error

**Issue**: The SDK's `buildObject` implementation works correctly but has TypeScript type issues.

**Current Implementation**:
```typescript
static buildObject(obj: Record<string, any>): string {
  // Returns: {}|set:"key":value|set:"key2":value2
}
```

**Problem**: TypeScript `any` usage throughout prevents proper type checking and IDE support.

**Fix Required**:
```typescript
// Define proper types for buildObject inputs
type XanoValue = string | number | boolean | null | XanoVariable | XanoExpression;
type XanoVariable = `$${string}`;
type XanoExpression = string; // For complex expressions

interface BuildObjectInput {
  [key: string]: XanoValue | BuildObjectInput | XanoValue[];
}

static buildObject(obj: BuildObjectInput): string {
  // Implementation remains the same, but with type safety
}
```

### 1.2 Missing/Inconsistent Methods

**Current Issues**:
- `.dbQuerySingle()` - Not documented, replace with `.dbGet()` or `.dbQuery().limit(1)`
- `.dbBulkDelete()` - Not in SDK, needs implementation or pattern
- `.dbAddOrEdit()` - Missing, needs implementation
- `.createImage()` - Should be `.storageCreateImage()`
- `.utilGetInput()` - Undocumented, needs clarification
- `.lambda()` - Not supported, remove from code

**Fixes**:
```typescript
// Add missing methods to FluentBuilder
dbBulkDelete(table: string, ids: string[], alias?: string): FluentBuilder {
  return this.dbQuery(table, { filter: { id: { $in: ids } } }, 'temp')
    .forEach('$temp.items', 'item')
    .dbDelete(table, { id: '$item.id' }, 'deleted')
    .endForEach();
}

dbAddOrEdit(table: string, uniqueField: string, data: any, alias?: string): FluentBuilder {
  const tempAlias = alias || 'result';
  return this.dbGet(table, { [uniqueField]: data[uniqueField] }, 'existing')
    .conditional('$existing != null')
    .then(b => b.dbEdit(table, { id: '$existing.id' }, data, tempAlias))
    .else(b => b.dbAdd(table, data, tempAlias))
    .endConditional();
}
```

### 1.3 Filter Name Inconsistencies

**Issue**: `filters` (plural) vs `filter` (singular) in dbQuery

**Current Auto-fix**: Changes `filters:` to `filter:`

**Required Actions**:
1. Update all documentation to use `filter` (singular)
2. Add TypeScript interface enforcement:
```typescript
interface DbQueryOptions {
  filter?: Record<string, any>;  // NOT filters
  sort?: Record<string, 'asc' | 'desc'>;
  page?: number;
  per_page?: number;
  search?: string;
}
```

## 2. Task & Function Creation Implementation

### 2.1 Current State
- Basic support exists through `createTask()` and `createFunction()`
- Missing comprehensive builder methods
- Schedule support partially implemented

### 2.2 Required Implementation

```typescript
// Task creation with full support
interface TaskSchedule {
  type: 'cron' | 'interval' | 'webhook';
  cron?: string;
  interval?: number;
  webhook?: string;
}

class TaskBuilder extends FluentBuilder {
  schedule(config: TaskSchedule): TaskBuilder {
    // Implementation
  }
  
  webhook(path: string): TaskBuilder {
    // Implementation
  }
  
  cron(expression: string): TaskBuilder {
    // Implementation
  }
  
  interval(seconds: number): TaskBuilder {
    // Implementation
  }
}

// Function creation with parameter support
class FunctionBuilder extends FluentBuilder {
  param(name: string, type: XanoType, required?: boolean): FunctionBuilder {
    // Implementation
  }
  
  returns(type: XanoType): FunctionBuilder {
    // Implementation
  }
}
```

### 2.3 Usage Examples
```javascript
// Task creation
const task = createTask('cleanup-old-records')
  .cron('0 0 * * *')  // Daily at midnight
  .dbQuery('sessions', { 
    filter: { 
      created_at: { $lt: 'now|subtract:86400' } 
    } 
  }, 'old_sessions')
  .forEach('$old_sessions.items', 'session')
    .dbDelete('sessions', { id: '$session.id' })
  .endForEach()
  .response({ deleted: '$old_sessions.itemsTotal' });

// Function creation
const func = createFunction('calculate-tax')
  .param('amount', 'decimal', true)
  .param('rate', 'decimal')
  .var('rate', '$input.rate || 0.08')
  .var('tax', '$input.amount|multiply:$rate')
  .returns('decimal')
  .response('$tax');
```

## 3. TypeScript Type Safety Improvements

### 3.1 Current Issues
- Extensive use of `any` throughout codebase
- No type safety for XanoScript expressions
- Missing return type information
- No compile-time validation

### 3.2 Required Type System

```typescript
// Core type definitions
type XanoType = 'text' | 'int' | 'decimal' | 'bool' | 'timestamp' | 
                'date' | 'email' | 'object' | 'array' | 'file';

interface XanoTable {
  name: string;
  fields: Record<string, XanoField>;
}

interface XanoField {
  type: XanoType;
  required?: boolean;
  unique?: boolean;
}

// Builder with type safety
class FluentBuilder<TInput = any, TOutput = any> {
  input<K extends string, T extends XanoType>(
    name: K, 
    type: T
  ): FluentBuilder<TInput & Record<K, TypeMap[T]>, TOutput>;
  
  dbQuery<T extends keyof Tables>(
    table: T,
    options: QueryOptions<Tables[T]>,
    alias?: string
  ): FluentBuilder<TInput, TOutput>;
}

// Type mapping
interface TypeMap {
  'text': string;
  'int': number;
  'decimal': number;
  'bool': boolean;
  'timestamp': Date;
  'object': Record<string, any>;
  'array': any[];
}
```

## 4. Low-Hanging Fruit Improvements

### 4.1 Immediate Fixes (1-2 days)

1. **Remove Problematic Auto-fixes**:
   - Fix 10: "Chained field access" - Returns invalid placeholder
   - Fix 12: Auto-adding default 0 - Hides real bugs

2. **Standardize Method Names**:
   - Document all supported methods
   - Remove unsupported method calls
   - Add deprecation warnings

3. **Fix Response Structure**:
   ```javascript
   // Standardize apiRequest response
   interface ApiResponse {
     status: number;
     body: any;  // Not response.result
     headers?: Record<string, string>;
   }
   ```

4. **Update Documentation**:
   - Change all `filters` to `filter`
   - Remove references to unsupported methods
   - Add working examples for every method

### 4.2 Quick Wins (3-5 days)

1. **Add Missing Methods**:
   ```typescript
   // Helper methods that developers expect
   dbCount(table: string, filter?: any): FluentBuilder;
   dbExists(table: string, filter: any): FluentBuilder;
   sleep(ms: number): FluentBuilder;
   log(message: string, data?: any): FluentBuilder;
   ```

2. **Improve Error Messages**:
   ```typescript
   class SDKError extends Error {
     constructor(
       message: string,
       public code: string,
       public suggestion?: string,
       public documentation?: string
     ) {
       super(message);
     }
   }
   ```

3. **Add Method Chaining Validation**:
   ```typescript
   // Prevent invalid method calls
   class ApiBuilder {
     response(data: any): TerminalBuilder; // Can't chain after response
   }
   
   class TerminalBuilder {
     build(): { script: string };
     // No other methods available
   }
   ```

## 5. Production Readiness Checklist

### 5.1 Critical Path (Must Have)
- [ ] Fix TypeScript types for buildObject/buildArray
- [ ] Implement task and function creation
- [ ] Standardize all method names
- [ ] Fix filter/filters inconsistency
- [ ] Add comprehensive error handling
- [ ] Complete test coverage (current: ~15% → target: 80%)

### 5.2 Important (Should Have)
- [ ] Remove hardcoded endpoints
- [ ] Refactor monolithic index.ts
- [ ] Add request/response validation
- [ ] Implement proper logging
- [ ] Add performance monitoring
- [ ] Create migration guides

### 5.3 Nice to Have
- [ ] Visual XanoScript debugger
- [ ] AST-based code generation
- [ ] Plugin system for extensions
- [ ] VS Code extension
- [ ] Interactive playground

## 6. Implementation Plan

### Phase 1: Critical Fixes (Week 1)
1. Fix TypeScript types throughout SDK
2. Implement missing core methods
3. Standardize method naming
4. Update all documentation

### Phase 2: Feature Completion (Week 2)
1. Add task creation support
2. Add function creation support
3. Implement comprehensive error handling
4. Add validation for all inputs

### Phase 3: Quality & Testing (Week 3)
1. Increase test coverage to 80%
2. Add integration tests
3. Performance optimization
4. Security audit

### Phase 4: Production Prep (Week 4)
1. Remove hardcoded values
2. Add monitoring/logging
3. Create deployment guides
4. Beta testing with users

## 7. Success Metrics

### Technical Metrics
- Test coverage: 80%+
- TypeScript coverage: 100%
- Build time: <5 seconds
- Bundle size: <100KB

### User Metrics
- SDK adoption rate: 50%+ of users
- Error rate: <1%
- Time to first endpoint: <5 minutes
- Support tickets: <10/week

### Business Metrics
- Token savings: 95%+ maintained
- User retention: 80%+ monthly
- Feature completion: 100% of advertised
- Documentation accuracy: 100%

## 8. Risk Mitigation

### Technical Risks
1. **Breaking Changes**: Version SDK properly, maintain compatibility
2. **Performance**: Monitor bundle size, optimize critical paths
3. **Complexity**: Keep API surface small, focus on common patterns

### User Risks
1. **Learning Curve**: Provide extensive examples, video tutorials
2. **Migration**: Create automated migration tools
3. **Debugging**: Add clear error messages, debugging tools

## 9. Next Steps

### Immediate Actions (This Week)
1. Fix buildObject TypeScript types
2. Audit and fix all method inconsistencies
3. Update documentation to match reality
4. Create comprehensive test suite

### Short Term (Next 2 Weeks)
1. Implement task/function builders
2. Refactor for type safety
3. Add missing helper methods
4. Beta test with power users

### Long Term (Next Month)
1. Launch production version
2. Create VS Code extension
3. Build visual debugger
4. Expand to new use cases

## Conclusion

The Xano MCP SDK is close to production readiness but requires focused effort on type safety, method standardization, and feature completion. The buildObject/setFilter issue is symptomatic of broader TypeScript problems that need systematic fixing. With proper implementation of task/function creation and comprehensive testing, the SDK can deliver on its promise of 95%+ complexity reduction while maintaining reliability.