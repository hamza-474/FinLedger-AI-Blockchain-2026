import { useEffect } from 'react';

const useTitle = (title) => {
  useEffect(() => {
    document.title = title ? `${title} | FinLedger AI` : 'FinLedger AI';
  }, [title]);
};

export default useTitle;
