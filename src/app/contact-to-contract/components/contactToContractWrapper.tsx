'use client';

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ContactToContract from "./contact-to-contract";

const ContactToContractWrapper = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderUid = searchParams.get('orderUID');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (orderUid) {
      setIsOpen(true);
    }
  }, [orderUid]);

  const handleClose = () => {
    setIsOpen(false);
    router.back();
  };

  return (
    <ContactToContract isOpen={isOpen} onClose={handleClose} orderUid={orderUid ?? undefined} />
  );
};

export default ContactToContractWrapper;
