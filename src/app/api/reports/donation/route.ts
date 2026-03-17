import { NextRequest, NextResponse } from 'next/server';
import { ReportService } from '@/services/reports/ReportService';
import { PDFGeneratorService } from '@/services/reports/PDFGeneratorService';
import type { Language } from '@/types/reports';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Roles allowed to generate donation reports
const ALLOWED_ROLES = ['admin', 'contributor', 'member'];

export async function POST(request: NextRequest) {
  const reportService = new ReportService();
  const pdfService = new PDFGeneratorService();
  try {
    const body = await request.json();
    const { userId, userRole, userName, userEmail, startDate, endDate, language = 'en' } = body;

    // Validate authentication
    if (!userId || !userRole) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate role authorization
    if (!ALLOWED_ROLES.includes(userRole)) {
      return NextResponse.json(
        { error: 'Forbidden: viewers cannot generate reports' },
        { status: 403 }
      );
    }

    // Validate language
    const validLanguages: Language[] = ['en', 'sv', 'ar'];
    const lang: Language = validLanguages.includes(language) ? language : 'en';

    // Parse and validate date range
    let parsedStartDate: Date | undefined;
    let parsedEndDate: Date | undefined;

    if (startDate) {
      parsedStartDate = new Date(startDate);
      if (isNaN(parsedStartDate.getTime())) {
        return NextResponse.json({ error: 'Invalid start date' }, { status: 400 });
      }
    }

    if (endDate) {
      parsedEndDate = new Date(endDate);
      if (isNaN(parsedEndDate.getTime())) {
        return NextResponse.json({ error: 'Invalid end date' }, { status: 400 });
      }
    }

    // Validate date range logic
    const validation = reportService.validateDateRange(parsedStartDate, parsedEndDate);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Fetch contribution data
    const contributions = await reportService.queryUserContributions(
      userId,
      parsedStartDate,
      parsedEndDate
    );

    if (contributions.length === 0) {
      return NextResponse.json(
        { error: 'No contributions found for the specified period' },
        { status: 404 }
      );
    }

    const currencyTotals = reportService.calculateCurrencyTotals(contributions);
    const reportId = pdfService.generateReportId();

    const reportData = {
      reportId,
      generatedAt: new Date(),
      dateRange: {
        start: parsedStartDate ?? null,
        end: parsedEndDate ?? null,
      },
      user: {
        name: userName || 'Unknown',
        email: userEmail || '',
      },
      contributions,
      totals: currencyTotals,
      disclaimer: '',
    };

    // Generate PDF
    const pdfBuffer = await pdfService.generateDonationPDF(reportData, lang);

    // Build filename
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `donation-report-${dateStr}-${reportId}.pdf`;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error generating donation report:', error);
    return NextResponse.json(
      { error: 'Internal server error while generating report' },
      { status: 500 }
    );
  }
}
