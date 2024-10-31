import { inject } from "@angular/core";
import { PagedResponse } from "@models/custom/pagedResonse";
import { AgentBaseInfo } from "@models/types/agentBaseInfo";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { AgentService } from "@services/agent.service";

type AdminDashBoard = {
    agents: PagedResponse<AgentBaseInfo>,
    agent: AgentBaseInfo
}
const initialState: AdminDashBoard = {
    agents: {
        data: [],
        metadata: {
            totalCount: 0,
            pageSize: 0,
            currentPage: 0,
            totalPages: 0,
            hasPreviousPage: false,
            hasNextPage: false
        }
    },
    agent: {
        agentNumber: "",
        shortName: "",
        name: "",
        lastName: "",
        email: "",
        id: "",
        airportId: ""
    }
}

export const AdminDashBoardStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store, agentService = inject(AgentService)) => ({
        async getPagedAgents(pageNumber?: number, pageSize?: number): Promise<void> {
            const agents = await agentService.getPaged(pageNumber, pageSize, "GetActiveAgentsPaged");
            patchState(store, { agents })
        },
        agentSelected(agent: AgentBaseInfo): void {
            patchState(store, { agent: agent });
        },
        agentUnSelected(): void {
            patchState(store, { agent: undefined });
        }
    }))
);