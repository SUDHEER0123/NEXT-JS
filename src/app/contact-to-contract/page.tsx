import ProtectedRoute from "@/components/ProtectedRoute";
import { IActionMenuItem } from "@/components/ActionMenu/action-menu";
import ContactToContractWrapper from "./components/contactToContractWrapper";

interface IContactLifeCycle {}

export const metadata = {
  title: "Contact To Contract - Lagonda - Aston Martin",
  description: "Convert Opportunity to Contract",
};

const ContactToContractPage: React.FC<IContactLifeCycle> = () => {
  return (
    <>
      <ProtectedRoute>
        <ContactToContractWrapper />
      </ProtectedRoute>
    </>
  )
};

export default ContactToContractPage;