import fs = require('fs')
import { appConfig } from '../app.config'

fs.writeFileSync(
  'ormconfig.json',
  JSON.stringify(appConfig.getTypeOrmConfig(), null, 2)
)
