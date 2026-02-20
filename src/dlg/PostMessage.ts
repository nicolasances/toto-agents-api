import { JobsClient } from "@google-cloud/run";
import { Request } from "express";
import { TotoDelegate, UserContext, ValidationError } from "totoms";

/**
 * Posts a conversation message to a specific Agent
 */
export class PostMessage extends TotoDelegate<PostMessageRequest, PostMessageResponse> {
    
    async do(req: PostMessageRequest, userContext?: UserContext): Promise<PostMessageResponse> {

        const { agentId, conversationId, message } = req;

        const projectId = process.env.GCP_PID;
        const region = "europe-west1";
        const jobId = "toto-job-node";

        const jobName = `projects/${projectId}/locations/${region}/jobs/${jobId}`;

        const env = [
            { name: "AGENT_ID", value: agentId },
            conversationId ? { name: "CONVERSATION_ID", value: conversationId } : undefined,
            { name: "MESSAGE", value: message },
        ].filter(Boolean) as { name: string; value: string }[];

        const client = new JobsClient();
        const [operation] = await client.runJob({
            name: jobName,
        });

        return { message: `Cloud Run job started: ${operation.name || jobName}` };
    }
    
    parseRequest(req: Request): PostMessageRequest {

        // Validations 
        if (!req.body.agentId) throw new ValidationError(400, "agentId is required");
        if (!req.body.message) throw new ValidationError(400, "message is required");

        return {
            agentId: req.body.agentId,
            conversationId: req.body.conversationId,
            message: req.body.message
        };
    }
}

interface PostMessageRequest {
    agentId: string;            // The Id of the agent to which the message should be posted
    conversationId?: string;    // The Id of the conversation to which the message should be posted. If not provided, a new conversation will be created
    message: string;            // The content of the message to post
}
interface PostMessageResponse {
    message: string;
}