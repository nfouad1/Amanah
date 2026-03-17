# Implementation Plan: Donation Report Generation

## Overview

This implementation plan breaks down the donation report generation feature into discrete, testable tasks. The feature enables members to generate PDF donation reports for tax purposes and allows administrators to generate comprehensive campaign reports with statistics. The implementation uses TypeScript, Next.js App Router, Prisma, and @react-pdf/renderer for PDF generation with multi-language support (English, Swedish, Arabic with RTL).

## Tasks

- [x] 1. Install dependencies and set up project structure
  - Install @react-pdf/renderer package
  - Create directory structure: src/services/reports/, src/components/reports/, src/app/api/reports/
  - Set up TypeScript types in src/types/reports.ts
  - _Requirements: 1.4, 3.6_

- [ ] 2. Create core TypeScript interfaces and types
  - [x] 2.1 Define report data interfaces
    - Create DonationReportData, ContributionRow, CurrencyTotal interfaces
    - Create CampaignReportData, CampaignStats, AggregateStatistics interfaces
    - Create request/response types for API routes
    - _Requirements: 1.2, 3.1, 3.2_
  
  - [ ] 2.2 Write property test for type completeness
    - **Property 2: Donation Report Required Fields**
    - **Validates: Requirements 1.2, 5.6, 10.1, 10.2, 10.3, 10.4**

- [ ] 3. Implement ReportService for data retrieval and processing
  - [x] 3.1 Create ReportService class with contribution query methods
    - Implement queryUserContributions with date range filtering
    - Implement validateDateRange method
    - Implement calculateCurrencyTotals method
    - _Requirements: 1.1, 1.3, 2.1, 2.2, 2.3, 2.4_
  
  - [ ] 3.2 Write property tests for ReportService
    - **Property 1: Complete Contribution Retrieval**
    - **Validates: Requirements 1.1**
    - **Property 3: Currency Totals Accuracy**
    - **Validates: Requirements 1.3**
    - **Property 5: Contribution Isolation**
    - **Validates: Requirements 1.5**
    - **Property 7: Date Range Filtering**
    - **Validates: Requirements 2.1**
    - **Property 8: Default Date Range**
    - **Validates: Requirements 2.2**
    - **Property 9: Invalid Date Range Rejection**
    - **Validates: Requirements 2.3**
    - **Property 10: Multi-Year Date Range Support**
    - **Validates: Requirements 2.4**
  
  - [x] 3.3 Implement campaign query methods
    - Implement queryCampaigns with filtering (status, group, date range)
    - Implement calculateCampaignStats method
    - Implement calculateAggregateStats method
    - _Requirements: 3.1, 3.3, 3.4, 3.5, 3.7, 6.1, 6.2, 6.3, 6.4, 6.5_
  
  - [ ] 3.4 Write property tests for campaign statistics
    - **Property 11: Campaign Report Required Fields**
    - **Validates: Requirements 3.1, 3.2**
    - **Property 12: Unique Contributor Count Accuracy**
    - **Validates: Requirements 3.3**
    - **Property 13: Average Contribution Calculation**
    - **Validates: Requirements 3.4**
    - **Property 14: Funding Percentage Calculation**
    - **Validates: Requirements 3.5**
    - **Property 15: Aggregate Statistics Accuracy**
    - **Validates: Requirements 3.7**
    - **Property 24: Campaign Selection Filtering**
    - **Validates: Requirements 6.1**
    - **Property 25: Default All Campaigns**
    - **Validates: Requirements 6.2**
    - **Property 26: Campaign Status Filtering**
    - **Validates: Requirements 6.3**
    - **Property 27: Campaign Group Filtering**
    - **Validates: Requirements 6.4**
    - **Property 28: Campaign Date Range Filtering**
    - **Validates: Requirements 6.5**

- [x] 4. Checkpoint - Ensure service layer tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Add localization strings for reports
  - [x] 5.1 Extend i18n configuration with report translations
    - Add English translations for report labels, headers, disclaimers
    - Add Swedish translations for all report strings
    - Add Arabic translations for all report strings
    - _Requirements: 5.1, 5.2, 10.4_
  
  - [ ] 5.2 Write property test for multi-language support
    - **Property 19: Multi-Language Support**
    - **Validates: Requirements 5.1**
    - **Property 20: Language Preference Respect**
    - **Validates: Requirements 5.2**

