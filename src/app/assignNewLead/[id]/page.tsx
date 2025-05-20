import ProtectedRoute from "@/components/ProtectedRoute";
import PopUpWrapper from "../components/PopupWrapper";

export const metadata = {
  title: "Assign New Lead - Lagonda - Aston Martin",
  description: "Assign New Lead to Consultant",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;

  return (
    <ProtectedRoute>
      <PopUpWrapper id={id} />
    </ProtectedRoute>
  );
};

export default Page;
