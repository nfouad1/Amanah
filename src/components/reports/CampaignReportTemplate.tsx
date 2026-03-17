import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import type { CampaignReportData, ReportTranslations } from '@/types/reports';
import { ReportHeader } from './ReportHeader';
import { ReportFooter } from './ReportFooter';
import { CampaignStatsTable } from './CampaignStatsTable';

interface CampaignReportTemplateProps {
  data: CampaignReportData;
  translations: ReportTranslations;
  isRTL: boolean;
  formatCurrency: (amount: number, currency: string) => string;
  formatDate: (date: Date) => string;
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 70,
    paddingHorizontal: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#111827',
  },
  pageRTL: {
    paddingTop: 40,
    paddingBottom: 70,
    paddingHorizontal: 40,
    fontSize: 10,
    color: '#111827',
  },

  // Date range section
  dateRangeSection: {
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  dateRangeSectionRTL: {
    marginBottom: 16,
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
  },
  dateRangeLabel: {
    fontSize: 8,
    color: '#6b7280',
    marginRight: 4,
  },
  dateRangeLabelRTL: {
    fontSize: 8,
    color: '#6b7280',
    marginLeft: 4,
  },
  dateRangeValue: {
    fontSize: 8,
    color: '#374151',
  },

  // Aggregate stats section
  aggregateSection: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#eff6ff',
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#2563eb',
  },
  aggregateSectionRTL: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#eff6ff',
    borderRadius: 4,
    borderRightWidth: 3,
    borderRightColor: '#2563eb',
  },
  aggregateTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 10,
    textAlign: 'left',
  },
  aggregateTitleRTL: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 10,
    textAlign: 'right',
  },
  aggregateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  aggregateGridRTL: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
  },
  aggregateItem: {
    width: '33%',
    marginBottom: 8,
  },
  aggregateLabel: {
    fontSize: 7,
    color: '#3b82f6',
    textAlign: 'left',
    marginBottom: 2,
  },
  aggregateLabelRTL: {
    fontSize: 7,
    color: '#3b82f6',
    textAlign: 'right',
    marginBottom: 2,
  },
  aggregateValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e3a8a',
    textAlign: 'left',
  },
  aggregateValueRTL: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e3a8a',
    textAlign: 'right',
  },

  // No campaigns message
  noCampaigns: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 4,
    alignItems: 'center',
  },
  noCampaignsText: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
  },
});

function AggregateStatsSection({
  data,
  translations,
  isRTL,
  formatCurrency,
}: {
  data: CampaignReportData;
  translations: ReportTranslations;
  isRTL: boolean;
  formatCurrency: (amount: number, currency: string) => string;
}) {
  const { aggregateStats, campaigns } = data;

  // Determine the primary currency from campaigns (use first campaign's currency or USD)
  const primaryCurrency =
    campaigns.length > 0 ? campaigns[0].currency : 'USD';

  return (
    <View style={isRTL ? styles.aggregateSectionRTL : styles.aggregateSection}>
      <Text style={isRTL ? styles.aggregateTitleRTL : styles.aggregateTitle}>
        {translations.aggregateStats}
      </Text>
      <View style={isRTL ? styles.aggregateGridRTL : styles.aggregateGrid}>
        <View style={styles.aggregateItem}>
          <Text style={isRTL ? styles.aggregateLabelRTL : styles.aggregateLabel}>
            {translations.totalCampaigns}
          </Text>
          <Text style={isRTL ? styles.aggregateValueRTL : styles.aggregateValue}>
            {aggregateStats.totalCampaigns}
          </Text>
        </View>

        <View style={styles.aggregateItem}>
          <Text style={isRTL ? styles.aggregateLabelRTL : styles.aggregateLabel}>
            {translations.totalContributions}
          </Text>
          <Text style={isRTL ? styles.aggregateValueRTL : styles.aggregateValue}>
            {aggregateStats.totalContributions}
          </Text>
        </View>

        <View style={styles.aggregateItem}>
          <Text style={isRTL ? styles.aggregateLabelRTL : styles.aggregateLabel}>
            {translations.uniqueContributors}
          </Text>
          <Text style={isRTL ? styles.aggregateValueRTL : styles.aggregateValue}>
            {aggregateStats.uniqueContributors}
          </Text>
        </View>

        <View style={styles.aggregateItem}>
          <Text style={isRTL ? styles.aggregateLabelRTL : styles.aggregateLabel}>
            {translations.totalAmount}
          </Text>
          <Text style={isRTL ? styles.aggregateValueRTL : styles.aggregateValue}>
            {formatCurrency(aggregateStats.totalAmount, primaryCurrency)}
          </Text>
        </View>

        <View style={styles.aggregateItem}>
          <Text style={isRTL ? styles.aggregateLabelRTL : styles.aggregateLabel}>
            {translations.averageCampaignSize}
          </Text>
          <Text style={isRTL ? styles.aggregateValueRTL : styles.aggregateValue}>
            {formatCurrency(aggregateStats.averageCampaignSize, primaryCurrency)}
          </Text>
        </View>
      </View>
    </View>
  );
}

export function CampaignReportTemplate({
  data,
  translations,
  isRTL,
  formatCurrency,
  formatDate,
}: CampaignReportTemplateProps) {
  const { reportId, generatedAt, dateRange, campaigns } = data;

  const dateRangeText =
    dateRange.start && dateRange.end
      ? `${formatDate(dateRange.start)} – ${formatDate(dateRange.end)}`
      : dateRange.start
      ? `${formatDate(dateRange.start)} –`
      : dateRange.end
      ? `– ${formatDate(dateRange.end)}`
      : '—';

  return (
    <Document>
      <Page size="A4" style={isRTL ? styles.pageRTL : styles.page}>
        {/* Header: org name, report ID, generated timestamp, title */}
        <ReportHeader
          title={translations.campaignTitle}
          translations={translations}
          isRTL={isRTL}
          generatedAt={generatedAt}
          reportId={reportId}
        />

        {/* Date range */}
        {(dateRange.start || dateRange.end) && (
          <View style={isRTL ? styles.dateRangeSectionRTL : styles.dateRangeSection}>
            <Text style={isRTL ? styles.dateRangeLabelRTL : styles.dateRangeLabel}>
              {translations.dateRange}:
            </Text>
            <Text style={styles.dateRangeValue}>{dateRangeText}</Text>
          </View>
        )}

        {/* Aggregate statistics summary */}
        <AggregateStatsSection
          data={data}
          translations={translations}
          isRTL={isRTL}
          formatCurrency={formatCurrency}
        />

        {/* Per-campaign statistics */}
        {campaigns.length > 0 ? (
          <CampaignStatsTable
            campaigns={campaigns}
            translations={translations}
            isRTL={isRTL}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
          />
        ) : (
          <View style={styles.noCampaigns}>
            <Text style={styles.noCampaignsText}>
              {translations.totalCampaigns}: 0
            </Text>
          </View>
        )}

        {/* Footer: report ID + page numbers */}
        <ReportFooter
          reportId={reportId}
          translations={translations}
          isRTL={isRTL}
        />
      </Page>
    </Document>
  );
}
