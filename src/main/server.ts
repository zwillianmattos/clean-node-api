import { MongoHelper } from "../infra/db/mongodb/helpers/mongo-helper";
import app from "./config/app";
import env from "./config/env";


MongoHelper.connect(env.MONGO_URL)
    .then( async () => {
        const app = (await import("./config/app")).default

        app.listen(env.PORT, () => console.log(`Running ${env.PORT}`))
    }).catch(console.error)
