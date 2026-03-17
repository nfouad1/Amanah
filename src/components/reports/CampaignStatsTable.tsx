import { View, Text, StyleSheet } from '@react-pdf/renderer';
import type { CampaignStats, ReportTranslations } from '@/types/reports';

interface CampaignStatsTableProps {
  campaigns: CampaignStats[];
  translations: ReportTranslations;
  isRTL: boolean;
  formatCurrency: (amount: number, currency: string) => string;
  formatDate: (date: Date) => string;
}

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
  campaignCard: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e40af',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  cardHeaderRTL: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e40af',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  cardTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'left',
  },
  cardTitleRTL: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'right',
  },
  statusBadge: {
    fontSize: 7,
    color: '#bfdbfe',
    textTransform: 'uppercase',
  },
  cardBody: {
    padding: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  statsGridRTL: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  statItem: {
    width: '33%',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 7,
    color: '#6b7280',
    textAlign: 'left',
  },
  statLabelRTL: {
    fontSize: 7,
    color: '#6b7280',
    textAlign: 'right',
  },
  statValue: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'left',
  },
  statValueRTL: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'right',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    marginTop: 4,
    marginBottom: 2,
  },
  progressBarFill: {
    height: 6,
    backgroundColor: '#2563eb',
    borderRadius: 3,
  },
  progressLabel: {
    fontSize: 7,
    color: '#6b7280',
    textAlign: 'left',
  },
  progressLabelRTL: {
    fontSize: 7,
    color: '#6b7280',
    textAlign: 'right',
  },
  description: {
    fontSize: 8,
    color: '#4b5563',
    marginBottom: 6,
    textAlign: 'left',
  },
  descriptionRTL: {
    fontSize: 8,
    color: '#4b5563',
    marginBottom: 6,
    textAlign: 'right',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    marginVertical: 4,
  },
});

export function CampaignStatsTable({
  campaigns,
  translations,
  isRTL,
  formatCurrency,
  formatDate,
}: CampaignStatsTableProps) {
  return (
    <View style={styles.section}>
      <Text style={isRTL ? styles.sectionTitleRTL : styles.sectionTitle}>
        {translations.campaignTitle}
      </Text>

      {campaigns.map((campaign) => {
        const fundingPct = Math.min(campaign.fundingPercentage, 100);
        const progressWidth = `${fundingPct}%`;

        return (
          <View key={campaign.id} style={styles.campaignCard}>
            {/* Card header */}
            <View style={isRTL ? styles.cardHeaderRTL : styles.cardHeader}>
              <Text style={isRTL ? styles.cardTitleRTL : styles.cardTitle}>
                {campaign.title}
              </Text>
              <Text style={styles.statusBadge}>{campaign.status}</Text>
            </View>

            <View style={styles.cardBody}>
              {/* Beneficiary */}
              <Text style={isRTL ? styles.descriptionRTL : styles.description}>
                {translations.beneficiary}: {campaign.beneficiaryName}
              </Text>

              {/* Description */}
              {campaign.description ? (
                <Text style={isRTL ? styles.descriptionRTL : styles.description}>
                  {campaign.description}
                </Text>
              ) : null}

              <View style={styles.divider} />

              {/* Stats grid */}
              <View style={isRTL ? styles.statsGridRTL : styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={isRTL ? styles.statLabelRTL : styles.statLabel}>
                    {translations.targetAmount}
                  </Text>
                  <Text style={isRTL ? styles.statValueRTL : styles.statValue}>
                    {formatCurrency(campaign.targetAmount, campaign.currency)}
                  </Text>
                </View>

                <View style={styles.statItem}>
                  <Text style={isRTL ? styles.statLabelRTL : styles.statLabel}>
                    {translations.currentAmount}
                  </Text>
                  <Text style={isRTL ? styles.statValueRTL : styles.statValue}>
                    {formatCurrency(campaign.currentAmount, campaign.currency)}
                  </Text>
                </View>

                <View style={styles.statItem}>
                  <Text style={isRTL ? styles.statLabelRTL : styles.statLabel}>
                    {translations.contributors}
                  </Text>
                  <Text style={isRTL ? styles.statValueRTL : styles.statValue}>
                    {campaign.contributorCount}
                  </Text>
                </View>

                <View style={styles.statItem}>
                  <Text style={isRTL ? styles.statLabelRTL : styles.statLabel}>
                    {translations.averageContribution}
                  </Text>
                  <Text style={isRTL ? styles.statValueRTL : styles.statValue}>
                    {formatCurrency(campaign.averageContribution, campaign.currency)}
                  </Text>
                </View>

                <View style={styles.statItem}>
                  <Text style={isRTL ? styles.statLabelRTL : styles.statLabel}>
                    {translations.startDate}
                  </Text>
                  <Text style={isRTL ? styles.statValueRTL : styles.statValue}>
                    {formatDate(campaign.startDate)}
                  </Text>
                </View>

                <View style={styles.statItem}>
                  <Text style={isRTL ? styles.statLabelRTL : styles.statLabel}>
                    {translations.endDate}
                  </Text>
                  <Text style={isRTL ? styles.statValueRTL : styles.statValue}>
                    {campaign.endDate ? formatDate(campaign.endDate) : '—'}
                  </Text>
                </View>
              </View>

              {/* Funding progress bar */}
              <Text style={isRTL ? styles.progressLabelRTL : styles.progressLabel}>
                {translations.fundingPercentage}: {campaign.fundingPercentage.toFixed(1)}%
              </Text>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBarFill, { width: progressWidth }]} />
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}