- [ ] 6. Implement PDFGeneratorService with formatting utilities
  - [x] 6.1 Create PDFGeneratorService class
    - Implement formatCurrency method with locale support
    - Implement formatDate method with locale support
    - Implement generateReportId utility
    - _Requirements: 5.3, 5.4, 10.3_
  
  - [ ] 6.2 Write property tests for formatting
    - **Property 21: Currency Locale Formatting**
    - **Validates: Requirements 5.3**
    - **Property 22: Date Locale Formatting**
    - **Validates: Requirements 5.4**

- [ ] 7. Create PDF template components using @react-pdf/renderer
  - [x] 7.1 Implement shared PDF components
    - Create ReportHeader component with logo and title
    - Create ReportFooter component with page numbers and report ID
    - Create ContributionTable component with RTL support
    - Create CampaignStatsTable component
    - _Requirements: 1.2, 3.1, 5.5, 10.1, 10.2, 10.5, 10.6_
  
  - [x] 7.2 Implement DonationReportTemplate component
    - Create complete donation report layout
    - Implement RTL layout support for Arabic
    - Include all required fields (user info, contributions, totals, disclaimer)
    - Implement contribution grouping by campaign with subtotals
    - _Requirements: 1.2, 1.6, 5.5, 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_
  
  - [x] 7.3 Implement CampaignReportTemplate component
    - Create complete campaign report layout
    - Implement RTL layout support for Arabic
    - Include campaign statistics and aggregate data
    - _Requirements: 3.1, 3.2, 3.7, 5.5_
  
  - [ ] 7.4 Write property tests for PDF generation
    - **Property 4: PDF Format Validity**
    - **Validates: Requirements 1.4, 3.6**
    - **Property 6: Contribution Date Ordering**
    - **Validates: Requirements 1.6**
    - **Property 23: RTL Layout for Arabic**
    - **Validates: Requirements 5.5**
    - **Property 36: Campaign Grouping and Subtotals**
    - **Validates: Requirements 10.5**
    - **Property 37: Beneficiary Name Inclusion**
    - **Validates: Requirements 10.6**

- [ ] 8. Implement PDF generation methods in PDFGeneratorService
  - [x] 8.1 Implement generateDonationPDF method
    - Integrate DonationReportTemplate with react-pdf renderer
    - Handle multi-page reports
    - Return PDF as Buffer
    - _Requirements: 1.4, 5.6_
  
  - [x] 8.2 Implement generateCampaignPDF method
    - Integrate CampaignReportTemplate with react-pdf renderer
    - Handle multi-page reports
    - Return PDF as Buffer
    - _Requirements: 3.6_

- [ ] 9. Checkpoint - Ensure PDF generation works
  - Ensure all tests pass, ask the user if questions arise.

- [-] 10. Create donation report API route
  - [x] 10.1 Implement POST /api/reports/donation route
    - Validate user authentication from localStorage
    - Validate user role (member, contributor, or admin)
    - Parse and validate request body (date range, language)
    - Call ReportService to fetch contribution data
    - Call PDFGeneratorService to generate PDF
    - Set response headers (Content-Type, Content-Disposition with filename)
    - Stream PDF buffer to response
    - _Requirements: 1.1, 1.4, 1.5, 2.1, 2.2, 4.1, 4.3, 5.1, 5.2, 7.1, 7.2, 7.4, 7.5_
  
  - [ ] 10.2 Write property tests for donation report API
    - **Property 16: Member Role Access Control**
    - **Validates: Requirements 4.1, 4.3**
    - **Property 29: Download Response Headers**
    - **Validates: Requirements 7.1, 7.4**
    - **Property 30: Donation Report Filename Pattern**
    - **Validates: Requirements 7.2**
    - **Property 32: No Server-Side Storage**
    - **Validates: Requirements 7.5**
    - **Property 34: User Existence Validation**
    - **Validates: Requirements 8.3**
  
  - [x] 10.3 Implement error handling for donation report API
    - Handle authentication errors (401)
    - Handle authorization errors (403 for viewer role)
    - Handle validation errors (400 for invalid date range)
    - Handle not found errors (404 for no contributions)
    - Handle server errors (500)
    - _Requirements: 2.3, 4.3, 8.1, 8.4_
  
  - [ ] 10.4 Write property test for error handling
    - **Property 35: Descriptive Error Messages**
    - **Validates: Requirements 8.4**

