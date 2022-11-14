import React, { useRef } from "react";

const TransferFormModal = ({
  showModal,
  closeModal,
  onSubmit,
  title,
}: {
  title: string;
  showModal: boolean;
  closeModal: () => void;
  onSubmit: (val: string | null) => Promise<void>;
}) => {
  const addressRef = useRef<HTMLInputElement>(null);

  return (
    <>
      {showModal ? (
        <>
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative my-6">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-[600px] bg-gray-300 outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-gray-800 rounded-t ">
                  <h3 className="text-3xl font=semibold">{title}</h3>
                  <button
                    className="bg-transparent border-0 text-black float-right"
                    onClick={closeModal}
                  >
                    <span className="text-black opacity-7 h-6 w-6 text-xl block bg-gray-400 pb-8 -px-4 rounded-full">
                      x
                    </span>
                  </button>
                </div>
                <div className="relative p-6 flex-auto">
                  <label className="block text-black text-sm font-bold mb-1">
                    Transfer Address
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-1 text-black mt-2"
                    ref={addressRef}
                  />
                </div>
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-black background-transparent uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                  <button
                    className="text-white bg-blue-800 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={async () => {
                      await onSubmit(addressRef.current?.value || null);
                    }}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default TransferFormModal;
