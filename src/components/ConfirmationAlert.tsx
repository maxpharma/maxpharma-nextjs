import { FC, useEffect, useState } from 'react';

interface ConfirmationAlertProps {
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  highlightWord?: string;
}

const ConfirmationAlert: FC<ConfirmationAlertProps> = ({
  message,
  confirmText = "YES",
  cancelText = "NO",
  onConfirm,
  onCancel,
  highlightWord = "Delete",
}) => {
  const [isShowing, setIsShowing] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Delay to allow the DOM to update before animation starts
    const timer = setTimeout(() => {
      setIsShowing(true);
    }, 10);

    return () => clearTimeout(timer);
  }, []);

  const handleConfirm = () => {
    setIsClosing(true);
    setTimeout(() => {
      onConfirm();
    }, 300); // Match the animation duration
  };

  const handleCancel = () => {
    setIsClosing(true);
    setTimeout(() => {
      onCancel();
    }, 300); // Match the animation duration
  };

  // Function to highlight specific word in the message
  const renderMessage = () => {
    if (!highlightWord || !message.includes(highlightWord)) {
      return message;
    }
    
    const parts = message.split(highlightWord);
    return (
      <>
        {parts[0]}
        <span className="text-red-500">{highlightWord}</span>
        {parts[1]}
      </>
    );
  };

  return (
    <div
      className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 
        ${isShowing ? 'opacity-100' : 'opacity-0'} 
        ${isClosing ? 'opacity-0' : ''}
        transition-opacity duration-300`}
    >
      <div
        className={`
          bg-white rounded-lg p-6 max-w-md w-full mx-4 transition-all duration-300 ease-in-out
          sm:transform sm:transition-all sm:duration-300 sm:ease-in-out
          ${isShowing ? 'sm:scale-100' : 'sm:scale-0'}
          ${isClosing ? 'sm:scale-0' : ''}
          sm:opacity-100
          
          max-sm:w-full max-sm:m-0 max-sm:fixed max-sm:bottom-0 max-sm:left-0 max-sm:right-0 max-sm:rounded-b-none max-sm:rounded-t-lg
          max-sm:transform max-sm:transition-transform max-sm:duration-300 max-sm:ease-in-out
          ${isShowing ? 'max-sm:translate-y-0' : 'max-sm:translate-y-full'}
          ${isClosing ? 'max-sm:translate-y-full' : ''}
        `}
      >
        <div className="text-center mb-6">
          <p className="text-gray-700 text-lg font-medium">
            {renderMessage()}
          </p>
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={handleConfirm}
            className="flex-1 py-3 px-6 bg-red-500 hover:bg-red-600 text-white font-medium rounded-md transition-colors duration-200"
          >
            {confirmText}
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 py-3 px-6 border border-gray-300 text-red-500 font-medium rounded-md hover:bg-gray-50 transition-colors duration-200"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationAlert;