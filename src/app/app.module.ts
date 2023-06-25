import {Module} from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import {webConfig} from "../config/web/web.config";
import {DatabaseModule} from "../persistence/database.module";
import {UserModule} from "./user/user.module";
import {AuthWebModule} from "./auth/auth.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [webConfig],
        }),
        DatabaseModule,
        UserModule,
        AuthWebModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule {
}
