import { createRoot } from 'react-dom/client';
import { Main } from './components/Main';
import './css/canvas.css'

function main()
{
    const container = document.getElementById('root');
    if (!container)
        return;
    const root = createRoot(container);
    root.render(<Main />);
}

main();
