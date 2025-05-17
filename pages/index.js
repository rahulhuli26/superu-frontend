// export default function Home() {
//     return <h1 className="p-6">Welcome to SuperU Editor</h1>;
//   }

import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push('/auth/signup');
  }, []);
  return null;
}
