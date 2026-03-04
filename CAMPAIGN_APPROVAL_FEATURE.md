# Campaign Approval Feature - Optional Voting System

## Overview
Implemented optional voting/approval system for campaigns. Campaign creators can now choose whether their campaign requires 3 votes before becoming active, or if it should start immediately.

## Feature Details

### Campaign Creation Options

When creating a campaign, users can choose between two options:

1. **✓ Requires Approval** (Default)
   - Campaign starts with status 'pending'
   - Needs 3 votes to become 'active'
   - Can accept contributions only after activation
   - Voting section visible on campaign detail page

2. **⚡ Start Immediately**
   - Campaign starts with status 'active' right away
   - No voting required
   - Can accept contributions immediately
   - Voting section hidden on campaign detail page

### User Interface

#### Campaign Creation Form
- Added new section: "Campaign Approval Setting"
- Radio button options with clear descriptions
- Default: Requires Approval (checked)
- Visual indicators: ✓ for approval, ⚡ for immediate

#### Campaign Detail Page
- Voting section only shows if `requiresApproval: true`
- Pending warning only shows if campaign requires approval
- Contribute button available immediately for campaigns without approval requirement

## Implementation Details

### Database Schema Changes

**Campaign Interface** (`src/lib/mockData.ts`):
```typescript
export interface Campaign {
  // ... existing fields
  requiresApproval: boolean; // New field
}
```

### Modified Functions

1. **getCampaigns()** - Migration logic
   - Adds `requiresApproval: true` to old campaigns (backward compatible)
   - Ensures all campaigns have this field

2. **addCampaign()** - Status logic
   - If `requiresApproval: true` → status: 'pending'
   - If `requiresApproval: false` → status: 'active'

3. **voteForCampaign()** - Validation
   - Returns error if campaign doesn't require approval
   - Message: "This campaign does not require voting"

4. **removeVoteFromCampaign()** - Validation
   - Returns error if campaign doesn't require approval
   - Only deactivates if `requiresApproval: true`

### Files Modified

1. **src/lib/mockData.ts**
   - Updated `Campaign` interface
   - Added `requiresApproval` field to default campaigns
   - Modified `getCampaigns()` for migration
   - Modified `addCampaign()` for conditional status
   - Modified voting functions for validation

2. **src/lib/i18n.ts**
   - Added translations in English, Swedish, Arabic:
     - `requiresApproval`: "Requires Approval"
     - `requiresApprovalDesc`: "Campaign needs 3 votes before it can accept contributions"
     - `startImmediately`: "Start Immediately"
     - `startImmediatelyDesc`: "Campaign will be active right away without needing votes"
     - `campaignApprovalSetting`: "Campaign Approval"

3. **src/app/dashboard/campaigns/new/page.tsx**
   - Added `requiresApproval: true` to formData state
   - Added radio button section for approval setting
   - Passes `requiresApproval` to `addCampaign()`

4. **src/app/dashboard/campaigns/[id]/page.tsx**
   - Added `requiresApproval` constant from campaign data
   - Conditionally renders voting section
   - Conditionally shows pending warning
   - Updated contribute button logic

## Use Cases

### Urgent Campaigns (No Approval)
- Medical emergencies
- Time-sensitive needs
- Pre-approved by family admin
- Small amounts

**Example:**
```
Title: Emergency Medicine for Uncle Ahmed
Approval: ⚡ Start Immediately
Result: Active immediately, can receive contributions right away
```

### Regular Campaigns (With Approval)
- Education support
- Home repairs
- Non-urgent needs
- Large amounts

**Example:**
```
Title: University Tuition for Sara
Approval: ✓ Requires Approval
Result: Pending until 3 family members vote
```

## Benefits

1. **Flexibility**: Families can decide urgency level
2. **Speed**: Urgent needs don't wait for votes
3. **Control**: Important decisions still require consensus
4. **Transparency**: Clear indication of approval status
5. **Backward Compatible**: Old campaigns default to requiring approval

## Testing Checklist

- [x] Create campaign with "Requires Approval" → starts as pending
- [x] Create campaign with "Start Immediately" → starts as active
- [x] Voting section hidden for immediate campaigns
- [x] Voting section visible for approval campaigns
- [x] Pending warning only shows for approval campaigns
- [x] Contribute button works immediately for non-approval campaigns
- [x] Old campaigns migrated with `requiresApproval: true`
- [x] All translations work in English, Swedish, Arabic
- [x] No TypeScript compilation errors

## Default Behavior

- New campaigns: Default to "Requires Approval" (checked)
- Existing campaigns: Migrated to `requiresApproval: true`
- Campaign status: Determined by `requiresApproval` flag
- Voting: Only available if `requiresApproval: true`
