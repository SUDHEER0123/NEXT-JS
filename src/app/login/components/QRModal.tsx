import Button from "@/components/ui/Button/Button";
import CopyText from "@/components/ui/CopyText/CopyText";
import WideInput from "@/components/ui/WideInput/WideInput";
import { Dialog, Transition, DialogPanel, TransitionChild } from "@headlessui/react";
import { Fragment } from "react";
import { useRouter } from "next/navigation";

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSetup?: boolean;
}

const QRModal: React.FC<QRModalProps> = ({ isOpen, onClose, isSetup = false }) => {
  const router = useRouter();
  
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Background overlay */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
        </TransitionChild>

        {/* Modal content */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className={`flex w-1/2 ${isSetup ? 'max-w-sm':'max-w-3xl'} overflow-hidden bg-white shadow-lg`}>
              {!isSetup && (
                <div className="flex flex-col items-center justify-center w-1/2 p-6">
                  <img
                    src="https://via.placeholder.com/150"
                    alt="QR Code"
                    className="w-32 h-32"
                  />
                  <p className="mt-4 text-sm text-gray-500">Input Manually</p>
                  <CopyText text="NMSG JUAR WG4Q 15JQ LRZO ESA5" textClassName="text-md" />
                </div>
              )}
              <div className={`${isSetup ? 'w-full':'w-1/2'} p-6 bg-neutrals-high border-t-brand-secondary border-t-2`}>
                <div className="flex flex-col space-y-8">
                  {isSetup && (
                    <div className="flex flex-col space-y-4 text-center">
                      <p className="text-white text-2xl font-normal">Enter the 6-digit code from your authenticator app</p>
                    </div>
                  )}
                  {!isSetup && (
                    <div className="flex flex-col space-y-4 text-justify">
                      <p className="text-white text-2xl font-normal">Two-Factor Authentication</p>
                      <p className="text-neutrals-low text-sm font-extralight">1. Install or open Google Authenticator or a similar third- party authenticator app on your mobile device.</p>
                      <p className="text-neutrals-low text-sm font-extralight">2. Scan the QR code using the authenticator app and enter the 6-digit code from the authenticator app.</p>
                    </div>
                  )}
                  <WideInput />
                  {isSetup && (
                    <div className="flex flex-col space-y-4">
                      <Button variant="transparent">Try another way</Button>
                      <Button onClick={() => router.push('/dashboard')} className="mt-4 w-full bg-brand-primary py-3 text-white hover:bg-brand-primary-hover" variant="primary">
                        Verify Code
                      </Button>
                      <Button onClick={onClose} className="mt-4 w-full py-3" variant="black">
                        Cancel
                      </Button>
                    </div>
                  )}
                  {!isSetup && (
                    <div className="flex flex-row space-x-4">
                      <Button onClick={onClose} className="mt-4 w-full py-3">
                        Cancel
                      </Button>
                      <Button onClick={() => router.push('/dashboard')} className="mt-4 w-full bg-brand-primary py-3 text-white hover:bg-brand-primary-hover">
                        Verify Code
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};

export default QRModal;
