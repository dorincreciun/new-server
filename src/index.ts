import { createApp } from './server';
import { config } from './config';

const app = createApp();

app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});


