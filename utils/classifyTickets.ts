import { choice, TypeSafeClient } from "@typesafe-ai/sdk";

export const classifyTickets = async (issue: string) => {
    try {
        const client = new TypeSafeClient();
        const response = await client.systemOne({
            state: { document: issue },
            questions: {
                category: choice("What is this ticket about?", {
                    account_access: null,
                    billing: null,
                    refund_request: null,
                    bug_report: null,
                    shipping_delivery: null
                }),
            },
        });

        return { success: true, isClassified: true, category: response.answers.category.choice };
    } catch (error) {
        console.error("error from classifyTickets: ", error);
        return { success: false, isClassified: false };
    }
}