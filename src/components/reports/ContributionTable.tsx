import { View, Text, StyleSheet } from '@react-pdf/renderer';
import type { ContributionRow, ReportTranslations } from '@/types/reports';

interface ContributionTableProps {
  contributions: ContributionRow[];
  translations: ReportTranslations;
  isRTL: boolean;
  formatCurrency: (amount: number, currency: string) => string;
  formatDate: (date: Date) => string;
}

const COL_WIDTHS = {
  date: '18%',
  campaign: '28%',
  beneficiary: '24%',
  amount: '18%',
  currency: '12%',
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 6,
    textAlign: 'left',
  },
  sectionTitleRTL: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 6,
    textAlign: 'right',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1e40af',
    paddingVertical: 5,
    paddingHorizontal: 4,
  },
  tableHeaderRTL: {
    flexDirection: 'row-reverse',
    backgroundColor: '#1e40af',
    paddingVertical: 5,
    paddingHorizontal: 4,
  },
  headerCell: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'left',
  },
  headerCellRTL: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'right',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  tableRowRTL: {
    flexDirection: 'row-reverse',
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  tableRowAlt: {
    backgroundColor: '#f9fafb',
  },
  cell: {
    fontSize: 8,
    color: '#374151',
    textAlign: 'left',
  },
  cellRTL: {
    fontSize: 8,
    color: '#374151',
    textAlign: 'right',
  },
  subtotalRow: {
    flexDirection: 'row',
    paddingVertical: 4,
    paddingHorizontal: 4,
    backgroundColor: '#eff6ff',
    borderTopWidth: 1,
    borderTopColor: '#bfdbfe',
  },
  subtotalRowRTL: {
    flexDirection: 'row-reverse',
    paddingVertical: 4,
    paddingHorizontal: 4,
    backgroundColor: '#eff6ff',
    borderTopWidth: 1,
    borderTopColor: '#bfdbfe',
  },
  subtotalLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#1e40af',
    textAlign: 'left',
  },
  subtotalLabelRTL: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#1e40af',
    textAlign: 'right',
  },
  campaignGroupHeader: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 4,
    backgroundColor: '#dbeafe',
    marginTop: 6,
  },
  campaignGroupHeaderRTL: {
    flexDirection: 'row-reverse',
    paddingVertical: 5,
    paddingHorizontal: 4,
    backgroundColor: '#dbeafe',
    marginTop: 6,
  },
  campaignGroupTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1e3a8a',
    textAlign: 'left',
  },
  campaignGroupTitleRTL: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1e3a8a',
    textAlign: 'right',
  },
});

/**
 * Groups contributions by campaign name and returns them in order.
 */
function groupByCampaign(
  contributions: ContributionRow[]
): Map<string, ContributionRow[]> {
  const map = new Map<string, ContributionRow[]>();
  for (const row of contributions) {
    const key = row.campaignName;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(row);
  }
  return map;
}

/**
 * Calculates subtotals per currency for a group of contributions.
 */
function calcSubtotals(rows: ContributionRow[]): Map<string, number> {
  const totals = new Map<string, number>();
  for (const row of rows) {
    totals.set(row.currency, (totals.get(row.currency) ?? 0) + row.amount);
  }
  return totals;
}

export function ContributionTable({
  contributions,
  translations,
  isRTL,
  formatCurrency,
  formatDate,
}: ContributionTableProps) {
  const grouped = groupByCampaign(contributions);

  return (
    <View style={styles.section}>
      <Text style={isRTL ? styles.sectionTitleRTL : styles.sectionTitle}>
        {translations.contributions}
      </Text>

      {/* Table header */}
      <View style={isRTL ? styles.tableHeaderRTL : styles.tableHeader}>
        <Text style={[isRTL ? styles.headerCellRTL : styles.headerCell, { width: COL_WIDTHS.date }]}>
          {translations.date}
        </Text>
        <Text style={[isRTL ? styles.headerCellRTL : styles.headerCell, { width: COL_WIDTHS.campaign }]}>
          {translations.campaign}
        </Text>
        <Text style={[isRTL ? styles.headerCellRTL : styles.headerCell, { width: COL_WIDTHS.beneficiary }]}>
          {translations.beneficiary}
        </Text>
        <Text style={[isRTL ? styles.headerCellRTL : styles.headerCell, { width: COL_WIDTHS.amount }]}>
          {translations.amount}
        </Text>
        <Text style={[isRTL ? styles.headerCellRTL : styles.headerCell, { width: COL_WIDTHS.currency }]}>
          {translations.currency}
        </Text>
      </View>

      {/* Rows grouped by campaign */}
      {Array.from(grouped.entries()).map(([campaignName, rows]) => {
        const subtotals = calcSubtotals(rows);
        return (
          <View key={campaignName}>
            {/* Campaign group header */}
            <View style={isRTL ? styles.campaignGroupHeaderRTL : styles.campaignGroupHeader}>
              <Text style={isRTL ? styles.campaignGroupTitleRTL : styles.campaignGroupTitle}>
                {campaignName}
              </Text>
            </View>

            {/* Contribution rows */}
            {rows.map((row, idx) => (
              <View
                key={idx}
                style={[
                  isRTL ? styles.tableRowRTL : styles.tableRow,
                  idx % 2 === 1 ? styles.tableRowAlt : {},
                ]}
              >
                <Text style={[isRTL ? styles.cellRTL : styles.cell, { width: COL_WIDTHS.date }]}>
                  {formatDate(row.date)}
                </Text>
                <Text style={[isRTL ? styles.cellRTL : styles.cell, { width: COL_WIDTHS.campaign }]}>
                  {row.campaignName}
                </Text>
                <Text style={[isRTL ? styles.cellRTL : styles.cell, { width: COL_WIDTHS.beneficiary }]}>
                  {row.beneficiaryName}
                </Text>
                <Text style={[isRTL ? styles.cellRTL : styles.cell, { width: COL_WIDTHS.amount }]}>
                  {formatCurrency(row.amount, row.currency)}
                </Text>
                <Text style={[isRTL ? styles.cellRTL : styles.cell, { width: COL_WIDTHS.currency }]}>
                  {row.currency}
                </Text>
              </View>
            ))}

            {/* Campaign subtotal rows (one per currency) */}
            {Array.from(subtotals.entries()).map(([currency, total]) => (
              <View key={currency} style={isRTL ? styles.subtotalRowRTL : styles.subtotalRow}>
                <Text
                  style={[
                    isRTL ? styles.subtotalLabelRTL : styles.subtotalLabel,
                    { width: `${100 - parseFloat(COL_WIDTHS.amount) - parseFloat(COL_WIDTHS.currency)}%` },
                  ]}
                >
                  {translations.total} ({campaignName})
                </Text>
                <Text
                  style={[
                    isRTL ? styles.subtotalLabelRTL : styles.subtotalLabel,
                    { width: COL_WIDTHS.amount },
                  ]}
                >
                  {formatCurrency(total, currency)}
                </Text>
                <Text
                  style={[
                    isRTL ? styles.subtotalLabelRTL : styles.subtotalLabel,
                    { width: COL_WIDTHS.currency },
                  ]}
                >
                  {currency}
                </Text>
              </View>
            ))}
          </View>
        );
      })}
    </View>
  );
}