- [-] 11. Create campaign report API route
  - [x] 11.1 Implement POST /api/reports/campaign route
    - Validate user authentication from localStorage
    - Validate admin role
    - Parse and validate request body (campaign filters, language)
    - Call ReportService to fetch campaign data
    - Call PDFGeneratorService to generate PDF
    - Set response headers (Content-Type, Content-Disposition with filename)
    - Stream PDF buffer to response
    - _Requirements: 3.1, 3.6, 4.2, 4.4, 5.1, 5.2, 6.1, 6.2, 6.3, 6.4, 6.5, 7.1, 7.3, 7.4, 7.5_
  
  - [ ] 11.2 Write property tests for campaign report API
    - **Property 17: Admin-Only Campaign Reports**
    - **Validates: Requirements 4.2, 4.4**
    - **Property 18: Private Contribution Filtering**
    - **Validates: Requirements 4.5**
    - **Property 31: Campaign Report Filename Pattern**
    - **Validates: Requirements 7.3**
    - **Property 33: Empty Campaign Report Handling**
    - **Validates: Requirements 8.2**
  
  - [x] 11.3 Implement error handling for campaign report API
    - Handle authentication errors (401)
    - Handle authorization errors (403 for non-admin)
    - Handle validation errors (400)
    - Handle server errors (500)
    - _Requirements: 4.4, 8.4_

- [ ] 12. Checkpoint - Ensure API routes work correctly
  - Ensure all tests pass, ask the user if questions arise.

- [x] 13. Create UI components for report generation
  - [x] 13.1 Create DonationReportForm component
    - Add date range picker inputs
    - Add language selector
    - Add generate button with loading state
    - Implement API call to /api/reports/donation
    - Handle file download
    - Display error messages
    - _Requirements: 2.1, 2.2, 5.1, 5.2, 7.1, 8.1_
  
  - [x] 13.2 Create CampaignReportForm component (admin only)
    - Add campaign multi-select dropdown
    - Add status filter dropdown
    - Add group filter dropdown
    - Add date range picker
    - Add language selector
    - Add generate button with loading state
    - Implement API call to /api/reports/campaign
    - Handle file download
    - Display error messages
    - _Requirements: 5.1, 5.2, 6.1, 6.2, 6.3, 6.4, 6.5, 7.1_
  
  - [x] 13.3 Add report generation sections to dashboard pages
    - Add DonationReportForm to member profile page
    - Add CampaignReportForm to admin dashboard page
    - Implement role-based visibility
    - _Requirements: 4.1, 4.2_

- [ ] 14. Final integration and testing
  - [ ] 14.1 Test complete donation report flow
    - Test as member, contributor, and admin roles
    - Test with various date ranges
    - Test in all three languages
    - Verify PDF downloads correctly
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 4.1, 5.1, 7.1, 7.2_
  
  - [ ] 14.2 Test complete campaign report flow
    - Test as admin role
    - Test with various campaign filters
    - Test in all three languages
    - Verify statistics accuracy
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 4.2, 5.1, 6.1, 6.2, 6.3, 6.4, 6.5, 7.1, 7.3_
  
  - [ ] 14.3 Test error scenarios
    - Test with invalid date ranges
    - Test with no contributions
    - Test with unauthorized roles
    - Verify error messages are descriptive
    - _Requirements: 2.3, 4.3, 4.4, 8.1, 8.4_

- [ ] 15. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional property-based tests and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The implementation uses TypeScript throughout, matching the existing Next.js codebase
- @react-pdf/renderer enables server-side PDF generation with React components
- RTL support for Arabic is built into the PDF templates
- No database schema changes are required - existing Prisma models are sufficient
