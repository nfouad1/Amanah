import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import type { DonationReportData, ReportTranslations, CurrencyTotal } from '@/types/reports';
import { ReportHeader } from './ReportHeader';
import { ReportFooter } from './ReportFooter';
import { ContributionTable } from './ContributionTable';

interface DonationReportTemplateProps {
  data: DonationReportData;
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

  // Member info section
  memberSection: {
    marginBottom: 16,
    padding: 10,
    backgroundColor: '#f9fafb',
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#2563eb',
  },
  memberSectionRTL: {
    marginBottom: 16,
    padding: 10,
    backgroundColor: '#f9fafb',
    borderRadius: 4,
    borderRightWidth: 3,
    borderRightColor: '#2563eb',
  },
  memberRow: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  memberRowRTL: {
    flexDirection: 'row-reverse',
    marginBottom: 3,
  },
  memberLabel: {
    fontSize: 8,
    color: '#6b7280',
    width: '30%',
    textAlign: 'left',
  },
  memberLabelRTL: {
    fontSize: 8,
    color: '#6b7280',
    width: '30%',
    textAlign: 'right',
  },
  memberValue: {
    fontSize: 8,
    color: '#111827',
    fontWeight: 'bold',
    textAlign: 'left',
  },
  memberValueRTL: {
    fontSize: 8,
    color: '#111827',
    fontWeight: 'bold',
    textAlign: 'right',
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

  // Totals section
  totalsSection: {
    marginTop: 8,
    marginBottom: 16,
  },
  totalsSectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 6,
    textAlign: 'left',
  },
  totalsSectionTitleRTL: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 6,
    textAlign: 'right',
  },
  totalsTable: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 4,
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  totalsRowRTL: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  totalsRowLast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  totalsRowLastRTL: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  totalsCurrency: {
    fontSize: 9,
    color: '#374151',
    textAlign: 'left',
  },
  totalsCurrencyRTL: {
    fontSize: 9,
    color: '#374151',
    textAlign: 'right',
  },
  totalsAmount: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1e40af',
    textAlign: 'right',
  },
  totalsAmountRTL: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1e40af',
    textAlign: 'left',
  },

  // Disclaimer section
  disclaimerSection: {
    marginTop: 16,
    padding: 10,
    backgroundColor: '#fefce8',
    borderWidth: 1,
    borderColor: '#fde68a',
    borderRadius: 4,
  },
  disclaimerText: {
    fontSize: 7,
    color: '#92400e',
    textAlign: 'left',
    lineHeight: 1.4,
  },
  disclaimerTextRTL: {
    fontSize: 7,
    color: '#92400e',
    textAlign: 'right',
    lineHeight: 1.4,
  },

  // No contributions message
  noContributions: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 4,
    alignItems: 'center',
  },
  noContributionsText: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
  },
});

function TotalsSection({
  totals,
  translations,
  isRTL,
  formatCurrency,
}: {
  totals: CurrencyTotal[];
  translations: ReportTranslations;
  isRTL: boolean;
  formatCurrency: (amount: number, currency: string) => string;
}) {
  return (
    <View style={styles.totalsSection}>
      <Text style={isRTL ? styles.totalsSectionTitleRTL : styles.totalsSectionTitle}>
        {translations.total}
      </Text>
      <View style={styles.totalsTable}>
        {totals.map((t, idx) => {
          const isLast = idx === totals.length - 1;
          return (
            <View
              key={t.currency}
              style={
                isLast
                  ? isRTL
                    ? styles.totalsRowLastRTL
                    : styles.totalsRowLast
                  : isRTL
                  ? styles.totalsRowRTL
                  : styles.totalsRow
              }
            >
              <Text style={isRTL ? styles.totalsCurrencyRTL : styles.totalsCurrency}>
                {t.currency}
              </Text>
              <Text style={isRTL ? styles.totalsAmountRTL : styles.totalsAmount}>
                {formatCurrency(t.total, t.currency)}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export function DonationReportTemplate({
  data,
  translations,
  isRTL,
  formatCurrency,
  formatDate,
}: DonationReportTemplateProps) {
  const { reportId, generatedAt, user, dateRange, contributions, totals, disclaimer } = data;

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
          title={translations.title}
          translations={translations}
          isRTL={isRTL}
          generatedAt={generatedAt}
          reportId={reportId}
        />

        {/* Member info */}
        <View style={isRTL ? styles.memberSectionRTL : styles.memberSection}>
          <View style={isRTL ? styles.memberRowRTL : styles.memberRow}>
            <Text style={isRTL ? styles.memberLabelRTL : styles.memberLabel}>
              {translations.memberName}:
            </Text>
            <Text style={isRTL ? styles.memberValueRTL : styles.memberValue}>
              {user.name}
            </Text>
          </View>
          <View style={isRTL ? styles.memberRowRTL : styles.memberRow}>
            <Text style={isRTL ? styles.memberLabelRTL : styles.memberLabel}>
              {translations.memberEmail}:
            </Text>
            <Text style={isRTL ? styles.memberValueRTL : styles.memberValue}>
              {user.email}
            </Text>
          </View>
        </View>

        {/* Date range */}
        <View style={isRTL ? styles.dateRangeSectionRTL : styles.dateRangeSection}>
          <Text style={isRTL ? styles.dateRangeLabelRTL : styles.dateRangeLabel}>
            {translations.dateRange}:
          </Text>
          <Text style={styles.dateRangeValue}>{dateRangeText}</Text>
        </View>

        {/* Contributions table grouped by campaign with subtotals */}
        {contributions.length > 0 ? (
          <>
            <ContributionTable
              contributions={contributions}
              translations={translations}
              isRTL={isRTL}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
            />

            {/* Currency totals */}
            <TotalsSection
              totals={totals}
              translations={translations}
              isRTL={isRTL}
              formatCurrency={formatCurrency}
            />
          </>
        ) : (
          <View style={styles.noContributions}>
            <Text style={styles.noContributionsText}>
              {translations.title}
            </Text>
          </View>
        )}

        {/* Tax disclaimer */}
        <View style={styles.disclaimerSection}>
          <Text style={isRTL ? styles.disclaimerTextRTL : styles.disclaimerText}>
            {disclaimer}
          </Text>
        </View>

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
