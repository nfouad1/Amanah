# Design Document: Donation Report Generation

## Overview

The donation report generation system enables members to generate PDF reports of their donation history for tax purposes and allows administrators to generate comprehensive campaign reports with statistics. The system supports multi-language output (English, Swedish, Arabic with RTL), role-based access control, and flexible filtering options.

This feature integrates with the existing Next.js application using App Router API routes, leverages the current Prisma data models, and implements PDF generation using the react-pdf library for server-side rendering.

### Key Design Decisions

1. **PDF Generation Library**: Use `@react-pdf/renderer` for server-side PDF generation with React components, enabling consistent styling and RTL support
2. **On-Demand Generation**: Generate reports dynamically without server-side storage to minimize storage costs and privacy concerns
3. **API Route Architecture**: Implement two separate API routes (`/api/reports/donation` and `/api/reports/campaign`) for clear separation of concerns
4. **Localization Strategy**: Reuse existing i18n infrastructure and extend it for report-specific translations
5. **Authentication**: Leverage existing localStorage-based auth system with server-side validation

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer                             │
│  ┌──────────────────┐         ┌──────────────────┐         │
│  │ Member Dashboard │         │ Admin Dashboard  │         │
│  │  - Report Form   │         │  - Report Form   │         │
│  │  - Date Filters  │         │  - Campaign      │         │
│  │                  │         │    Selection     │         │
│  └────────┬─────────┘         └────────┬─────────┘         │
└───────────┼──────────────────────────────┼──────────────────┘
            │                              │
            │ HTTP POST                    │ HTTP POST
            │                              │
┌───────────▼──────────────────────────────▼──────────────────┐
│                     API Layer                                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  /api/reports/donation                               │  │
│  │  - Validate user auth & role                         │  │
│  │  - Validate date range                               │  │
│  │  - Query user contributions                          │  │
│  │  - Generate PDF                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  /api/reports/campaign                               │  │
│  │  - Validate admin role                               │  │
│  │  - Query campaigns & contributions                   │  │
│  │  - Calculate statistics                              │  │
│  │  - Generate PDF                                      │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────┬──────────────────────────────────────────────────┘
            │
            │ Prisma Queries
            │
┌───────────▼──────────────────────────────────────────────────┐
│                   Data Layer                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Contribution │  │   Campaign   │  │     User     │      │
│  │    Model     │  │    Model     │  │    Model     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└───────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Member Donation Report**:
   - User submits report request with optional date range and language preference
   - API validates user authentication and role (member, contributor, or admin)
   - System queries contributions filtered by user ID and date range
   - PDF generator creates localized report with contribution details
   - Response streams PDF file to client with appropriate headers

2. **Admin Campaign Report**:
   - Admin submits report request with campaign selection filters
   - API validates admin role
   - System queries campaigns and related contributions
   - Statistics calculator aggregates data (totals, averages, percentages)
   - PDF generator creates comprehensive report with charts/tables
   - Response streams PDF file to client

## Components and Interfaces

### API Endpoints

#### POST /api/reports/donation

Generates a donation report for the authenticated member.

**Request Body**:
```typescript
interface DonationReportRequest {
  startDate?: string;  // ISO 8601 date string (optional)
  endDate?: string;    // ISO 8601 date string (optional)
  language?: 'en' | 'sv' | 'ar';  // Default: user's preference
}
```

**Response**:
- Success (200): PDF file stream with headers:
  - `Content-Type: application/pdf`
  - `Content-Disposition: attachment; filename="donation-report-{userId}-{startDate}-{endDate}.pdf"`
- Error (400): Invalid date range
- Error (401): Unauthorized (not logged in)
- Error (403): Forbidden (viewer role)
- Error (404): No contributions found
- Error (500): Server error

#### POST /api/reports/campaign

Generates a campaign report for administrators.

**Request Body**:
```typescript
interface CampaignReportRequest {
  campaignIds?: string[];  // Optional: specific campaigns (empty = all)
  groupId?: string;        // Optional: filter by family group
  status?: 'active' | 'completed' | 'cancelled';  // Optional
  startDate?: string;      // Optional: campaign start date filter
  endDate?: string;        // Optional: campaign end date filter
  language?: 'en' | 'sv' | 'ar';  // Default: user's preference
}
```

**Response**:
- Success (200): PDF file stream with headers:
  - `Content-Type: application/pdf`
  - `Content-Disposition: attachment; filename="campaign-report-{timestamp}.pdf"`
