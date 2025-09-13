// src/context/RoleProvider.jsx
import { AdminProvider } from "./AdminContext";
import { MentorProvider } from "./MentorContext";
import { UserProvider } from "./UserContext";

export default function RoleProvider({ children }) {
  return (
    <AdminProvider>
      <MentorProvider>
        <UserProvider>
          {children}
        </UserProvider>
      </MentorProvider>
    </AdminProvider>
  );
}
