import { NextRequest, NextResponse } from 'next/server';
import { ReportService } from '@/services/reports/ReportService';
import { PDFGeneratorService } from '@/services/reports/PDFGeneratorService';
import type { Language } from '@/types/reports';

const reportService = new ReportService();
const pdfService = new PDFGeneratorService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      userRole,
      language = 'en',
      campaignIds,
      status,
      groupId,
      startDate,
      endDate,
    } = body;

    // Validate authentication
    if (!userId || !userRole) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Admin-only endpoint
    if (userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: only admins can generate campaign reports' },
        { status: 403 }
      );
    }

    // Validate language
    const validLanguages: Language[] = ['en', 'sv', 'ar'];
    const lang: Language = validLanguages.includes(language) ? language : 'en';

    // Parse date range
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

    if (parsedStartDate && parsedEndDate && parsedStartDate > parsedEndDate) {
      return NextResponse.json(
        { error: 'Start date must be before end date' },
        { status: 400 }
      );
    }

    // Fetch campaign data
    const campaigns = await reportService.queryCampaigns({
      campaignIds,
      status,
      groupId,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
    });

    if (campaigns.length === 0) {
      return NextResponse.json(
        { error: 'No campaigns found matching the specified filters' },
        { status: 404 }
      );
    }

    // Calculate stats
    const campaignStats = campaigns.map(c => reportService.calculateCampaignStats(c));
    const aggregateStats = reportService.calculateAggregateStats(campaignStats);
    const reportId = pdfService.generateReportId();

    const reportData = {
      reportId,
      generatedAt: new Date(),
      dateRange: {
        start: parsedStartDate ?? null,
        end: parsedEndDate ?? null,
      },
      campaigns: campaignStats,
      aggregateStats,
    };

    // Generate PDF
    const pdfBuffer = await pdfService.generateCampaignPDF(reportData, lang);

    // Build filename
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `campaign-report-${dateStr}-${reportId}.pdf`;

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error generating campaign report:', error);
    return NextResponse.json(
      { error: 'Internal server error while generating report' },
      { status: 500 }
    );
  }
}
