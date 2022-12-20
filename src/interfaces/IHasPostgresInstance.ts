import IPlugin from "@gluestack/framework/types/plugin/interface/IPlugin";
import {IPostgres} from "@gluestack/glue-plugin-postgres/src/interfaces/IPostgres";
import IHasContainerController from "@gluestack/framework/types/plugin/interface/IHasContainerController";

export interface IHasPostgresInstance {
    getPostgresInstance(): IPlugin & IPostgres& IHasContainerController
}