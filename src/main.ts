import './styles/main.css';
import { Wizard } from './wizard/Wizard';

const app = document.getElementById('app');
if (!app) throw new Error('#app not found');

new Wizard(app);
