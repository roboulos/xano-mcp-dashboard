# Practical AI Agents Based on Working Patterns

## Core Principle: Agents Are Workflows, Not Entities

These agents are specific instruction sets that chain tools together to achieve concrete results. They're based on patterns that actually work.

---

## 1. Frontend Visual Improver

**Title**: `frontend-visual-improver`

**What it does**:
Runs the dev server, takes screenshots with Playwright, sends them to multiple models with the codebase for specific improvements, implements the changes, then repeats the cycle 3 times.

**Detailed workflow**:
1. Start dev server in background (`npm run dev &`)
2. Use Playwright to navigate to localhost:3000
3. Take full-page screenshot
4. Send screenshot + relevant component files to GPT-5 and Claude Opus via consult7
5. Ask: "What are the specific line-by-line improvements for visual hierarchy, spacing, and polish?"
6. Cross-validate responses between models
7. Implement the agreed-upon changes
8. Repeat cycle 3 times for iterative improvement
9. Run final screenshot comparison

**When to use**:
- User says "improve the frontend" or "polish the UI"
- After major feature additions that need visual refinement
- Before demo days or launches
- When design consistency needs enforcement

**Tools required**:
- Bash (for running server)
- mcp__playwright__* (for screenshots)
- mcp__consult7__consultation (for multi-model analysis)
- Standard file editing tools

---

## 2. Codebase Deep Analyzer

**Title**: `codebase-deep-analyzer`

**What it does**:
Gathers ALL relevant files from a codebase, sends them in large batches to multiple models via consult7, asks progressively deeper questions until 95%+ confident about the complete implementation.

**Detailed workflow**:
1. Use Glob to find all source files (not just a few)
2. Group files by module/feature (max 50 files per consultation)
3. Send to GPT-5, Claude Opus 4.1, and Gemini 2.5 Pro
4. Initial question: "Explain the architecture and main patterns"
5. Follow-up questions based on gaps identified
6. Cross-validate understanding between models
7. Continue until confidence >95%
8. Create structured documentation of findings

**When to use**:
- User says "learn about this codebase"
- Before implementing complex features
- When approaching unfamiliar code
- User mentions "consult7" or "use multiple models"

**Tools required**:
- Glob (extensive file gathering)
- mcp__consult7__consultation
- File system tools for documentation output

---

## 3. Bug Hunt and Fix Chain

**Title**: `bug-hunt-fix-chain`

**What it does**:
First agent finds all bugs using deep analysis, creates organized bug report files. Second agent reads these files and systematically fixes each bug with testing.

**Detailed workflow**:

**Phase 1 - Bug Hunter**:
1. Send entire codebase to multiple models
2. Ask: "Find all bugs, type errors, security issues, and code smells"
3. Cross-validate findings between models
4. Create `bugs-found.md` with:
   - Bug description
   - File location
   - Line numbers
   - Suggested fix
   - Priority level

**Phase 2 - Bug Fixer**:
1. Read `bugs-found.md`
2. For each high-priority bug:
   - Read the file
   - Implement the fix
   - Run relevant tests
   - Mark as complete in tracking file
3. Create `bugs-fixed.md` with results

**When to use**:
- Before releases
- After user reports issues
- As regular maintenance
- When inheriting new codebases

---

## 4. Test Coverage Expander

**Title**: `test-coverage-expander`

**What it does**:
Analyzes codebase to find untested code, generates comprehensive tests by consulting multiple models about edge cases, implements tests, and verifies coverage increase.

**Detailed workflow**:
1. Run coverage report (`npm test -- --coverage`)
2. Identify files with <80% coverage
3. For each file:
   - Send to consult7 with prompt: "What are ALL edge cases for this code?"
   - Get test suggestions from 3 models
   - Implement most comprehensive test suite
   - Run tests to verify they pass
4. Re-run coverage to confirm improvement
5. Continue until target coverage reached

**When to use**:
- User wants to improve test coverage
- Before major refactoring
- When code reliability is questioned
- As part of CI/CD pipeline

---

## 5. API Endpoint Builder

**Title**: `api-endpoint-builder`

**What it does**:
Takes natural language API requirements, consults multiple models for best implementation approach, generates endpoint code, tests it thoroughly, then documents it.

**Detailed workflow**:
1. Parse user requirements
2. Send to consult7: "What's the best way to implement this API endpoint considering our stack?"
3. Cross-validate approaches
4. Generate endpoint code
5. Create test file with edge cases
6. Run tests in isolation
7. Generate API documentation
8. Test with curl commands

**When to use**:
- User describes API needs in natural language
- Adding new endpoints to existing API
- Refactoring API structure
- Creating webhook handlers

---

## 6. Performance Optimizer

**Title**: `performance-optimizer`

**What it does**:
Runs performance profiling, sends results to multiple models for analysis, implements agreed-upon optimizations, measures improvement, repeats until targets met.

**Detailed workflow**:
1. Run Lighthouse CI or performance profiler
2. Capture metrics (FCP, TTI, bundle size, etc.)
3. Send metrics + code to consult7
4. Ask: "What are the highest-impact optimizations?"
5. Implement top 3 suggestions
6. Re-run performance tests
7. Document improvements
8. Repeat if targets not met

**When to use**:
- Page load times are slow
- Bundle size is too large
- Users complain about performance
- Before launching to production

---

## 7. Documentation Synchronizer

**Title**: `documentation-synchronizer`

**What it does**:
Compares code with documentation, identifies mismatches, updates docs to match reality, adds missing examples, ensures accuracy.

**Detailed workflow**:
1. Read all documentation files
2. For each documented feature:
   - Find implementation in code
   - Send both to consult7
   - Ask: "Does the documentation match the implementation?"
3. Update documentation with:
   - Correct signatures
   - Working examples
   - Current behavior
4. Add missing documentation for undocumented features
5. Verify examples actually run

**When to use**:
- After feature changes
- When docs feel out of date
- Before public releases
- Regular maintenance

---

## 8. Deployment Validator

**Title**: `deployment-validator`

**What it does**:
Runs through complete deployment process in staging, tests all critical paths, compares with production, ensures safe deployment.

**Detailed workflow**:
1. Deploy to staging environment
2. Use Playwright to test critical user flows
3. Compare staging vs production metrics
4. Run API endpoint tests
5. Check for console errors
6. Verify environment variables
7. Create deployment checklist
8. Only approve if all checks pass

**When to use**:
- Before any production deployment
- After major changes
- When deployment issues have occurred
- As part of CI/CD pipeline

---

## Key Differences from Theoretical Agents

1. **Concrete Steps**: Each agent is a specific sequence of tool uses
2. **Multi-Model Validation**: Heavy use of consult7 for accuracy
3. **File-Based Communication**: Agents communicate through structured files
4. **Visual Feedback**: Use of screenshots for frontend work
5. **Iterative Cycles**: Multiple passes for improvement
6. **Clear Success Criteria**: Measurable outcomes (coverage %, performance metrics)

## Usage Pattern

```bash
# Chain agents together
"Use codebase-deep-analyzer to understand the authentication system"
"Use bug-hunt-fix-chain to find and fix all auth-related bugs"
"Use test-coverage-expander to ensure auth code has 95% coverage"
"Use deployment-validator before pushing to production"
```

Each agent completes its full workflow before the next begins, creating a reliable pipeline of improvements.