import { createRoot } from 'react-dom/client';
import { Main } from './components/main';

function main()
{
    const container = document.getElementById('root');
    const root = createRoot(container);
    root.render(<Main />);
}

main();
