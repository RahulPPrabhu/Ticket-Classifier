import { classifyTickets } from '@/utils/classifyTickets';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const issues: string[] = Array.isArray(body.issues)
            ? body.issues
            : Array.isArray(body.tickets)
                ? body.tickets
                : body.issue
                    ? [body.issue]
                    : [];

        if (issues.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'No issues provided for classification. Expected { issues: string[] }',
                },
                { status: 400 }
            );
        }

        const startTime = performance.now();

        const results = await Promise.all(
            issues.map(async (issue: string, index: number) => {
                try {
                    const res = await classifyTickets(String(issue || ''));
                    return {
                        index,
                        issue,
                        success: res.success,
                        isClassified: res.isClassified,
                        category: res.category || 'unclassified',
                    };
                } catch (err) {
                    console.error(`Error classifying ticket at index ${index}:`, err);
                    return {
                        index,
                        issue,
                        success: false,
                        isClassified: false,
                        category: 'unclassified',
                    };
                }
            })
        );

        const totalTimeMs = Math.round(performance.now() - startTime);

        const categoryCounts: Record<string, number> = {};
        results.forEach((item) => {
            const cat = item.category || 'unclassified';
            categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        });

        return NextResponse.json(
            {
                success: true,
                totalTimeMs,
                totalTickets: results.length,
                categoryCounts,
                results,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error in /api/classify:', error);

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Internal Server Error',
            },
            { status: 500 }
        );
    }
}
