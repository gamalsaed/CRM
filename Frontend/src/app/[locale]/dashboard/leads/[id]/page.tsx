import { getLead } from "@/shared/lib/actions/leads.action";
import LeadDetails from "./_components/lead-details";
import { NotesList } from "./_components/notes-list";

export default async function page({ params }: { params: { id: string } }) {
  const { id } = await params;
  const data = await getLead(id);
  const lead = data.data.lead;

  return (
    <div>
      <LeadDetails
        name={lead.name}
        phone={lead.phone}
        whatsApp={lead.whatsApp}
        projectName={lead.project?.name || "Not Assigned yet"}
        createdAt={lead.createdAt}
        createdBy={lead.createdBy?.name || "-"}
        email={lead.email}
        source={lead.source}
        assignedTo={lead.assignedTo?.name || "Not Assigned yet"}
        status={lead.status}
      />
      <NotesList notes={lead.notes} />
    </div>
  );
}
