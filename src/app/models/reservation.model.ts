import { Room } from "../services/room/room.service";

export interface ReservationData {
    name: string | null | undefined;
    purpose: string | undefined;
    semester: string | undefined;
    lessonType: string | undefined;
    studyLevel: string | undefined;
    projectOrganization: string | undefined;
    thesisSupervisor: string | undefined;
    thesisCommitteeMembers: string | undefined;
    projectName: string | undefined;
    projectDescription: string | undefined;
    roomIds: number[] | undefined; // Change to array of room IDs
    username: string | null | undefined;
}