- Error (401): Unauthorized
- Error (403): Forbidden (non-admin)
- Error (500): Server error

### Service Layer

#### ReportService

```typescript
class ReportService {
  // Generate member donation report
  async generateDonationReport(
    userId: string,
    options: DonationReportOptions
  ): Promise<Buffer>;
  
  // Generate admin campaign report
  async generateCampaignReport(
    options: CampaignReportOptions
  ): Promise<Buffer>;
  
  // Validate date range
  private validateDateRange(
    startDate?: Date,
    endDate?: Date
  ): ValidationResult;
  
  // Query contributions for user
  private async queryUserContributions(
    userId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<ContributionWithCampaign[]>;
  
  // Query campaigns with filters
  private async queryCampaigns(
    filters: CampaignFilters
  ): Promise<CampaignWithStats[]>;
  
  // Calculate campaign statistics
  private calculateCampaignStats(
    campaign: Campaign,
    contributions: Contribution[]
  ): CampaignStatistics;
}
```

#### PDFGeneratorService

```typescript
class PDFGeneratorService {
  // Generate donation report PDF
  async generateDonationPDF(
    data: DonationReportData,
    language: Language
  ): Promise<Buffer>;
  
  // Generate campaign report PDF
  async generateCampaignPDF(
    data: CampaignReportData,
    language: Language
  ): Promise<Buffer>;
  
  // Format currency for locale
  private formatCurrency(
    amount: number,
    currency: string,
    language: Language
  ): string;
  
  // Format date for locale
  private formatDate(
    date: Date,
    language: Language
  ): string;
}
```

### PDF Components (React-PDF)

```typescript
// Donation Report Template
const DonationReportTemplate: React.FC<{
  data: DonationReportData;
  translations: ReportTranslations;
  isRTL: boolean;
}>;

// Campaign Report Template
const CampaignReportTemplate: React.FC<{
  data: CampaignReportData;
  translations: ReportTranslations;
  isRTL: boolean;
}>;

// Shared Components
const ReportHeader: React.FC<{
  title: string;
  logo?: string;
  isRTL: boolean;
}>;

const ReportFooter: React.FC<{
  pageNumber: number;
  totalPages: number;
  generatedAt: Date;
  reportId: string;
  isRTL: boolean;
}>;

const ContributionTable: React.FC<{
  contributions: ContributionRow[];
  translations: ReportTranslations;
  isRTL: boolean;
}>;

const CampaignStatsTable: React.FC<{
  campaigns: CampaignStats[];
  translations: ReportTranslations;
  isRTL: boolean;
}>;
```

## Data Models

### Existing Prisma Models (No Changes Required)

The existing Prisma schema already contains all necessary models:

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String
  contributions Contribution[]
  campaigns     Campaign[]
}

model Campaign {
  id              String   @id @default(cuid())
  title           String
  description     String
  targetAmount    Float
  currentAmount   Float    @default(0)
  currency        String   @default("USD")
  status          String   @default("active")
  createdAt       DateTime @default(now())
  beneficiaryId   String
  beneficiary     User     @relation(fields: [beneficiaryId], references: [id])
  groupId         String
  group           FamilyGroup @relation(fields: [groupId], references: [id])
  contributions   Contribution[]
}

model Contribution {
  id          String   @id @default(cuid())
  amount      Float
  currency    String   @default("USD")
  isRecurring Boolean  @default(false)
  createdAt   DateTime @default(now())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  campaignId  String
  campaign    Campaign @relation(fields: [campaignId], references: [id])
}

model FamilyGroup {
  id          String   @id @default(cuid())
  name        String
  description String?
  campaigns   Campaign[]
}
```

### TypeScript Interfaces for Reports

```typescript
interface DonationReportData {
  reportId: string;
  generatedAt: Date;
  user: {
    name: string;
    email: string;
  };
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  contributions: ContributionRow[];
  totals: CurrencyTotal[];
  disclaimer: string;
}

interface ContributionRow {
  date: Date;
  campaignName: string;
  beneficiaryName: string;
  amount: number;
  currency: string;
}

interface CurrencyTotal {
  currency: string;
  total: number;
}

interface CampaignReportData {
  reportId: string;
  generatedAt: Date;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  campaigns: CampaignStats[];
  aggregateStats: AggregateStatistics;
}

