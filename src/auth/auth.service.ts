import {Inject, Injectable, Logger} from "@nestjs/common";
import {AppFeature} from "./AppFeature";

@Injectable()
export class AuthService{

    private readonly logger = new Logger("Auth");

    constructor(
        @Inject('FEATURES')
        private readonly features: {[k: string]: AppFeature}
    ){
    }

    public async populate_features(features: string[]){
        return features.reduce((r, f) => Object.assign(r, {[f]: this.features[f]}), {})
    }

}