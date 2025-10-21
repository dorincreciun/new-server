import { createApp, ensureSchemaCompatibility } from './server';
import { config } from './config';

(async () => {
  await ensureSchemaCompatibility();
  const app = createApp();
  app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
  });
})();