interface CampaignStats {
  id: string;
  title: string;
  description: string;
  beneficiaryName: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  status: string;
  startDate: Date;
  endDate: Date | null;
  contributorCount: number;
  averageContribution: number;
  fundingPercentage: number;
  contributions: ContributionSummary[];
}

interface ContributionSummary {
  date: Date;
  contributorName: string;
  amount: number;
  isAnonymous: boolean;
}

interface AggregateStatistics {
  totalCampaigns: number;
  totalContributions: number;
  totalAmount: number;
  averageCampaignSize: number;
  uniqueContributors: number;
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Complete Contribution Retrieval

*For any* member requesting a donation report, all contributions made by that member should be included in the report, with no contributions omitted or duplicated.

**Validates: Requirements 1.1**

### Property 2: Donation Report Required Fields

*For any* donation report, each contribution entry should include campaign name, date, amount, currency, and beneficiary name, and the report should include the member's full name, email address, organization name "Amanah", unique report identifier, generation timestamp, and the tax disclaimer "This report is for informational purposes only. Please consult with a tax professional regarding deductibility."

**Validates: Requirements 1.2, 5.6, 10.1, 10.2, 10.3, 10.4**

### Property 3: Currency Totals Accuracy

*For any* set of contributions in a donation report, the total amount per currency should equal the sum of all contribution amounts in that currency.

**Validates: Requirements 1.3**

### Property 4: PDF Format Validity

*For any* generated report (donation or campaign), the output should be a valid PDF file that can be parsed by standard PDF libraries and contains the PDF magic bytes.

**Validates: Requirements 1.4, 3.6**

### Property 5: Contribution Isolation

*For any* member requesting a donation report, the report should contain only contributions where the contributor's user ID matches the requesting member's ID, ensuring no other member's contributions are included.

**Validates: Requirements 1.5**

### Property 6: Contribution Date Ordering

*For any* donation report, contributions should be sorted by date in descending order, where each contribution's date is greater than or equal to the next contribution's date.

**Validates: Requirements 1.6**

### Property 7: Date Range Filtering

*For any* donation report with a specified start date and end date, all contributions in the report should have creation dates within the inclusive range [startDate, endDate].

**Validates: Requirements 2.1**

### Property 8: Default Date Range

*For any* donation report request without specified dates, all contributions in the report should have creation dates within the current calendar year.

**Validates: Requirements 2.2**

### Property 9: Invalid Date Range Rejection

*For any* report request where the start date is after the end date, the system should return a validation error and not generate a report.

**Validates: Requirements 2.3**

### Property 10: Multi-Year Date Range Support

*For any* donation report with a date range spanning multiple years, contributions from all years within the range should be included in the report.

**Validates: Requirements 2.4**

### Property 11: Campaign Report Required Fields

*For any* campaign report, each campaign entry should include title, description, target amount, current amount, start date, end date, status, beneficiary name, unique contributor count, average contribution amount, and funding percentage.

**Validates: Requirements 3.1, 3.2**

### Property 12: Unique Contributor Count Accuracy

*For any* campaign in a report, the unique contributor count should equal the number of distinct user IDs who made contributions to that campaign.

**Validates: Requirements 3.3**

### Property 13: Average Contribution Calculation

*For any* campaign with contributions, the average contribution amount should equal the sum of all contribution amounts divided by the total number of contributions.

**Validates: Requirements 3.4**

### Property 14: Funding Percentage Calculation

*For any* campaign, the funding percentage should equal (currentAmount / targetAmount) * 100, rounded to an appropriate precision.

**Validates: Requirements 3.5**

### Property 15: Aggregate Statistics Accuracy

*For any* campaign report with multiple campaigns, the aggregate statistics (total campaigns, total contributions, total amount, average campaign size, unique contributors) should correctly sum or average across all included campaigns.

**Validates: Requirements 3.7**

### Property 16: Member Role Access Control

*For any* user with role member, contributor, or admin, requests to generate their own donation report should succeed; for any user with role viewer, such requests should return an authorization error.

**Validates: Requirements 4.1, 4.3**

### Property 17: Admin-Only Campaign Reports

*For any* user with role admin, requests to generate campaign reports should succeed; for any user with role member, contributor, or viewer, such requests should return an authorization error.

**Validates: Requirements 4.2, 4.4**

### Property 18: Private Contribution Filtering

*For any* campaign report requested by a non-admin user, private contributions should be excluded or shown as anonymous; for any campaign report requested by an admin, all contributions including private ones should be visible with full details.

**Validates: Requirements 4.5**

### Property 19: Multi-Language Support

*For any* report generation request specifying language as 'en', 'sv', or 'ar', the system should successfully generate a report with text content in the specified language.

**Validates: Requirements 5.1**

### Property 20: Language Preference Respect

*For any* user with a language preference set, reports generated for that user should use their preferred language unless explicitly overridden in the request.

**Validates: Requirements 5.2**

### Property 21: Currency Locale Formatting

*For any* currency amount in a report, the formatting should match the conventions of the selected language locale (e.g., thousand separators, decimal separators).

**Validates: Requirements 5.3**

### Property 22: Date Locale Formatting

*For any* date in a report, the formatting should match the conventions of the selected language locale (e.g., MM/DD/YYYY for English, DD/MM/YYYY for Swedish).

**Validates: Requirements 5.4**

### Property 23: RTL Layout for Arabic

*For any* report generated in Arabic language, the PDF layout should be right-to-left (RTL), with text alignment and flow direction appropriate for RTL languages.

**Validates: Requirements 5.5**

### Property 24: Campaign Selection Filtering

*For any* campaign report request with specified campaign IDs, only campaigns whose IDs are in the specified list should be included in the report.

**Validates: Requirements 6.1**

### Property 25: Default All Campaigns

*For any* campaign report request with no campaign IDs specified, all campaigns in the system should be included in the report.

**Validates: Requirements 6.2**

### Property 26: Campaign Status Filtering

*For any* campaign report request with a status filter, only campaigns with the specified status should be included in the report.

**Validates: Requirements 6.3**

### Property 27: Campaign Group Filtering

*For any* campaign report request with a group ID filter, only campaigns belonging to the specified family group should be included in the report.

**Validates: Requirements 6.4**

### Property 28: Campaign Date Range Filtering

*For any* campaign report request with a date range, only campaigns with start dates within the specified range should be included in the report.

**Validates: Requirements 6.5**

### Property 29: Download Response Headers

*For any* successfully generated report, the HTTP response should include Content-Type header set to "application/pdf" and Content-Disposition header set to "attachment" to trigger browser download.

**Validates: Requirements 7.1, 7.4**

### Property 30: Donation Report Filename Pattern

*For any* donation report, the filename should match the pattern "donation-report-{userId}-{startDate}-{endDate}.pdf" where userId, startDate, and endDate are appropriately formatted.

**Validates: Requirements 7.2**

### Property 31: Campaign Report Filename Pattern

*For any* campaign report, the filename should match the pattern "campaign-report-{timestamp}.pdf" where timestamp represents the generation time.

**Validates: Requirements 7.3**

### Property 32: No Server-Side Storage

*For any* report generation, no report files should be persisted to the server filesystem after the response is sent to the client.

**Validates: Requirements 7.5**

### Property 33: Empty Campaign Report Handling

*For any* campaign report where selected campaigns have no contributions, the report should still generate successfully with zero values for all statistics (contributor count, average contribution, etc.).

**Validates: Requirements 8.2**

### Property 34: User Existence Validation

*For any* report generation request, the requesting user must exist in the system; requests from non-existent users should return an error.

**Validates: Requirements 8.3**

### Property 35: Descriptive Error Messages

*For any* report generation failure (validation error, authorization error, or system error), the response should include a descriptive error message indicating the reason for failure.

**Validates: Requirements 8.4**

### Property 36: Campaign Grouping and Subtotals

*For any* donation report, contributions should be grouped by campaign, and each campaign group should display a subtotal that equals the sum of all contributions to that campaign.

**Validates: Requirements 10.5**

### Property 37: Beneficiary Name Inclusion

*For any* campaign included in a report (donation or campaign report), the beneficiary's name should be present in the campaign information.

**Validates: Requirements 10.6**


## Error Handling

### Error Categories

#### 1. Authentication Errors (401 Unauthorized)

**Scenario**: User is not logged in or session is invalid

**Response**:
```json
{
  "error": "Unauthorized",
  "message": "You must be logged in to generate reports",
  "code": "AUTH_REQUIRED"
}
```

**Handling**: Client should redirect to login page

#### 2. Authorization Errors (403 Forbidden)

**Scenarios**:
- Viewer role attempting to generate donation report
- Non-admin attempting to generate campaign report

**Response**:
```json
{
  "error": "Forbidden",
  "message": "You do not have permission to generate this report type",
  "code": "INSUFFICIENT_PERMISSIONS",
  "requiredRole": "member" // or "admin"
}
```

**Handling**: Display error message with suggestion to contact admin for role upgrade

#### 3. Validation Errors (400 Bad Request)

**Scenarios**:
- Invalid date range (start date after end date)
- Invalid date format
- Invalid campaign IDs
- Invalid language code

**Response**:
```json
{
  "error": "Validation Error",
  "message": "Start date must be before or equal to end date",
  "code": "INVALID_DATE_RANGE",
  "details": {
    "startDate": "2024-12-31",
    "endDate": "2024-01-01"
  }
}
```

**Handling**: Display validation error to user with corrective guidance

#### 4. Not Found Errors (404 Not Found)

**Scenarios**:
- No contributions found for specified date range
- Specified campaign IDs do not exist
- User does not exist

**Response**:
```json
{
  "error": "Not Found",
  "message": "No contributions found for the specified date range",
  "code": "NO_CONTRIBUTIONS_FOUND",
  "suggestion": "Try expanding your date range or check if you have made any contributions"
}
```

**Handling**: Display friendly message with suggestions

#### 5. Server Errors (500 Internal Server Error)

**Scenarios**:
- Database connection failure
- PDF generation failure
- Unexpected exceptions

**Response**:
```json
{
  "error": "Internal Server Error",
  "message": "An error occurred while generating your report",
  "code": "REPORT_GENERATION_FAILED",
  "requestId": "req_abc123"
}
```

**Handling**: Log error details server-side, display generic error to user, provide request ID for support

#### 6. Timeout Errors (408 Request Timeout)

**Scenarios**:
- Report generation exceeds time limit (rare, but possible with very large datasets)

**Response**:
```json
{
  "error": "Request Timeout",
  "message": "Report generation took too long",
  "code": "GENERATION_TIMEOUT",
  "suggestion": "Try narrowing your date range or selecting fewer campaigns"
}
```

**Handling**: Display error with actionable suggestions

### Error Handling Strategy

1. **Input Validation**: Validate all inputs at the API route level before processing
2. **Database Error Handling**: Wrap all Prisma queries in try-catch blocks
3. **PDF Generation Error Handling**: Catch and log PDF generation errors, return user-friendly messages
4. **Logging**: Log all errors with context (user ID, request parameters, stack trace) for debugging
5. **User Feedback**: Always provide actionable error messages to users
6. **Graceful Degradation**: For non-critical errors (e.g., missing optional data), continue processing with defaults

### Error Logging Format

```typescript
interface ErrorLog {
  timestamp: Date;
  errorCode: string;
  errorMessage: string;
  userId?: string;
  requestPath: string;
  requestParams: Record<string, any>;
  stackTrace?: string;
  requestId: string;
}
```

## Testing Strategy

### Dual Testing Approach

This feature requires both unit tests and property-based tests for comprehensive coverage:

- **Unit Tests**: Verify specific examples, edge cases, and error conditions
- **Property Tests**: Verify universal properties across all inputs using randomized testing

### Property-Based Testing Configuration

**Library**: Use `fast-check` (already in package.json) for property-based testing in TypeScript/JavaScript

**Configuration**:
- Minimum 100 iterations per property test
- Each property test must reference its design document property
- Tag format: `Feature: donation-report-generation, Property {number}: {property_text}`

### Test Organization

```
tests/
├── unit/
│   ├── api/
│   │   ├── donation-report.test.ts
│   │   └── campaign-report.test.ts
│   ├── services/
│   │   ├── report-service.test.ts
│   │   └── pdf-generator.test.ts
│   └── utils/
│       ├── date-validation.test.ts
│       └── currency-formatting.test.ts
└── property/
    ├── donation-report.property.test.ts
    └── campaign-report.property.test.ts
```

### Unit Test Coverage

#### API Route Tests
- Authentication and authorization checks
- Request validation (date ranges, campaign IDs)
- Response headers and status codes
- Error handling for each error category
- Specific edge cases (empty results, single contribution, etc.)

#### Service Layer Tests
- Contribution querying with various filters
- Campaign statistics calculations
- Date range validation logic
- Currency aggregation
- Grouping and sorting logic

#### PDF Generation Tests
- PDF structure validation
- RTL layout for Arabic
- Locale-specific formatting (dates, currencies)
- Required field presence
- Multi-page handling

### Property-Based Test Coverage

Each correctness property from the design document should have a corresponding property test:

#### Example Property Test Structure

```typescript
import fc from 'fast-check';

describe('Property Tests: Donation Report Generation', () => {
  // Feature: donation-report-generation, Property 1: Complete Contribution Retrieval
  it('should include all contributions for a member', () => {
    fc.assert(
      fc.property(
        fc.array(contributionArbitrary, { minLength: 1, maxLength: 100 }),
        fc.string(), // userId
        async (contributions, userId) => {
          // Setup: Create contributions in database
          await setupContributions(contributions, userId);
          
          // Execute: Generate report
          const report = await generateDonationReport(userId);
          
          // Verify: All contributions are included
          expect(report.contributions).toHaveLength(contributions.length);
          expect(report.contributions.map(c => c.id).sort())
            .toEqual(contributions.map(c => c.id).sort());
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: donation-report-generation, Property 3: Currency Totals Accuracy
  it('should calculate correct currency totals', () => {
    fc.assert(
      fc.property(
        fc.array(contributionArbitrary, { minLength: 1, maxLength: 100 }),
        async (contributions) => {
          // Setup
          const userId = 'test-user';
          await setupContributions(contributions, userId);
          
          // Execute
          const report = await generateDonationReport(userId);
          
          // Calculate expected totals
          const expectedTotals = contributions.reduce((acc, c) => {
            acc[c.currency] = (acc[c.currency] || 0) + c.amount;
            return acc;
          }, {} as Record<string, number>);
          
          // Verify
          report.totals.forEach(total => {
            expect(total.total).toBeCloseTo(expectedTotals[total.currency], 2);
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

#### Arbitraries for Property Testing

```typescript
// Generate random contributions
const contributionArbitrary = fc.record({
  id: fc.uuid(),
  amount: fc.float({ min: 0.01, max: 10000, noNaN: true }),
  currency: fc.constantFrom('USD', 'SEK', 'SAR'),
  createdAt: fc.date({ min: new Date('2020-01-01'), max: new Date() }),
  campaignId: fc.uuid(),
  userId: fc.uuid(),
});

// Generate random campaigns
const campaignArbitrary = fc.record({
  id: fc.uuid(),
  title: fc.string({ minLength: 5, maxLength: 100 }),
  description: fc.string({ minLength: 10, maxLength: 500 }),
  targetAmount: fc.float({ min: 100, max: 100000, noNaN: true }),
  currentAmount: fc.float({ min: 0, max: 100000, noNaN: true }),
  currency: fc.constantFrom('USD', 'SEK', 'SAR'),
  status: fc.constantFrom('active', 'completed', 'cancelled'),
  createdAt: fc.date({ min: new Date('2020-01-01'), max: new Date() }),
});

// Generate random date ranges
const dateRangeArbitrary = fc.record({
  startDate: fc.date({ min: new Date('2020-01-01'), max: new Date() }),
  endDate: fc.date({ min: new Date('2020-01-01'), max: new Date() }),
}).filter(range => range.startDate <= range.endDate);
```

### Integration Tests

Test the complete flow from API request to PDF generation:

1. **End-to-End Donation Report Flow**:
   - Create test user and contributions
   - Make API request with authentication
   - Verify PDF is generated and downloadable
   - Verify PDF content matches expected data

2. **End-to-End Campaign Report Flow**:
   - Create test campaigns and contributions
   - Make API request as admin
   - Verify PDF is generated with correct statistics
   - Verify filtering works correctly

### Test Data Management

- Use factories to generate test data consistently
- Clean up test data after each test
- Use separate test database or in-memory database
- Seed realistic test data for manual testing

### Performance Testing

While not part of unit/property tests, performance should be validated:

- Load test with 1000 contributions for donation reports
- Load test with 100 campaigns for campaign reports
- Measure PDF generation time
- Verify memory usage stays within acceptable bounds

### Accessibility Testing

For the UI components that trigger report generation:

- Keyboard navigation support
- Screen reader compatibility
- Clear error messages
- Loading states and progress indicators

### Manual Testing Checklist

- [ ] Generate donation report in all three languages
- [ ] Verify RTL layout for Arabic reports
- [ ] Test with empty date ranges
- [ ] Test with very large date ranges (multiple years)
- [ ] Test as different user roles
- [ ] Verify PDF opens correctly in various PDF readers
- [ ] Test download on different browsers
- [ ] Verify currency formatting for all locales
- [ ] Test with private contributions
- [ ] Verify aggregate statistics accuracy

