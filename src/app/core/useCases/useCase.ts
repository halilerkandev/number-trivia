import * as Either from "fp-ts/Either";
import { Entity } from "../entities/entity";
import { Failure } from "../error/failures";

export abstract class UseCase<F extends Failure, T extends Entity, P = any> {
  abstract execute(params?: P): Promise<Either.Either<F, T>>;
}
