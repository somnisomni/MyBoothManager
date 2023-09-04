import { ImATeapotException, Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class AppService {
  throwNotFoundException() {
    throw new NotFoundException();
  }

  throwTeapotException() {
    throw new ImATeapotException();
  }
}
