import { View, Text, StyleSheet } from '@react-pdf/renderer';
import type { ReportTranslations } from '@/types/reports';

interface ReportFooterProps {
  reportId: string;
  translations: ReportTranslations;
  isRTL: boolean;
}

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerRTL: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 8,
    color: '#9ca3af',
  },
  pageNumber: {
    fontSize: 8,
    color: '#9ca3af',
  },
});

export function ReportFooter({
  reportId,
  translations,
  isRTL,
}: ReportFooterProps) {
  return (
    <View style={isRTL ? styles.footerRTL : styles.footer} fixed>
      <Text style={styles.footerText}>
        {translations.reportId}: {reportId}
      </Text>
      <Text
        style={styles.pageNumber}
        render={({ pageNumber: pn, totalPages: tp }) =>
          `${translations.page} ${pn} ${translations.of} ${tp}`
        }
      />
    </View>
  );
}
