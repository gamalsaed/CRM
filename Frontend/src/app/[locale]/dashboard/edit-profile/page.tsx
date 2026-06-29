import EditUser from "../_components/edit-user";

/** Edit-profile page. Renders the shared EditUser form without a target user ID, defaulting to the current session user. */
export default function page() {
  return <EditUser />;
}
