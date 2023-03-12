import { createRoot } from 'react-dom/client';
import { Main } from './components/Main';
import { TextureResource } from './resources/TextureResource';
import { BlurShader } from './shaders/BlurShader';
import './css/canvas.css'

function main()
{
    const container = document.getElementById('root');
    const root = createRoot(container);
    root.render(<Main />);

    // Test area
    let bs = new BlurShader();
    bs.setFilterSize(17);
    let ts = new TextureResource(128, 128);
    bs.setInputs([ts]);
    bs.setOutputs([ts]);
    bs.compute();
}

main();
