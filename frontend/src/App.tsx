import { Providers } from '@/app/providers';
import { HomePage } from '@/pages/home/ui/home-page';

const App = () => {
  return (
    <Providers>
      <HomePage />
    </Providers>
  );
};

export default App;