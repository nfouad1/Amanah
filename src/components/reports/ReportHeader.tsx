import { View, Text, StyleSheet } from '@react-pdf/renderer';
import type { ReportTranslations } from '@/types/reports';

interface ReportHeaderProps {
  title: string;
  translations: ReportTranslations;
  isRTL: boolean;
  generatedAt: Date;
  reportId: string;
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  topRowRTL: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orgName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  metaBlock: {
    alignItems: 'flex-end',
  },
  metaBlockRTL: {
    alignItems: 'flex-start',
  },
  metaText: {
    fontSize: 8,
    color: '#6b7280',
    marginBottom: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'left',
  },
  titleRTL: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'right',
  },
});

export function ReportHeader({
  title,
  translations,
  isRTL,
  generatedAt,
  reportId,
}: ReportHeaderProps) {
  const formattedDate = generatedAt.toISOString().replace('T', ' ').substring(0, 19);

  return (
    <View style={styles.header}>
      <View style={isRTL ? styles.topRowRTL : styles.topRow}>
        <Text style={styles.orgName}>{translations.organizationName}</Text>
        <View style={isRTL ? styles.metaBlockRTL : styles.metaBlock}>
          <Text style={styles.metaText}>
            {translations.reportId}: {reportId}
          </Text>
          <Text style={styles.metaText}>
            {translations.generatedAt}: {formattedDate}
          </Text>
        </View>
      </View>
      <Text style={isRTL ? styles.titleRTL : styles.title}>{title}</Text>
    </View>
  );
}
