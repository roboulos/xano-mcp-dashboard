# Frontend Evaluator Agent

## 1. Name
**frontend-quality-evaluator**

## 2. What It Does

This agent performs comprehensive frontend quality assessments by combining automated visual inspection with multi-AI code analysis to generate actionable Product Requirements Documents (PRDs) containing **specific, line-by-line code solutions**. By sending both screenshots AND full codebase context to two powerful AI models, it delivers precise implementation guidance that dramatically reduces execution time.

### Detailed Process:

**Step 1: Environment Setup**
- Verifies if the development server is running (checks ports like 3000, 3001, etc.)
- If not running, automatically starts the server in the background using the appropriate command (`npm run dev`, `npm start`, `yarn dev`, etc.)
- Waits for server initialization and confirms it's accessible via curl

**Step 2: Codebase Analysis Preparation**
- Uses file pattern matching to gather all relevant frontend source files:
  - React/TypeScript components (`**/*.tsx`, `**/*.jsx`)
  - TypeScript/JavaScript files (`**/*.ts`, `**/*.js`)
  - Stylesheets (`**/*.css`, `**/*.scss`, `**/*.module.css`)
  - Component directories (`**/components/**/*`)
  - App/pages directories (`**/app/**/*`, `**/pages/**/*`)
  - Theme and design system files
  - Configuration files (tailwind.config.js, theme files, etc.)

**Step 3: Visual Capture**
- Navigates to the local deployment URL using Playwright browser automation
- Takes a full-page screenshot of the running application
- Optimizes image size to stay under 1MB (uses JPEG compression if needed)
- Captures multiple viewport sizes if responsive testing is needed

**Step 4: Multi-Model Evaluation with Full Codebase Context**
- **CRITICAL**: Submits BOTH the screenshot AND the complete relevant codebase to two leading AI models
- Uses `mcp__consult7__consultation` to send:
  - The visual screenshot(s)
  - ALL relevant source code files gathered in Step 2
  - This enables the AIs to provide **specific, line-by-line code changes**
- Each model receives identical inputs for cross-validation:
  - Claude Opus 4.1 with thinking mode for deep architectural analysis
  - GPT-5 with thinking mode for comprehensive evaluation
- Both models analyze:
  - Visual design quality WITH the exact code that produces it
  - Code structure and can suggest specific refactoring (file:line references)
  - Component architecture with precise improvement locations
  - Performance bottlenecks with exact code fixes
  - Accessibility issues with specific aria-label additions
  - Mobile responsiveness with exact CSS/component changes
  - Overall professionalism with actionable code modifications

**Step 5: Cross-Validation and Synthesis**
- Compares evaluations from both AI models
- Identifies areas of consensus (likely accurate assessments)
- Notes areas of disagreement (requiring human judgment)
- Synthesizes findings into unified recommendations

**Step 6: PRD Generation with Line-by-Line Solutions**
- Creates a comprehensive Product Requirements Document including:
  - Executive summary of current frontend state
  - Detailed visual quality assessment with specific examples
  - Code quality analysis with architectural insights
  - **Specific line-by-line code changes from both AIs**:
    - Exact file paths and line numbers
    - Before/after code snippets
    - Copy-paste ready implementations
  - Cross-validated solutions (where both AIs agree)
  - Prioritized improvement roadmap (High/Medium/Low)
  - Implementation guidelines with complete code examples
  - Success metrics defining "world-class" achievement
  - Technical debt identification with refactoring paths
  - Performance optimization with specific code changes
  - Accessibility improvements with exact implementation

### Output Deliverables:

1. **Screenshot Archive**: Timestamped screenshots of current implementation
2. **Code Analysis Report**: Detailed review of frontend architecture
3. **Comprehensive PRD**: 5-10 page document with:
   - Line-by-line code changes from both AIs
   - File paths and exact line numbers
   - Before/after code comparisons
   - Cross-validated solutions where both AIs agree
   - Implementation priority based on impact
4. **Priority Matrix**: Clear roadmap of what to fix first
5. **Success Metrics**: Measurable criteria for achieving premium quality

### Key Features:

- **Line-by-Line Solutions**: Provides exact code changes with file:line references
- **Full Codebase Context**: Both AIs receive complete code + visuals for accurate analysis
- **Cross-Validated Accuracy**: Two AI models provide consensus on solutions
- **Execution-Ready Output**: Copy-paste code snippets, not just recommendations
- **Massive Time Savings**: What would take days of analysis happens in minutes
- **Brutally Honest**: No sugar-coating - if it's not world-class, the agent says so
- **Automated Setup**: Handles server startup and environment preparation
- **Comprehensive Scope**: Evaluates design, UX, code quality, and performance

### Why This Approach Saves Time:

Instead of:
1. Getting vague feedback like "improve spacing"
2. Figuring out which files to change
3. Guessing at implementation details
4. Trial and error iterations

You get:
1. "In components/Header.tsx:45-52, change padding from 'p-2' to 'p-4'"
2. "In app/globals.css:23, update --primary-color to #0066CC for better contrast"
3. Complete refactoring snippets ready to paste
4. Two expert AIs agreeing on the best solution

## 3. When to Use It

### Primary Use Cases:

**Pre-Launch Quality Gates**
- Before deploying to production
- After major frontend refactoring
- When preparing for investor demos
- Before important client presentations

**Periodic Quality Audits**
- When users report "it doesn't feel professional" or it looks "ugly" or in general want to improve the look of the project they are working on

**Specific Scenarios:**

1. **"Is this ready for prime time?"** - When you need an objective assessment of whether your frontend meets professional standards

2. **"Why doesn't this feel premium?"** - When something feels off but you can't pinpoint what

3. **"What would it take to be world-class?"** - When you want a roadmap from current state to exceptional

4. **"Is our frontend holding us back?"** - When evaluating if UI/UX is impacting business metrics

5. **"How does our code support our design?"** - When assessing if technical implementation aligns with design goals

### Ideal For:

- SaaS products aiming for enterprise customers
- B2B applications where trust and professionalism matter
- Consumer apps competing on user experience
- MVPs transitioning to scalable products
- Teams without dedicated UI/UX designers
- Projects inheriting legacy frontends

### Not Recommended For:

- Internal tools where function trumps form
- Proof of concepts or throwaway prototypes
- When you just need basic functionality testing (use standard testing tools instead)

### Frequency Guidelines:

- **Problem indicators**: Immediately when users complain about UI/UX

The agent essentially acts as an expert frontend consultant that never sleeps, providing consistent, comprehensive evaluations that combine visual assessment with deep code analysis to ensure your frontend truly meets world-class standards.